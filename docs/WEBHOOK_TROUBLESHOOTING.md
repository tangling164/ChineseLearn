# 🚨 Webhook 问题彻底解决方案

## 已发现的关键问题

### ❌ 问题 1: CREEM_WEBHOOK_SECRET 配置错误
**位置**: `.env` 文件第 10 行

**错误配置**:
```bash
CREEM_WEBHOOK_SECRET=https://chinese-learn.vercel.app/api/payment/webhook  # ❌ 错误！
```

**正确配置**:
```bash
CREEM_WEBHOOK_SECRET=your_actual_webhook_secret_from_dashboard  # ✅ 正确
```

**原因**: Webhook secret 应该是一个密钥字符串，而不是 URL。签名验证使用这个密钥来验证请求的真实性。

## 🔧 立即修复步骤

### 步骤 1: 修复 .env 文件
```bash
# 在 .env.local 中设置正确的 secret
CREEM_WEBHOOK_SECRET=从 Creem Dashboard 获取的实际密钥
```

### 步骤 2: 在 Creem Dashboard 中配置 Webhook
1. 登录 [Creem Dashboard](https://creem.io/dashboard)
2. 转到 **Developers** > **Webhooks**
3. 点击 **Add Webhook**
4. 设置 **Endpoint URL**:
   ```
   https://chinese-learn.vercel.app/api/payment/webhook
   ```
5. 选择 **Events**: `checkout.completed`
6. 复制 **Signing Secret**，粘贴到 `.env.local` 的 `CREEM_WEBHOOK_SECRET`

## 🧪 验证修复

### 方法 1: 使用测试工具
```bash
# 1. 检查数据库记录
pnpm tsx scripts/check-db-records.ts

# 2. 手动触发 webhook
pnpm tsx scripts/trigger-webhook.ts

# 3. 再次检查记录
pnpm tsx scripts/check-db-records.ts
```

### 方法 2: 进行真实购买
1. 登录网站
2. 进入 `/dashboard/courses`
3. 购买一个课程
4. 完成支付
5. 检查日志中是否有:
   ```
   Received Creem webhook: checkout.completed
   Found lesson for purchase: { lessonId: 1, lessonIdValue: "xxx" }
   Single course purchase completed: { userId: "xxx", lessonId: 1 }
   ```

## 📊 调试工具

### 脚本列表
| 脚本 | 用途 |
|------|------|
| `scripts/check-db-records.ts` | 检查数据库中的所有记录 |
| `scripts/check-purchase-records.ts` | 检查购买和支付记录 |
| `scripts/trigger-webhook.ts` | 手动触发 webhook 测试 |
| `scripts/manual-webhook.ts` | 直接调用 webhook 处理逻辑（绕过签名验证） |

### 使用方法
```bash
# 编译并运行
pnpm tsx scripts/脚本名.ts
```

## 🔍 日志分析

### 正常日志
```
Received Creem webhook: checkout.completed evt_xxx
Signature validation: PASSED
Found lesson for purchase: { lessonId: 1, lessonIdValue: "greetings_l1" }
Single course purchase completed: { userId: "xxx", lessonId: 1 }
```

### 签名验证失败
```
Invalid Creem signature
```
**解决方案**: 检查 `CREEM_WEBHOOK_SECRET` 是否正确

### 课程未找到
```
Lesson not found in database: greetings_l1
```
**解决方案**: 运行 `pnpm db:seed` 导入课程数据

### Webhook 未被调用
```
# 服务器日志中没有 "Received Creem webhook"
```
**解决方案**: 检查 Creem Dashboard 中的 webhook URL 是否正确

## ⚙️ 配置清单

### 必需的环境变量
```bash
# Creem API
CREEM_API_KEY=creem_test_xxx

# Webhook（重要！）
CREEM_WEBHOOK_SECRET=从Dashboard复制的密钥

# URL
NEXT_PUBLIC_CREEM_URL=https://test-api.creem.io

# 产品 IDs
CREEM_SINGLE_COURSE_PRODUCT_ID=prod_xxx
CREEM_SUBSCRIPTION_PRODUCT_ID=prod_xxx
CREEM_LIFETIME_PRODUCT_ID=prod_xxx
```

### Creem Dashboard 设置
- [ ] Webhook URL 正确设置
- [ ] Webhook secret 复制到 .env.local
- [ ] 订阅了 `checkout.completed` 事件
- [ ] 产品已创建并配置

## 🚀 快速测试流程

1. **修复配置**:
   ```bash
   # 编辑 .env.local
   CREEM_WEBHOOK_SECRET=正确的密钥
   ```

2. **重启服务器**:
   ```bash
   pnpm dev
   ```

3. **进行购买**:
   - 访问课程页面
   - 点击购买
   - 完成支付

4. **验证结果**:
   - 课程立即解锁
   - `/dashboard/billing` 显示记录
   - 日志显示成功处理

## 📞 需要帮助？

如果问题仍然存在，请提供：

1. **环境变量配置** (隐藏敏感信息):
   ```bash
   CREEM_API_KEY=✅ 已设置
   CREEM_WEBHOOK_SECRET=✅ 已设置 (不是 URL)
   NEXT_PUBLIC_CREEM_URL=✅ 已设置
   ```

2. **服务器日志** (购买后的 webhook 处理日志)

3. **数据库记录**:
   ```bash
   pnpm tsx scripts/check-db-records.ts
   ```

4. **Creem Dashboard 截图**:
   - Webhook 设置页面
   - 购买测试的交易记录

## 总结

**主要问题**: Webhook secret 配置错误（设置为 URL 而不是密钥）
**解决方案**: 从 Creem Dashboard 获取正确的 secret 并更新 `.env.local`
**预期结果**: 购买后课程立即解锁，billing 页面显示记录
