import { db } from './index';
import { 
  lessons, 
  lessonItems, 
  userProfiles, 
  userLessonProgress,
  userSubscriptions,
  userCoursePurchases,
  paymentTransactions,
} from './schema';
import { eq, and, desc, count, sum, avg, gte } from 'drizzle-orm';

type PaymentMetadata = Record<string, unknown> | null;

// 课程相关查询
export async function getAllLessons() {
  return await db.select().from(lessons).orderBy(lessons.order);
}

export async function getLessonById(lessonId: string) {
  const result = await db
    .select()
    .from(lessons)
    .where(eq(lessons.lessonId, lessonId))
    .limit(1);
  
  return result[0] || null;
}

export async function getLessonWithItems(lessonId: string) {
  const lesson = await getLessonById(lessonId);
  if (!lesson) return null;

  const items = await db
    .select()
    .from(lessonItems)
    .where(eq(lessonItems.lessonId, lesson.id))
    .orderBy(lessonItems.order);

  return {
    ...lesson,
    items
  };
}

export async function getLessonsByTag(tag: string) {
  return await db
    .select()
    .from(lessons)
    .where(eq(lessons.tag, tag))
    .orderBy(lessons.order);
}

// 用户相关查询
export async function getUserProfile(userId: string) {
  const result = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.userId, userId))
    .limit(1);
  
  return result[0] || null;
}

export async function createOrUpdateUserProfile(userId: string, email: string, fullName?: string) {
  const existing = await getUserProfile(userId);
  
  if (existing) {
    const [updated] = await db
      .update(userProfiles)
      .set({ 
        email, 
        fullName, 
        updatedAt: new Date() 
      })
      .where(eq(userProfiles.userId, userId))
      .returning();
    return updated;
  } else {
    const [created] = await db
      .insert(userProfiles)
      .values({ 
        userId, 
        email, 
        fullName 
      })
      .returning();
    return created;
  }
}

// 获取用户的课程进度
export async function getUserLessonProgress(userId: string, lessonId?: number) {
  if (lessonId) {
    const result = await db
      .select({
        id: userLessonProgress.id,
        lessonId: userLessonProgress.lessonId,
        completedItems: userLessonProgress.completedItems,
        totalItems: userLessonProgress.totalItems,
        isCompleted: userLessonProgress.isCompleted,
        lastAccessedAt: userLessonProgress.lastAccessedAt,
        completedAt: userLessonProgress.completedAt,
        accuracy: userLessonProgress.accuracy,
        totalTimeSpent: userLessonProgress.totalTimeSpent,
        lesson: {
          id: lessons.id,
          lessonId: lessons.lessonId,
          titleEn: lessons.titleEn,
          titleZh: lessons.titleZh,
          descriptionEn: lessons.descriptionEn,
          cover: lessons.cover,
          tag: lessons.tag,
          order: lessons.order,
        }
      })
      .from(userLessonProgress)
      .innerJoin(lessons, eq(userLessonProgress.lessonId, lessons.id))
      .where(and(eq(userLessonProgress.userId, userId), eq(userLessonProgress.lessonId, lessonId)))
      .limit(1);
    return result[0] || null;
  }

  return await db
    .select({
      id: userLessonProgress.id,
      lessonId: userLessonProgress.lessonId,
      completedItems: userLessonProgress.completedItems,
      totalItems: userLessonProgress.totalItems,
      isCompleted: userLessonProgress.isCompleted,
      lastAccessedAt: userLessonProgress.lastAccessedAt,
      completedAt: userLessonProgress.completedAt,
      accuracy: userLessonProgress.accuracy,
      totalTimeSpent: userLessonProgress.totalTimeSpent,
      lesson: {
        id: lessons.id,
        lessonId: lessons.lessonId,
        titleEn: lessons.titleEn,
        titleZh: lessons.titleZh,
        descriptionEn: lessons.descriptionEn,
        cover: lessons.cover,
        tag: lessons.tag,
        order: lessons.order,
      }
    })
    .from(userLessonProgress)
    .innerJoin(lessons, eq(userLessonProgress.lessonId, lessons.id))
    .where(eq(userLessonProgress.userId, userId))
    .orderBy(desc(userLessonProgress.lastAccessedAt));
}

