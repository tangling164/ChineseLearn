import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface CheckoutRequest {
  type: 'single_course' | 'subscription' | 'lifetime';
  lessonId?: string; // only for single_course
}

interface CheckoutData {
  product_id: string;
  customer: {
    email: string;
  };
  success_url: string;
  metadata: {
    userId: string;
    paymentType: string;
    lessonId?: string;
  };
  custom_field?: Array<{
    type: string;
    key: string;
    label: string;
    optional: boolean;
    text: {
      max_length: number;
      min_length: number;
    };
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CheckoutRequest = await request.json();
    const { type, lessonId } = body;

    // 验证请求参数
    if (!type || !['single_course', 'subscription', 'lifetime'].includes(type)) {
      return NextResponse.json({ error: 'Invalid payment type' }, { status: 400 });
    }

    if (type === 'single_course' && !lessonId) {
      return NextResponse.json({ error: 'Lesson ID is required for single course purchase' }, { status: 400 });
    }

    // 设置产品ID
    let productId: string;
    switch (type) {
      case 'single_course':
        productId = process.env.CREEM_SINGLE_COURSE_PRODUCT_ID || 'prod_q0ZgFiLASKxtLeoo2i57E';
        break;
      case 'subscription':
        productId = process.env.CREEM_SUBSCRIPTION_PRODUCT_ID || 'prod_5i9h0mRDwXhBwMLz6NLAbu';
        break;
      case 'lifetime':
        productId = process.env.CREEM_LIFETIME_PRODUCT_ID || 'prod_3XvVX8gPoOOfPhOfOQwJJj';
        break;
      default:
        return NextResponse.json({ error: 'Invalid payment type' }, { status: 400 });
    }

    // 准备checkout会话数据
    const checkoutData: CheckoutData = {
      product_id: productId,
      customer: {
        email: user.email || '',
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success`,
      metadata: {
        userId: user.id,
        userEmail: user.email || '',
        paymentType: type,
        ...(lessonId && { lessonId }),
      },
    };

    // 调用Creem API创建checkout会话
    const response = await fetch(`${process.env.NEXT_PUBLIC_CREEM_URL}/v1/checkouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CREEM_API_KEY!,
      },
      body: JSON.stringify(checkoutData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Creem API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      );
    }

    const checkoutSession = await response.json();

    return NextResponse.json({
      success: true,
      checkout_url: checkoutSession.checkout_url,
      checkout_id: checkoutSession.id,
    });

  } catch (error) {
    console.error('Checkout API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
