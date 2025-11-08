import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { userCoursePurchases, paymentTransactions, userProfiles, lessons } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

async function checkDbRecords() {
  console.log("\n📊 数据库记录检查\n");
  console.log("=" .repeat(70));

  // 1. 获取用户
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.log("❌ 没有认证用户。请先登录。");
    return;
  }

  console.log(`👤 用户: ${user.id}`);
  console.log(`📧 邮箱: ${user.email}\n`);

  // 2. 检查所有表
  console.log("1️⃣ user_profiles 表");
  console.log("-".repeat(70));
  const profiles = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.userId, user.id));

  if (profiles.length > 0) {
    console.log("✅ 找到用户 profile:");
    profiles.forEach(p => {
      console.log(`   ID: ${p.id}`);
      console.log(`   User ID: ${p.userId}`);
      console.log(`   Email: ${p.email}`);
      console.log(`   Created: ${p.createdAt}`);
    });
  } else {
    console.log("❌ 没有找到用户 profile");
  }

  console.log("\n2️⃣ user_course_purchases 表");
  console.log("-".repeat(70));
  const purchases = await db
    .select({
      id: userCoursePurchases.id,
      lessonId: userCoursePurchases.lessonId,
      status: userCoursePurchases.status,
      amount: userCoursePurchases.amount,
      currency: userCoursePurchases.currency,
      purchasedAt: userCoursePurchases.purchasedAt,
      creemOrderId: userCoursePurchases.creemOrderId,
    })
    .from(userCoursePurchases)
    .where(eq(userCoursePurchases.userId, user.id));

  if (purchases.length > 0) {
    console.log(`✅ 找到 ${purchases.length} 条购买记录:`);
    purchases.forEach(p => {
      console.log(`\n   📦 Purchase ID: ${p.id}`);
      console.log(`   📚 Lesson ID: ${p.lessonId}`);
      console.log(`   💰 Amount: ${p.amount / 100} ${p.currency}`);
      console.log(`   ✅ Status: ${p.status}`);
      console.log(`   🆔 Order ID: ${p.creemOrderId}`);
      console.log(`   📅 Purchased: ${p.purchasedAt}`);
    });
  } else {
    console.log("❌ 没有找到购买记录");
  }

  console.log("\n3️⃣ payment_transactions 表");
  console.log("-".repeat(70));
  const transactions = await db
    .select({
      id: paymentTransactions.id,
      type: paymentTransactions.type,
      status: paymentTransactions.status,
      amount: paymentTransactions.amount,
      currency: paymentTransactions.currency,
      createdAt: paymentTransactions.createdAt,
      creemTransactionId: paymentTransactions.creemTransactionId,
      creemOrderId: paymentTransactions.creemOrderId,
      lessonId: paymentTransactions.lessonId,
    })
    .from(paymentTransactions)
    .where(eq(paymentTransactions.userId, user.id));

  if (transactions.length > 0) {
    console.log(`✅ 找到 ${transactions.length} 条交易记录:`);
    transactions.forEach(t => {
      console.log(`\n   💳 Transaction ID: ${t.id}`);
      console.log(`   📝 Type: ${t.type}`);
      console.log(`   💰 Amount: ${t.amount / 100} ${t.currency}`);
      console.log(`   ✅ Status: ${t.status}`);
      console.log(`   🆔 Transaction ID: ${t.creemTransactionId}`);
      console.log(`   🆔 Order ID: ${t.creemOrderId}`);
      console.log(`   📚 Lesson ID: ${t.lessonId}`);
      console.log(`   📅 Created: ${t.createdAt}`);
    });
  } else {
    console.log("❌ 没有找到交易记录");
  }

  console.log("\n4️⃣ lessons 表（示例）");
  console.log("-".repeat(70));
  const allLessons = await db
    .select()
    .from(lessons)
    .limit(5);

  if (allLessons.length > 0) {
    console.log(`✅ 数据库中有 ${allLessons.length} 个课程（显示前 5 个）:`);
    allLessons.forEach(l => {
      console.log(`\n   📖 Lesson: ${l.titleEn}`);
      console.log(`   🆔 ID: ${l.lessonId} (db_id: ${l.id})`);
      console.log(`   🏷️  Tag: ${l.tag}`);
    });
  } else {
    console.log("❌ 没有找到课程数据");
  }

  // 5. 总结
  console.log("\n" + "=".repeat(70));
  console.log("📋 总结:");
  console.log("=" .repeat(70));

  if (profiles.length === 0) {
    console.log("❌ 问题: 用户 profile 不存在");
    console.log("   解决: 这可能导致购买记录创建失败");
  }

  if (purchases.length === 0) {
    console.log("❌ 问题: 没有课程购买记录");
    console.log("   原因: Webhook 没有成功处理或未被调用");
  }

  if (transactions.length === 0) {
    console.log("❌ 问题: 没有支付交易记录");
    console.log("   原因: Webhook 没有成功处理或未被调用");
  }

  if (purchases.length > 0 && transactions.length > 0) {
    console.log("✅ 正常: 购买记录和交易记录都存在");
    console.log("   如果前端仍显示未购买，请检查前端查询逻辑");
  }

  console.log("\n🔧 下一步:");
  console.log("1. 运行测试: pnpm tsx scripts/trigger-webhook.ts");
  console.log("2. 查看日志: 观察 webhook 是否被调用");
  console.log("3. 再次检查此脚本: 验证记录是否创建");

  console.log("\n" + "=".repeat(70) + "\n");
}

checkDbRecords()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