// 获取用户的所有课程进度（专门用于CourseStore）
export async function getAllUserLessonProgress(userId: string) {
  return await db
    .select({
      id: userLessonProgress.id,
      lessonId: userLessonProgress.lessonId,
      completedItems: userLessonProgress.completedItems,
      totalItems: userLessonProgress.totalItems,
      isCompleted: userLessonProgress.isCompleted,
      lastAccessedAt: userLessonProgress.lastAccessedAt,
      completedAt: userLessonProgress.completedAt,
      accuracy: userLessonProgress.accuracy,
      totalTimeSpent: userLessonProgress.totalTimeSpent,
      lesson: {
        id: lessons.id,
        lessonId: lessons.lessonId,
        titleEn: lessons.titleEn,
        titleZh: lessons.titleZh,
        descriptionEn: lessons.descriptionEn,
        cover: lessons.cover,
        tag: lessons.tag,
        order: lessons.order,
      }
    })
    .from(userLessonProgress)
    .innerJoin(lessons, eq(userLessonProgress.lessonId, lessons.id))
    .where(eq(userLessonProgress.userId, userId))
    .orderBy(desc(userLessonProgress.lastAccessedAt));
}

// 获取用户最近学习的课程
export async function getUserRecentLessons(userId: string, limit = 5) {
  return await db
    .select({
      id: userLessonProgress.id,
      completedItems: userLessonProgress.completedItems,
      totalItems: userLessonProgress.totalItems,
      isCompleted: userLessonProgress.isCompleted,
      lastAccessedAt: userLessonProgress.lastAccessedAt,
      accuracy: userLessonProgress.accuracy,
      lesson: {
        id: lessons.id,
        lessonId: lessons.lessonId,
        titleEn: lessons.titleEn,
        titleZh: lessons.titleZh,
        descriptionEn: lessons.descriptionEn,
        cover: lessons.cover,
        tag: lessons.tag,
        order: lessons.order,
      }
    })
    .from(userLessonProgress)
    .innerJoin(lessons, eq(userLessonProgress.lessonId, lessons.id))
    .where(eq(userLessonProgress.userId, userId))
    .orderBy(desc(userLessonProgress.lastAccessedAt))
    .limit(limit);
}

// 获取用户统计数据
export async function getUserStats(userId: string) {
  const profile = await getUserProfile(userId);
  
  if (!profile) {
    return {
      totalLessonsCompleted: 0,
      totalWordsLearned: 0,
      currentStreak: 0,
      totalTimeSpent: 0,
      averageAccuracy: 0
    };
  }

  // 获取本周学习时间
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  const weeklyTimeResult = await db
    .select({
      totalTime: sum(userLessonProgress.totalTimeSpent)
    })
    .from(userLessonProgress)
    .where(
      and(
        eq(userLessonProgress.userId, userId),
        gte(userLessonProgress.lastAccessedAt, weekAgo)
      )
    );

  const weeklyTime = Number(weeklyTimeResult[0]?.totalTime || 0);

  // 获取平均准确率
  const accuracyResult = await db
    .select({
      avgAccuracy: avg(userLessonProgress.accuracy)
    })
    .from(userLessonProgress)
    .where(
      and(
        eq(userLessonProgress.userId, userId),
        gte(userLessonProgress.accuracy, 1)
      )
    );

  const averageAccuracy = Number(accuracyResult[0]?.avgAccuracy || 0);

  return {
    totalLessonsCompleted: profile.totalLessonsCompleted,
    totalWordsLearned: profile.totalWordsLearned,
    currentStreak: profile.currentStreak,
    totalTimeSpent: weeklyTime,
    averageAccuracy: Math.round(averageAccuracy)
  };
}

// 更新用户课程进度
export async function updateUserLessonProgress(
  userId: string, 
  lessonId: number, 
  completedItems: number,
  totalItems: number,
  accuracy?: number,
  timeSpent?: number
) {
  const isCompleted = completedItems >= totalItems;
  
  const existing = await db
    .select()
    .from(userLessonProgress)
    .where(
      and(
        eq(userLessonProgress.userId, userId),
        eq(userLessonProgress.lessonId, lessonId)
      )
    )
    .limit(1);

  const updateData = {
    completedItems,
    totalItems,
    isCompleted,
    lastAccessedAt: new Date(),
    updatedAt: new Date(),
    ...(accuracy !== undefined && { accuracy }),
    ...(timeSpent !== undefined && { totalTimeSpent: (existing[0]?.totalTimeSpent || 0) + timeSpent }),
    ...(isCompleted && !existing[0]?.isCompleted && { completedAt: new Date() })
  };

  if (existing.length > 0) {
    const [updated] = await db
      .update(userLessonProgress)
      .set(updateData)
      .where(eq(userLessonProgress.id, existing[0].id))
      .returning();
    return updated;
  } else {
    const [created] = await db
      .insert(userLessonProgress)
      .values({
        userId,
        lessonId,
        ...updateData
      })
      .returning();
    return created;
  }
}

