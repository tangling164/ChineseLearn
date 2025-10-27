import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import * as crypto from 'crypto';
import {
  createOrUpdateSubscription,
  createCoursePurchase,
  createPaymentTransaction,
  getLessonById,
  findSubscriptionByCreemId,
  cancelUserSubscription,
} from '@/lib/db/queries';

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

    // 验证webhook签名
    const isValid = verifyCreemSignature(payload, signature, process.env.CREEM_WEBHOOK_SECRET!);
    if (!isValid) {
      console.error('Invalid Creem signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(payload);
    console.log('Received Creem webhook:', event.eventType, event.id);

    switch (event.eventType) {
      case 'checkout.completed':
        await handleCheckoutCompleted(event.object);
        break;
      
      case 'subscription.paid':
        await handleSubscriptionPaid(event.object);
        break;
      
      case 'subscription.canceled':
        await handleSubscriptionCanceled(event.object);
        break;
      
      case 'subscription.expired':
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

async function handleCheckoutCompleted(checkout: any) {
  const { order, product, customer, subscription, metadata } = checkout;
  
  if (!metadata?.userId) {
    console.error('Missing userId in checkout metadata');
    return;
  }

  const userId = metadata.userId;
  const paymentType = metadata.paymentType;

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
    lessonId: metadata.lessonId ? (await getLessonById(metadata.lessonId))?.id : undefined,
    metadata: checkout,
  });

  if (paymentType === 'single_course') {
    // 处理单课程购买
    const lessonId = metadata.lessonId;
    if (!lessonId) {
      console.error('Missing lessonId for single course purchase');
      return;
    }

    const lesson = await getLessonById(lessonId);
    if (!lesson) {
      console.error('Lesson not found:', lessonId);
      return;
    }

    await createCoursePurchase({
      userId,
      lessonId: lesson.id,
      creemOrderId: order.id,
      creemCustomerId: customer.id,
      status: 'paid',
      amount: order.amount,
      currency: order.currency,
    });

    console.log('Single course purchase completed:', { userId, lessonId: lesson.id });

  } else if (paymentType === 'subscription') {
    // 处理订阅购买
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

async function handleSubscriptionPaid(subscription: any) {
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

async function handleSubscriptionCanceled(subscription: any) {
  const existingSubscription = await findSubscriptionByCreemId(subscription.id);
  
  if (existingSubscription) {
    await cancelUserSubscription(existingSubscription.userId, 'pro');
    console.log('Subscription canceled:', { subscriptionId: subscription.id });
  }
}

async function handleSubscriptionExpired(subscription: any) {
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