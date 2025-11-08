import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { lessons, userCoursePurchases, paymentTransactions, userProfiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getLessonById } from "@/lib/db/queries";
import { createCoursePurchase, createPaymentTransaction, ensureUserProfile } from "@/lib/db/queries";

async function manualWebhookTest() {
  console.log("\n🔧 手动 Webhook 测试\n");
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

  // 3. 手动执行 webhook 逻辑
  try {
    console.log("🚀 执行 webhook 处理逻辑...\n");

    // 3.1 确保用户 profile
    console.log("1️⃣ 确保用户 profile 存在...");
    await ensureUserProfile(user.id, user.email || 'test@example.com');
    console.log("   ✅ Done\n");

    // 3.2 查找课程
    console.log("2️⃣ 查找课程...");
    const lessonDb = await getLessonById(lesson.lessonId);
    if (!lessonDb) {
      console.log("   ❌ 课程不存在");
      return;
    }
    console.log(`   ✅ 课程 ID: ${lessonDb.id}\n`);

    // 3.3 创建支付交易记录
    console.log("3️⃣ 创建支付交易记录...");
    const transaction = await createPaymentTransaction({
      userId: user.id,
      creemTransactionId: 'test_tx_' + Date.now(),
      creemOrderId: 'test_order_' + Date.now(),
      creemCustomerId: user.id,
      type: 'single_course',
      status: 'paid',
      amount: 1000,
      currency: 'USD',
      lessonId: lessonDb.id,
      metadata: { test: true }
    });
    console.log(`   ✅ Transaction ID: ${transaction[0]?.id}\n`);

    // 3.4 创建课程购买记录
    console.log("4️⃣ 创建课程购买记录...");
    const purchase = await createCoursePurchase({
      userId: user.id,
      lessonId: lessonDb.id,
      creemOrderId: 'test_order_' + Date.now(),
      creemCustomerId: user.id,
      status: 'paid',
      amount: 1000,
      currency: 'USD'
    });
    console.log(`   ✅ Purchase ID: ${purchase[0]?.id}\n`);

    // 4. 验证结果
    console.log("5️⃣ 验证结果...");
    const transactions = await db
      .select()
      .from(paymentTransactions)
      .where(eq(paymentTransactions.userId, user.id));

    const purchases = await db
      .select()
      .from(userCoursePurchases)
      .where(eq(userCoursePurchases.userId, user.id));

    console.log(`   📊 Transactions: ${transactions.length}`);
    console.log(`   📊 Purchases: ${purchases.length}\n`);

    if (transactions.length > 0 && purchases.length > 0) {
      console.log("✅ 手动测试成功！数据库记录已创建。");
      console.log("\n💡 结论:");
      console.log("   - 数据库操作正常");
      console.log("   - 问题可能出在 webhook 的签名验证或 API 调用上");
      console.log("   - 请检查:");
      console.log("     1. CREEM_WEBHOOK_SECRET 是否正确");
      console.log("     2. Webhook URL 是否可公开访问");
      console.log("     3. Creem 是否正确发送 webhook 请求");
    } else {
      console.log("❌ 手动测试失败！");
    }

  } catch (error) {
    console.log("❌ 执行失败:", error);
  }

  console.log("\n" + "=".repeat(50) + "\n");
}

manualWebhookTest()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