// 更新用户个人资料统计
export async function updateUserProfileStats(userId: string) {
  // 计算总完成课程数
  const completedLessonsResult = await db
    .select({
      count: count()
    })
    .from(userLessonProgress)
    .where(
      and(
        eq(userLessonProgress.userId, userId),
        eq(userLessonProgress.isCompleted, true)
      )
    );

  // 计算总学习单词数
  const wordsLearnedResult = await db
    .select({
      totalWords: sum(userLessonProgress.completedItems)
    })
    .from(userLessonProgress)
    .where(eq(userLessonProgress.userId, userId));

  const totalLessonsCompleted = completedLessonsResult[0]?.count || 0;
  const totalWordsLearned = Number(wordsLearnedResult[0]?.totalWords || 0);

  // 计算连续学习天数（简化版本，基于最近访问）
  const currentStreak = await calculateUserStreak(userId);

  await db
    .update(userProfiles)
    .set({
      totalLessonsCompleted,
      totalWordsLearned,
      currentStreak,
      lastActiveDate: new Date(),
      updatedAt: new Date()
    })
    .where(eq(userProfiles.userId, userId));
}

// 计算用户连续学习天数（简化版本）
async function calculateUserStreak(userId: string): Promise<number> {
  const recentProgress = await db
    .select({
      lastAccessedAt: userLessonProgress.lastAccessedAt
    })
    .from(userLessonProgress)
    .where(eq(userLessonProgress.userId, userId))
    .orderBy(desc(userLessonProgress.lastAccessedAt))
    .limit(10);

  if (recentProgress.length === 0) return 0;

  // 简化逻辑：如果最近7天内有学习记录，认为连续学习
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  const recentActivity = recentProgress.filter(p => 
    p.lastAccessedAt && new Date(p.lastAccessedAt) >= weekAgo
  );

  return Math.min(recentActivity.length, 7);
}

// 获取课程的完整信息包括用户进度
export async function getLessonWithProgress(userId: string, lessonId: string) {
  const lesson = await getLessonWithItems(lessonId);
  if (!lesson) return null;

  const progress = await getUserLessonProgress(userId, lesson.id);
  
  return {
    ...lesson,
    userProgress: progress
  };
}

// ====== 支付相关查询函数 ======

// 检查用户是否有活跃的订阅
export async function getUserActiveSubscription(userId: string) {
  const result = await db
    .select()
    .from(userSubscriptions)
    .where(
      and(
        eq(userSubscriptions.userId, userId),
        eq(userSubscriptions.status, 'active')
      )
    )
    .orderBy(desc(userSubscriptions.createdAt))
    .limit(1);

  return result[0] || null;
}

// 检查用户是否购买了特定课程
export async function hasUserPurchasedCourse(userId: string, lessonId: number) {
  const result = await db
    .select()
    .from(userCoursePurchases)
    .where(
      and(
        eq(userCoursePurchases.userId, userId),
        eq(userCoursePurchases.lessonId, lessonId),
        eq(userCoursePurchases.status, 'paid')
      )
    )
    .limit(1);

  return result.length > 0;
}

// 检查用户是否可以访问课程
export async function canUserAccessLesson(userId: string, lessonId: string) {
  // 首先检查是否是免费课程
  if (lessonId === 'greetings_l1') {
    return { canAccess: true, reason: 'free_course' };
  }

  // 获取课程的数据库ID
  const lesson = await getLessonById(lessonId);
  if (!lesson) {
    return { canAccess: false, reason: 'lesson_not_found' };
  }

  // 检查用户是否有活跃订阅
  const subscription = await getUserActiveSubscription(userId);
  if (subscription) {
    return { canAccess: true, reason: 'subscription', subscriptionType: subscription.subscriptionType };
  }

  // 检查是否购买了单节课程
  const hasPurchased = await hasUserPurchasedCourse(userId, lesson.id);
  if (hasPurchased) {
    return { canAccess: true, reason: 'single_purchase' };
  }

  return { canAccess: false, reason: 'not_purchased' };
}

