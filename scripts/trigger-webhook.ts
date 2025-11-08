import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { lessons } from "@/lib/db/schema";

async function triggerWebhook() {
  console.log("\n🎯 触发 Webhook 测试\n");
  console.log("=" .repeat(50));

  // 1. 获取用户
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.log("❌ 没有认证用户。请先登录。");
    return;
  }

  console.log(`✅ 用户: ${user.id}`);
  console.log(`📧 邮箱: ${user.email}\n`);

  // 2. 获取课程
  const testLesson = await db
    .select()
    .from(lessons)
    .limit(1);

  if (testLesson.length === 0) {
    console.log("❌ 没有课程数据");
    return;
  }

  const lesson = testLesson[0];
  console.log(`📚 课程: ${lesson.titleEn} (${lesson.lessonId})\n`);

  // 3. 发送 webhook 请求
  const mockWebhookPayload = {
    id: "evt_test_" + Date.now(),
    eventType: "checkout.completed",
    created_at: Date.now(),
    object: {
      id: "ch_test_" + Date.now(),
      object: "checkout",
      request_id: "test-request-" + Date.now(),
      order: {
        id: "ord_test_" + Date.now(),
        customer: user.id,
        product: "prod_test",
        amount: 1000,
        currency: "USD",
        status: "paid",
        type: "onetime",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        mode: "test"
      },
      product: {
        id: "prod_test",
        name: "Test Course",
        description: "Test",
        price: 1000,
        currency: "USD",
        billing_type: "onetime",
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        mode: "test"
      },
      customer: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || "Test User",
        country: "US",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        mode: "test"
      },
      subscription: null,
      custom_fields: [],
      status: "completed",
      metadata: {
        userId: user.id,
        userEmail: user.email || 'test@example.com',
        paymentType: "single_course",
        lessonId: lesson.lessonId
      },
      mode: "test"
    }
  };

  console.log("🚀 发送 webhook 请求...\n");

  try {
    const response = await fetch("http://localhost:3000/api/payment/webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "creem-signature": "test-signature"  // 使用测试签名
      },
      body: JSON.stringify(mockWebhookPayload)
    });

    const result = await response.json();
    console.log("📊 响应状态:", response.status);
    console.log("📝 响应内容:", JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log("\n✅ Webhook 处理成功！");
      console.log("\n请检查:");
      console.log("1. 数据库中是否创建了 payment_transactions 记录");
      console.log("2. 数据库中是否创建了 user_course_purchases 记录");
      console.log("3. 前端课程页面是否解锁");
    } else {
      console.log("\n❌ Webhook 处理失败！");
    }

  } catch (error) {
    console.log("❌ 请求失败:", error);
  }

  console.log("\n" + "=".repeat(50) + "\n");
}

triggerWebhook()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
