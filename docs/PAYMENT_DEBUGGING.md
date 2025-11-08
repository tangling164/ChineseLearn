# 支付和课程解锁问题排查指南

## 问题症状
- ✅ 用户可以成功购买单个课程
- ✅ 支付成功完成
- ❌ 课程没有被解锁（仍显示"购买课程"）
- ❌ billing 页面没有支付记录

## 根本原因
支付成功但课程没有解锁的原因是 **webhook 处理失败**。虽然用户的钱已经支付给 Creem，但我们的数据库没有收到支付通知，因此不知道用户已经付款。

## 排查步骤

### 1. 检查 Webhook 是否被调用

#### 在开发环境（使用 ngrok）
```bash
# 启动开发服务器
pnpm dev

# 在另一个终端，启动 ngrok
ngrok http 3000

# 复制 ngrok 提供的 URL，格式类似：
# https://abc123.ngrok.io

# 在 Creem Dashboard 的 Webhook 设置中，将 URL 设置为：
# https://abc123.ngrok.io/api/payment/webhook
```

#### 检查服务器日志
```bash
# 查看 Next.js 开发服务器日志
# 应该看到类似以下的日志：
# Received Creem webhook: checkout.completed evt_xxx
# Found lesson for purchase: { lessonId: 1, lessonIdValue: "some_lesson" }
# Single course purchase completed: { userId: "xxx", lessonId: 1 }
```

### 2. 运行诊断脚本

```bash
# 编译并运行诊断脚本
npx tsx scripts/check-purchase-records.ts
```

这个脚本会显示：
- 用户 profile 是否存在
- 课程购买记录
- 支付交易记录
- 示例课程数据

### 3. 检查 Webhook 签名

在 `app/api/payment/webhook/route.ts` 中，确保：
- `CREEM_WEBHOOK_SECRET` 环境变量已设置
- 签名验证逻辑正确运行

### 4. 常见问题和解决方案

#### 问题 1: Webhook 没有被调用
**症状**: 日志中没有 "Received Creem webhook" 消息
**解决方案**:
1. 确认 Creem Dashboard 中的 webhook URL 正确
2. 确认 URL 是公开可访问的（HTTPS）
3. 尝试手动触发一个测试支付

#### 问题 2: 签名验证失败
**症状**: 日志显示 "Invalid Creem signature"
**解决方案**:
1. 检查 `.env.local` 中的 `CREEM_WEBHOOK_SECRET` 是否与 Creem Dashboard 中的 secret 匹配
2. 确认 secret 没有多余的空格或引号

#### 问题 3: 课程不存在
**症状**: 日志显示 "Lesson not found in database"
**解决方案**:
1. 检查课程数据是否已导入：`pnpm db:seed`
2. 确认 `lessonId` 传递正确

#### 问题 4: 用户 profile 不存在
**症状**: 创建 purchase 记录时出错
**解决方案**: 我们已经添加了 `ensureUserProfile` 函数来自动创建用户 profile

## 修复内容总结

### 1. Webhook 改进 (`app/api/payment/webhook/route.ts`)
- ✅ 添加了详细的错误日志
- ✅ 改进了课程查找逻辑
- ✅ 添加了用户 profile 确保逻辑
- ✅ 从 metadata 中传递用户邮箱

### 2. Checkout 改进 (`app/api/payment/checkout/route.ts`)
- ✅ 在 metadata 中包含 `userEmail`
- ✅ 产品 ID 改为可配置的环境变量

### 3. 数据库查询改进 (`lib/db/queries.ts`)
- ✅ 添加了 `ensureUserProfile` 函数

## 测试步骤

1. **进行一次新的购买**:
   ```bash
   # 清除之前的测试数据（如果需要）
   # 然后进行购买
   ```

2. **检查日志**:
   ```bash
   # 查看 webhook 处理的完整流程
   ```

3. **验证结果**:
   ```bash
   # 运行诊断脚本
   npx tsx scripts/check-purchase-records.ts
   ```

4. **检查前端**:
   - 刷新 `/dashboard/courses` 页面
   - 确认购买的课程现在显示"开始学习"而不是"购买课程"
   - 访问 `/dashboard/billing` 确认支付记录显示

## 预防措施

1. **监控**: 定期检查 webhook 日志
2. **测试**: 每次部署后进行一次测试购买
3. **备份**: 考虑添加 webhook 重试机制
4. **日志**: 保持详细的日志记录用于调试

## 联系支持

如果问题仍然存在，请收集以下信息：
- 服务器日志（完整的 webhook 处理日志）
- 诊断脚本输出
- Creem Dashboard 中的 webhook 设置截图
- 测试购买的订单 ID
