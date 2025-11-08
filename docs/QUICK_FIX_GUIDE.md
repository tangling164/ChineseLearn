# 快速修复指南：支付和课程解锁问题

## 🚀 立即验证修复

### 1. 编译并运行诊断
```bash
npx tsx scripts/check-purchase-records.ts
```

**期望输出**: 如果一切正常，应该看到你的购买记录和支付记录。

### 2. 进行测试购买
1. 登录网站
2. 进入 `/dashboard/courses`
3. 购买一个课程
4. 完成支付流程

### 3. 验证修复结果
**支付成功后**：
- ✅ 课程立即解锁（显示"开始学习"按钮）
- ✅ `/dashboard/billing` 显示支付记录
- ✅ 服务器日志显示 webhook 处理成功

## 🔧 主要修复内容

| 文件 | 修复内容 |
|------|----------|
| `app/api/payment/webhook/route.ts` | 增强错误处理，添加用户 profile 创建，优化课程查找 |
| `app/api/payment/checkout/route.ts` | 传递用户邮箱到 metadata，产品 ID 环境变量 |
| `lib/db/queries.ts` | 新增 `ensureUserProfile` 函数 |
| `.env.example` | 添加产品 ID 环境变量配置 |

## 📋 配置文件

### 必需的环境变量
在 `.env.local` 中设置：
```bash
# Creem Product IDs
CREEM_SINGLE_COURSE_PRODUCT_ID=prod_你的单课程产品ID
CREEM_SUBSCRIPTION_PRODUCT_ID=prod_你的订阅产品ID
CREEM_LIFETIME_PRODUCT_ID=prod_你的终身产品ID

# 确保这些也存在
CREEM_API_KEY=你的_api_key
CREEM_WEBHOOK_SECRET=你的_webhook_secret
NEXT_PUBLIC_CREEM_URL=https://api.creem.io
```

## 🐛 故障排除

### 问题: 课程仍然没有解锁
**检查**:
1. Webhook URL 在 Creem 中是否正确配置
2. 服务器日志中是否有 webhook 请求
3. 签名验证是否通过

### 问题: billing 页面没有记录
**检查**:
1. `paymentTransactions` 表中是否有记录
2. Webhook 是否成功处理

### 问题: "Lesson not found" 错误
**解决方案**:
```bash
pnpm db:seed  # 导入课程数据
```

## 📊 监控要点

### 关键日志消息
- ✅ `Received Creem webhook: checkout.completed`
- ✅ `Found lesson for purchase: { lessonId: 1, lessonIdValue: "xxx" }`
- ✅ `Single course purchase completed: { userId: "xxx", lessonId: 1 }`

### 警告日志
- ⚠️ `Invalid Creem signature` → 检查 webhook secret
- ⚠️ `Lesson not found in database` → 导入课程数据
- ⚠️ `Missing userId in checkout metadata` → 检查 checkout 创建逻辑

## 📞 需要帮助？

如果问题仍然存在，请收集以下信息：
1. 诊断脚本输出
2. 完整的 webhook 处理日志
3. Creem Dashboard 中的 webhook 设置截图

参考文档：
- `docs/PAYMENT_DEBUGGING.md` - 详细排查指南
- `docs/PAYMENT_FIX_SUMMARY.md` - 完整修复总结
