import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { userCoursePurchases, paymentTransactions, userProfiles, lessons } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

async function checkPurchaseRecords() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.log("❌ No authenticated user");
    return;
  }

  console.log(`\n🔍 Checking purchase records for user: ${user.id}\n`);

  // 1. Check if user profile exists
  const userProfile = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.userId, user.id))
    .limit(1);

  console.log("1️⃣ User Profile:");
  if (userProfile.length > 0) {
    console.log("   ✅ User profile exists");
    console.log(`   📧 Email: ${userProfile[0].email}`);
  } else {
    console.log("   ❌ User profile not found (this might be the issue!)");
  }

  // 2. Check course purchases
  const purchases = await db
    .select({
      id: userCoursePurchases.id,
      lessonId: userCoursePurchases.lessonId,
      status: userCoursePurchases.status,
      amount: userCoursePurchases.amount,
      currency: userCoursePurchases.currency,
      purchasedAt: userCoursePurchases.purchasedAt,
      creemOrderId: userCoursePurchases.creemOrderId,
      lesson: {
        id: lessons.id,
        lessonId: lessons.lessonId,
        titleEn: lessons.titleEn,
      }
    })
    .from(userCoursePurchases)
    .leftJoin(lessons, eq(userCoursePurchases.lessonId, lessons.id))
    .where(eq(userCoursePurchases.userId, user.id));

  console.log("\n2️⃣ Course Purchases:");
  if (purchases.length > 0) {
    console.log(`   ✅ Found ${purchases.length} purchase(s):`);
    purchases.forEach((purchase) => {
      console.log(`   - Lesson: ${purchase.lesson?.titleEn || 'Unknown'} (${purchase.lesson?.lessonId})`);
      console.log(`     Status: ${purchase.status}`);
      console.log(`     Amount: ${purchase.amount / 100} ${purchase.currency}`);
      console.log(`     Order ID: ${purchase.creemOrderId}`);
      console.log(`     Purchased: ${purchase.purchasedAt}`);
    });
  } else {
    console.log("   ❌ No course purchases found (this is the issue!)");
  }

  // 3. Check payment transactions
  const transactions = await db
    .select({
      id: paymentTransactions.id,
      type: paymentTransactions.type,
      status: paymentTransactions.status,
      amount: paymentTransactions.amount,
      currency: paymentTransactions.currency,
      createdAt: paymentTransactions.createdAt,
      creemOrderId: paymentTransactions.creemOrderId,
      creemTransactionId: paymentTransactions.creemTransactionId,
      lessonId: paymentTransactions.lessonId,
    })
    .from(paymentTransactions)
    .where(eq(paymentTransactions.userId, user.id));

  console.log("\n3️⃣ Payment Transactions:");
  if (transactions.length > 0) {
    console.log(`   ✅ Found ${transactions.length} transaction(s):`);
    transactions.forEach((transaction) => {
      console.log(`   - Type: ${transaction.type}`);
      console.log(`     Status: ${transaction.status}`);
      console.log(`     Amount: ${transaction.amount / 100} ${transaction.currency}`);
      console.log(`     Order ID: ${transaction.creemOrderId}`);
      console.log(`     Transaction ID: ${transaction.creemTransactionId}`);
      console.log(`     Date: ${transaction.createdAt}`);
    });
  } else {
    console.log("   ❌ No payment transactions found");
  }

  // 4. Check recent lessons
  const allLessons = await db
    .select({
      id: lessons.id,
      lessonId: lessons.lessonId,
      titleEn: lessons.titleEn,
    })
    .from(lessons)
    .limit(5);

  console.log("\n4️⃣ Sample Lessons (first 5):");
  allLessons.forEach((lesson) => {
    console.log(`   - ${lesson.titleEn} (${lesson.lessonId})`);
  });

  console.log("\n" + "=".repeat(50));
  console.log("💡 Possible Issues:");
  console.log("1. Webhook not receiving events from Creem");
  console.log("2. Webhook signature verification failing");
  console.log("3. User profile not created before purchase");
  console.log("4. Lesson not found in database");
  console.log("\n📝 Next Steps:");
  console.log("1. Check server logs for webhook requests");
  console.log("2. Verify Creem webhook URL is configured correctly");
  console.log("3. Check CREEM_WEBHOOK_SECRET is set correctly");
  console.log("=".repeat(50) + "\n");
}

checkPurchaseRecords()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
