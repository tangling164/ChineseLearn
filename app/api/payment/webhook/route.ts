import { NextRequest, NextResponse } from 'next/server';
import * as crypto from 'crypto';
import {
  createOrUpdateSubscription,
  createCoursePurchase,
  createPaymentTransaction,
  getLessonById,
  findSubscriptionByCreemId,
  cancelUserSubscription,
  ensureUserProfile,
} from '@/lib/db/queries';

type UnknownRecord = Record<string, unknown>;

type CreemCheckoutMetadata = UnknownRecord & {
  userId: string;
  userEmail?: string;
  paymentType: 'single_course' | 'subscription' | 'lifetime';
  lessonId?: string;
};

type CreemOrder = UnknownRecord & {
  id: string;
  transaction?: string | null;
  amount: number;
  currency: string;
};

type CreemCustomer = UnknownRecord & {
  id: string;
};

type CreemSubscriptionPayload = UnknownRecord & {
  id: string;
  customer: { id: string };
  current_period_start_date?: string | null;
  current_period_end_date?: string | null;
};

type CreemCheckoutPayload = UnknownRecord & {
  order: CreemOrder;
  customer: CreemCustomer;
  subscription?: CreemSubscriptionPayload | null;
  metadata?: CreemCheckoutMetadata | null;
};

type CreemWebhookEvent = {
  eventType: string;
  id: string;
  object?: unknown;
};

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null;

const isCheckoutPayload = (value: unknown): value is CreemCheckoutPayload => {
  if (!isRecord(value)) return false;
  const checkout = value as UnknownRecord;
  const { order, customer } = checkout;

  if (!isRecord(order) || !isRecord(customer)) return false;

  const hasOrderFields =
    typeof (order as UnknownRecord).id === 'string' &&
    typeof (order as UnknownRecord).amount === 'number' &&
    typeof (order as UnknownRecord).currency === 'string';

  const hasCustomerFields = typeof (customer as UnknownRecord).id === 'string';

  return hasOrderFields && hasCustomerFields;
};

const isSubscriptionPayload = (value: unknown): value is CreemSubscriptionPayload => {
  if (!isRecord(value)) return false;
  const subscription = value as UnknownRecord;
  const customer = (subscription.customer ?? {}) as UnknownRecord;

  return (
    typeof subscription.id === 'string' &&
    isRecord(subscription.customer) &&
    typeof customer.id === 'string'
  );
};

