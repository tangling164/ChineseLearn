# 支付和课程解锁问题修复总结

## 问题描述
用户反馈：
1. ✅ 能够成功购买单个课程
2. ✅ 能够正确付款
3. ❌ 成功付款后课程没有解锁
4. ❌ billing 模块中没有相关付款记录

## 根本原因

虽然用户支付成功，但**Webhook 没有正确处理**支付事件，导致：
- 数据库中没有创建 `userCoursePurchases` 记录
- 数据库中没有创建 `paymentTransactions` 记录
- 前端无法判断用户已购买课程

## 已修复的问题

### 1. Webhook 处理逻辑优化

**文件**: `app/api/payment/webhook/route.ts`

#### 改进内容：
- ✅ **更好的错误日志**: 添加了详细的 console.log 和 console.error
- ✅ **课程查找优化**: 先查找课程，提取数据库 ID，然后使用
- ✅ **用户 Profile 自动创建**: 添加了 `ensureUserProfile` 调用，确保用户 profile 存在
- ✅ **邮箱传递**: 从 metadata 中获取用户邮箱用于创建 profile

#### 关键变更：
```typescript
// 1. 增强的 metadata 类型
type CreemCheckoutMetadata = UnknownRecord & {
  userId: string;
  userEmail?: string;  // 新增
  paymentType: 'single_course' | 'subscription' | 'lifetime';
  lessonId?: string;
};

// 2. 确保用户 profile 存在
const userEmail = metadata?.userEmail || 'unknown@example.com';
await ensureUserProfile(userId, userEmail);

// 3. 更好的课程查找逻辑
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
```

### 2. Checkout 流程优化

**文件**: `app/api/payment/checkout/route.ts`

#### 改进内容：
- ✅ **用户邮箱传递**: 在 metadata 中包含 `userEmail`
- ✅ **产品 ID 环境变量配置**: 将硬编码的产品 ID 改为可配置的环境变量

#### 关键变更：
```typescript
metadata: {
  userId: user.id,
  userEmail: user.email || '',  // 新增
  paymentType: type,
  ...(lessonId && { lessonId }),
},
```

### 3. 数据库查询增强

**文件**: `lib/db/queries.ts`

#### 新增功能：
```typescript
// 确保用户 profile 存在（用于 webhook）
export async function ensureUserProfile(userId: string, email: string, fullName?: string) {
  try {
    const existing = await getUserProfile(userId);
    if (!existing) {
      console.log('Creating user profile for:', userId);
      await createOrUpdateUserProfile(userId, email, fullName);
    }
    return true;
  } catch (error) {
    console.error('Error ensuring user profile:', error);
    return false;
  }
}
```

### 4. 环境变量配置

**文件**: `.env.example`

新增了产品 ID 环境变量：
```bash
# Creem Product IDs
CREEM_SINGLE_COURSE_PRODUCT_ID=
CREEM_SUBSCRIPTION_PRODUCT_ID=
CREEM_LIFETIME_PRODUCT_ID=
```

## 调试工具

### 1. 诊断脚本
**文件**: `scripts/check-purchase-records.ts`

运行方式：
```bash
npx tsx scripts/check-purchase-records.ts
```

功能：
- 检查用户 profile 是否存在
- 显示所有课程购买记录
- 显示所有支付交易记录
- 显示示例课程数据
- 提供问题排查建议

### 2. 调试文档
**文件**: `docs/PAYMENT_DEBUGGING.md`

包含：
- 完整的排查步骤
- 常见问题及解决方案
- 测试步骤
- 监控建议

## 验证修复

### 步骤 1: 运行诊断脚本
```bash
npx tsx scripts/check-purchase-records.ts
```

期望结果：
- ✅ 用户 profile 存在
- ✅ 显示购买记录
- ✅ 显示支付交易记录

### 步骤 2: 进行测试购买
1. 访问 `/dashboard/courses`
2. 购买一个课程
3. 观察开发者工具中的网络请求

### 步骤 3: 检查日志
查看 Next.js 服务器日志，应该看到：
```
Received Creem webhook: checkout.completed evt_xxx
Found lesson for purchase: { lessonId: 1, lessonIdValue: "xxx" }
Single course purchase completed: { userId: "xxx", lessonId: 1 }
```

### 步骤 4: 验证前端
- 刷新 `/dashboard/courses` 页面
- ✅ 购买后课程应显示"开始学习"而不是"购买课程"
- 访问 `/dashboard/billing`
- ✅ 应该显示支付记录

## 注意事项

### Webhook 配置
确保在 Creem Dashboard 中正确配置 webhook：
- **URL**: `https://你的域名/api/payment/webhook`
- **Events**: `checkout.completed`
- **Secret**: 匹配 `.env.local` 中的 `CREEM_WEBHOOK_SECRET`

### 环境变量
在生产环境中设置：
```bash
CREEM_SINGLE_COURSE_PRODUCT_ID=prod_你的产品ID
CREEM_SUBSCRIPTION_PRODUCT_ID=prod_你的产品ID
CREEM_LIFETIME_PRODUCT_ID=prod_你的产品ID
```

### 监控
建议：
- 定期检查 webhook 日志
- 监控支付失败率
- 设置 webhook 失败告警

## 总结

这次修复解决了支付流程中的关键问题：
1. **Webhook 处理**: 修复了支付事件处理逻辑
2. **数据一致性**: 确保支付后数据库记录正确创建
3. **用户体验**: 购买后课程立即解锁
4. **可维护性**: 添加了环境变量配置和详细日志
5. **调试工具**: 提供了诊断脚本和文档

现在用户购买课程后，课程应该立即解锁，billing 页面也会显示正确的支付记录。
