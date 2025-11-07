1. 目前只设置Basic Greetings为Free，也就是lessonId为greetings_l1的课程免费。其他课程都为付费专享。

2. 目前购买的产品分为三类：单节课程（Single Course）、用户订阅（Pro）和永久会员(LifeTime)

3. 如果用户既不是订阅用户，也不是永久会员，那么课程需要实现单节课程购买后才能进行学习 。在支付时，需要上传lessonId这个自定义字段并且保存到数据库中。方便记录用户到底是购买了哪一节课程。

4. 用户可以通过订阅的方式购买，订阅是按月订阅。如果检测到是订阅用户可以解锁所有的课程

5. 同时用户也可以购买终身会员，如果有购买终身会员，那么也可以解锁所有的课程。

6. 单个课程的支付点击是在 /dashboard/courses 页面的课程卡片点击后跳转，按月订阅和终身会员是 /dashboard/membership页面和落地页的价格面板页面

7. 你需要创建多个接口：创建支付接口(/api/payment/chekcout)、接收webhook(/api/payment/webhook)、查询用户购买情况等，如果有我没有考虑到的接口你也需要创建

8. 你需要创建 /payment/success和/payment/fail两个页面，如果用户支付后，会首先跳转/payment/success页面，你需要在该页面验证用户的支付状态（10s超时），如果支付成功恭喜用户支付成功。如果失败跳转到payment/fail页面，需要告知原因。这两个页面都有按钮，直接能够跳转到 /dashboard 的页面

9. 支付相关的文档请务必参考 @creem-api.md 、@creem-subsctipon-api.md 、@creem-webhook.md

10. 在dashboard的顶部header，需要能够显示用户是否是订阅用户，或者是终身用户

11. 在侧边栏新增/dashboard/bill，能够显示用户支付成功的历史记录

## 环境变量配置

在 `.env.local` 文件中配置以下 Creem 产品 ID：

```bash
# Creem Product IDs
CREEM_SINGLE_COURSE_PRODUCT_ID=prod_1PXkTdYP5NLemxWw3hNTVh
CREEM_SUBSCRIPTION_PRODUCT_ID=prod_5i9h0mRDwXhBwMLz6NLAbu
CREEM_LIFETIME_PRODUCT_ID=prod_3XvVX8gPoOOfPhOfOQwJJj
```

注意：如果未配置环境变量，代码将使用以下默认值：
- Single Course: `prod_q0ZgFiLASKxtLeoo2i57E`
- Subscription: `prod_5i9h0mRDwXhBwMLz6NLAbu`
- Lifetime: `prod_3XvVX8gPoOOfPhOfOQwJJj`

建议在生产环境中使用环境变量而不是依赖默认值。