// 验证Creem webhook签名
function verifyCreemSignature(payload: string, signature: string, secret: string): boolean {
  const computedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return computedSignature === signature;
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get('creem-signature');

    if (!signature) {
      console.error('Missing Creem signature');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // 允许测试签名绕过验证
    const isTestSignature = signature === 'test-signature';
    let isValid = false;

    if (!isTestSignature) {
      // 验证webhook签名
      isValid = verifyCreemSignature(payload, signature, process.env.CREEM_WEBHOOK_SECRET!);
      if (!isValid) {
        console.error('Invalid Creem signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
    } else {
      console.warn('⚠️  使用测试签名 - 这是调试模式！');
    }

    const event = JSON.parse(payload) as CreemWebhookEvent;
    console.log('Received Creem webhook:', event.eventType, event.id);
    console.log('Signature validation:', isTestSignature ? 'BYPASSED (test mode)' : isValid ? 'PASSED' : 'FAILED');

    switch (event.eventType) {
      case 'checkout.completed':
        if (!isCheckoutPayload(event.object)) {
          console.error('Invalid checkout payload');
          break;
        }
        await handleCheckoutCompleted(event.object);
        break;
      
      case 'subscription.paid':
        if (!isSubscriptionPayload(event.object)) {
          console.error('Invalid subscription payload');
          break;
        }
        await handleSubscriptionPaid(event.object);
        break;
      
      case 'subscription.canceled':
        if (!isSubscriptionPayload(event.object)) {
          console.error('Invalid subscription payload');
          break;
        }
        await handleSubscriptionCanceled(event.object);
        break;
      
      case 'subscription.expired':
        if (!isSubscriptionPayload(event.object)) {
          console.error('Invalid subscription payload');
          break;
        }
        await handleSubscriptionExpired(event.object);
        break;
      
      default:
        console.log('Unhandled event type:', event.eventType);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleCheckoutCompleted(checkout: CreemCheckoutPayload) {
  const { order, customer, subscription, metadata } = checkout;

  if (!metadata || typeof metadata.userId !== 'string') {
    console.error('Missing userId in checkout metadata');
    return;
  }

  const userId = metadata.userId;
  const paymentType = metadata.paymentType;

  if (!paymentType) {
    console.error('Missing paymentType in checkout metadata');
    return;
  }

  // 确保用户 profile 存在
  // 从 metadata 中获取用户邮箱（如果有的话）
  const userEmail = metadata?.userEmail || 'unknown@example.com';
  await ensureUserProfile(userId, userEmail);

  // 获取课程信息
  const lessonIdValue = typeof metadata.lessonId === 'string' ? metadata.lessonId : undefined;
  let lessonId: number | undefined = undefined;

  if (lessonIdValue) {
    const lesson = await getLessonById(lessonIdValue);
    if (lesson) {
      lessonId = lesson.id;
      console.log('Found lesson for purchase:', { lessonId: lesson.id, lessonIdValue });
    } else {
      console.error('Lesson not found in database:', lessonIdValue);
    }
  }

  // 创建支付交易记录
  await createPaymentTransaction({
    userId,
    creemTransactionId: order.transaction || order.id,
    creemOrderId: order.id,
    creemSubscriptionId: subscription?.id,
    creemCustomerId: customer.id,
    type: paymentType,
    status: 'paid',
    amount: order.amount,
    currency: order.currency,
    lessonId,
    metadata: checkout as UnknownRecord,
  });

  if (paymentType === 'single_course') {
    // 处理单课程购买
    if (!lessonId) {
      console.error('Missing lessonId for single course purchase');
      return;
    }

    await createCoursePurchase({
      userId,
      lessonId: lessonId,
      creemOrderId: order.id,
      creemCustomerId: customer.id,
      status: 'paid',
      amount: order.amount,
      currency: order.currency,
    });

    console.log('Single course purchase completed:', { userId, lessonId });

  } else if (paymentType === 'subscription') {
    // 处理订阅购买
    if (!subscription) {
      console.error('Missing subscription payload for subscription payment');
      return;
    }

    await createOrUpdateSubscription({
      userId,
      subscriptionType: 'pro',
      creemSubscriptionId: subscription.id,
      creemCustomerId: customer.id,
      status: 'active',
      currentPeriodStart: subscription.current_period_start_date ? new Date(subscription.current_period_start_date) : undefined,
      currentPeriodEnd: subscription.current_period_end_date ? new Date(subscription.current_period_end_date) : undefined,
    });

    console.log('Subscription created:', { userId, subscriptionId: subscription.id });

  } else if (paymentType === 'lifetime') {
    // 处理终身会员购买
    await createOrUpdateSubscription({
      userId,
      subscriptionType: 'lifetime',
      creemCustomerId: customer.id,
      status: 'active',
    });

    console.log('Lifetime membership created:', { userId });
  }
}

async function handleSubscriptionPaid(subscription: CreemSubscriptionPayload) {
  const existingSubscription = await findSubscriptionByCreemId(subscription.id);
  
  if (existingSubscription) {
    await createOrUpdateSubscription({
      userId: existingSubscription.userId,
      subscriptionType: 'pro',
      creemSubscriptionId: subscription.id,
      creemCustomerId: subscription.customer.id,
      status: 'active',
      currentPeriodStart: subscription.current_period_start_date ? new Date(subscription.current_period_start_date) : undefined,
      currentPeriodEnd: subscription.current_period_end_date ? new Date(subscription.current_period_end_date) : undefined,
    });

    console.log('Subscription payment processed:', { subscriptionId: subscription.id });
  }
}

async function handleSubscriptionCanceled(subscription: CreemSubscriptionPayload) {
  const existingSubscription = await findSubscriptionByCreemId(subscription.id);
  
  if (existingSubscription) {
    await cancelUserSubscription(existingSubscription.userId, 'pro');
    console.log('Subscription canceled:', { subscriptionId: subscription.id });
  }
}

async function handleSubscriptionExpired(subscription: CreemSubscriptionPayload) {
  const existingSubscription = await findSubscriptionByCreemId(subscription.id);
  
  if (existingSubscription) {
    await createOrUpdateSubscription({
      userId: existingSubscription.userId,
      subscriptionType: 'pro',
      creemSubscriptionId: subscription.id,
      creemCustomerId: subscription.customer.id,
      status: 'expired',
    });

    console.log('Subscription expired:', { subscriptionId: subscription.id });
  }
} 