// 创建或更新用户订阅
export async function createOrUpdateSubscription(data: {
  userId: string;
  subscriptionType: 'pro' | 'lifetime';
  creemSubscriptionId?: string;
  creemCustomerId: string;
  status: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
}) {
  // 先检查是否已存在相同类型的订阅
  const existing = await db
    .select()
    .from(userSubscriptions)
    .where(
      and(
        eq(userSubscriptions.userId, data.userId),
        eq(userSubscriptions.subscriptionType, data.subscriptionType)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    // 更新现有订阅
    const [updated] = await db
      .update(userSubscriptions)
      .set({
        status: data.status,
        currentPeriodStart: data.currentPeriodStart,
        currentPeriodEnd: data.currentPeriodEnd,
        updatedAt: new Date(),
      })
      .where(eq(userSubscriptions.id, existing[0].id))
      .returning();
    return updated;
  } else {
    // 创建新订阅
    const [created] = await db
      .insert(userSubscriptions)
      .values(data)
      .returning();
    return created;
  }
}

// 创建课程购买记录
export async function createCoursePurchase(data: {
  userId: string;
  lessonId: number;
  creemOrderId: string;
  creemCustomerId: string;
  status: string;
  amount: number;
  currency: string;
}) {
  const [created] = await db
    .insert(userCoursePurchases)
    .values(data)
    .returning();
  return created;
}

// 创建支付交易记录
export async function createPaymentTransaction(data: {
  userId: string;
  creemTransactionId: string;
  creemOrderId?: string;
  creemSubscriptionId?: string;
  creemCustomerId: string;
  type: 'single_course' | 'subscription' | 'lifetime';
  status: string;
  amount: number;
  currency: string;
  lessonId?: number;
  metadata?: PaymentMetadata;
}) {
  const [created] = await db
    .insert(paymentTransactions)
    .values(data)
    .returning();
  return created;
}

// 更新支付交易状态
export async function updatePaymentTransaction(
  creemTransactionId: string, 
  updates: {
    status?: string;
    metadata?: PaymentMetadata;
    updatedAt?: Date;
  }
) {
  const [updated] = await db
    .update(paymentTransactions)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(paymentTransactions.creemTransactionId, creemTransactionId))
    .returning();
  return updated;
}

// 获取用户的支付历史
export async function getUserPaymentHistory(userId: string) {
  return await db
    .select({
      id: paymentTransactions.id,
      type: paymentTransactions.type,
      status: paymentTransactions.status,
      amount: paymentTransactions.amount,
      currency: paymentTransactions.currency,
      createdAt: paymentTransactions.createdAt,
      lessonTitle: lessons.titleEn,
      lessonId: lessons.lessonId,
    })
    .from(paymentTransactions)
    .leftJoin(lessons, eq(paymentTransactions.lessonId, lessons.id))
    .where(eq(paymentTransactions.userId, userId))
    .orderBy(desc(paymentTransactions.createdAt));
}

// 取消用户订阅
export async function cancelUserSubscription(userId: string, subscriptionType: 'pro' | 'lifetime') {
  const [updated] = await db
    .update(userSubscriptions)
    .set({
      status: 'canceled',
      canceledAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(userSubscriptions.userId, userId),
        eq(userSubscriptions.subscriptionType, subscriptionType)
      )
    )
    .returning();
  return updated;
}

// 根据Creem订阅ID查找用户订阅
export async function findSubscriptionByCreemId(creemSubscriptionId: string) {
  const result = await db
    .select()
    .from(userSubscriptions)
    .where(eq(userSubscriptions.creemSubscriptionId, creemSubscriptionId))
    .limit(1);
  return result[0] || null;
}

// 根据Creem订单ID查找课程购买记录
export async function findCoursePurchaseByOrderId(creemOrderId: string) {
  const result = await db
    .select()
    .from(userCoursePurchases)
    .where(eq(userCoursePurchases.creemOrderId, creemOrderId))
    .limit(1);
  return result[0] || null;
} 
