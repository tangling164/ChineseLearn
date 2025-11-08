import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { lessons, userCoursePurchases, paymentTransactions, userProfiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import fetch from "node-fetch";

async function testWebhook() {
  console.log("\n🧪 Webhook 测试工具\n");
  console.log("=" .repeat(50));

  // 1. 获取当前用户
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.log("❌ 没有认证用户。请先登录。");
    return;
  }

  console.log(`✅ 认证用户: ${user.id}`);
  console.log(`📧 邮箱: ${user.email}\n`);

  // 2. 检查用户 profile
  console.log("1️⃣ 检查用户 Profile...");
  const userProfile = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.userId, user.id))
    .limit(1);

  if (userProfile.length === 0) {
    console.log("   ❌ 用户 profile 不存在，尝试创建...");
    // 创建 profile
    await db
      .insert(userProfiles)
      .values({
        userId: user.id,
        email: user.email || 'test@example.com',
        fullName: user.user_metadata?.full_name || null
      });
    console.log("   ✅ Profile 创建成功\n");
  } else {
    console.log("   ✅ Profile 存在\n");
  }

  // 3. 获取一个课程
  console.log("2️⃣ 获取测试课程...");
  const testLesson = await db
    .select()
    .from(lessons)
    .limit(1);

  if (testLesson.length === 0) {
    console.log("   ❌ 没有课程数据，请先运行: pnpm db:seed");
    return;
  }

  const lesson = testLesson[0];
  console.log(`   ✅ 课程: ${lesson.titleEn} (${lesson.lessonId})\n`);

  // 4. 手动调用 checkout API
  console.log("3️⃣ 创建 checkout session...");
  try {
    const checkoutResponse = await fetch("http://localhost:3000/api/payment/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": (await supabase.auth.getSession()).data.session?.access_token
          ? `sb-access-token=${(await supabase.auth.getSession()).data.session?.access_token}`
          : ""
      } as any,
      body: JSON.stringify({
        type: "single_course",
        lessonId: lesson.lessonId
      })
    });

    const checkoutData = await checkoutResponse.json();
    if (!checkoutResponse.ok) {
      console.log("   ❌ Checkout 失败:", checkoutData);
      return;
    }

    console.log("   ✅ Checkout 成功");
    console.log(`   📝 Checkout ID: ${checkoutData.checkout_id}`);
    console.log(`   🔗 URL: ${checkoutData.checkout_url}\n`);
  } catch (error) {
    console.log("   ❌ Checkout 请求失败:", error);
    return;
  }

  // 5. 模拟 webhook 调用
  console.log("4️⃣ 模拟 webhook 调用...");
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

  try {
    const webhookResponse = await fetch("http://localhost:3000/api/payment/webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "creem-signature": "test-signature"
      },
      body: JSON.stringify(mockWebhookPayload)
    });

    const webhookResult = await webhookResponse.json();
    console.log("   📊 Webhook 响应状态:", webhookResponse.status);
    console.log("   📝 Webhook 响应:", webhookResult);
  } catch (error) {
    console.log("   ❌ Webhook 调用失败:", error);
  }

  // 6. 检查数据库记录
  console.log("\n5️⃣ 检查数据库记录...");

  // 检查支付记录
  const transactions = await db
    .select()
    .from(paymentTransactions)
    .where(eq(paymentTransactions.userId, user.id));

  console.log(`   📊 Payment Transactions: ${transactions.length} 条记录`);
  if (transactions.length > 0) {
    transactions.forEach((t, i) => {
      console.log(`      ${i + 1}. ${t.type} - ${t.status} - ${t.amount / 100} ${t.currency}`);
    });
  }

  // 检查购买记录
  const purchases = await db
    .select()
    .from(userCoursePurchases)
    .where(eq(userCoursePurchases.userId, user.id));

  console.log(`   📊 Course Purchases: ${purchases.length} 条记录`);
  if (purchases.length > 0) {
    purchases.forEach((p, i) => {
      console.log(`      ${i + 1}. Lesson ID: ${p.lessonId} - ${p.status} - ${p.amount / 100} ${p.currency}`);
    });
  }

  // 7. 总结
  console.log("\n" + "=".repeat(50));
  if (transactions.length > 0 && purchases.length > 0) {
    console.log("✅ 测试成功！Webhook 工作正常。");
  } else {
    console.log("❌ 测试失败！Webhook 没有创建预期的记录。");
    console.log("\n🔍 可能的问题:");
    console.log("1. 签名验证失败 (这是正常的，因为我们用的是测试签名)");
    console.log("2. 数据库连接问题");
    console.log("3. 代码逻辑错误");
  }
  console.log("=".repeat(50) + "\n");
}

testWebhook()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
