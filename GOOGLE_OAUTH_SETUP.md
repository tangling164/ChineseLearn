# Google OAuth 配置指南

## 错误说明

错误 `redirect_uri_mismatch` 表示 Google Cloud Console 中配置的重定向 URI 与 Supabase 使用的回调 URL 不匹配。

## 解决步骤

### 1. 获取 Supabase 的 OAuth 回调 URL

Supabase 的 Google OAuth 回调 URL 格式为：
```
https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback
```

**如何找到你的回调 URL：**

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 前往 **Authentication** → **Providers**
4. 找到 **Google** 提供商
5. 展开配置，你会看到 **Callback URL (for OAuth)**，类似：
   ```
   https://abcdefghijklmn.supabase.co/auth/v1/callback
   ```
6. **复制这个 URL**

### 2. 在 Google Cloud Console 配置

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 选择你的项目
3. 前往 **APIs & Services** → **Credentials**
4. 找到你的 OAuth 2.0 Client ID 并点击编辑
5. 在 **Authorized redirect URIs** 部分，添加以下 URL：

   **必须添加的 URI：**
   ```
   https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback
   ```
   
   **示例：**
   ```
   https://abcdefghijklmn.supabase.co/auth/v1/callback
   ```

   **如果你有多个环境，也要添加：**
   - 本地开发（如果需要）：`http://localhost:54321/auth/v1/callback`
   - 其他 Supabase 项目的回调 URL

6. 点击 **Save** 保存

### 3. 在 Supabase 配置 Google Provider

1. 在 Supabase Dashboard 中
2. 前往 **Authentication** → **Providers**
3. 找到 **Google** 并点击展开
4. 启用 Google Provider
5. 填入从 Google Cloud Console 获取的：
   - **Client ID**：你的 Google OAuth Client ID
   - **Client Secret**：你的 Google OAuth Client Secret
6. 点击 **Save** 保存

### 4. 配置 Supabase 重定向 URL（必须配置）

在 Supabase Dashboard：
1. 前往 **Authentication** → **URL Configuration**
2. 添加你的应用回调 URL 到 **Redirect URLs**：
   ```
   http://localhost:3000/auth/callback
   https://yourdomain.com/auth/callback
   https://*.vercel.app/auth/callback
   ```
   
   **注意**：这些是你的应用接收 OAuth 回调的 URL，不是 Supabase 的回调 URL。

### 5. 验证配置

完成配置后：
1. 等待 1-2 分钟让配置生效
2. 清除浏览器缓存或使用无痕模式
3. 尝试点击 "Sign in with Google" 按钮
4. 应该能够成功跳转到 Google 登录页面

## 常见问题

### Q: 仍然显示 redirect_uri_mismatch 错误？

**检查清单：**
- [ ] Google Cloud Console 中的 Redirect URI 与 Supabase 的回调 URL **完全一致**（包括 https/http）
- [ ] 已保存 Google Cloud Console 的更改
- [ ] 已保存 Supabase Dashboard 的更改
- [ ] 等待了 1-2 分钟让配置生效
- [ ] 清除了浏览器缓存

### Q: 如何找到我的 Supabase Project Ref？

在 Supabase Dashboard 的项目 URL 中：
```
https://supabase.com/dashboard/project/abcdefghijklmn
                                        ^^^^^^^^^^^^^^
                                        这就是你的 Project Ref
```

或者在 **Settings** → **General** → **Reference ID**

### Q: 需要配置 Site URL 吗？

是的，建议在 Supabase Dashboard → **Settings** → **General** 中设置：
- **Site URL**：你的生产域名（如 `https://yourdomain.com`）

## OAuth 流程说明

完整的 Google OAuth 登录流程：

1. **用户点击登录按钮**
   - 应用调用 `supabase.auth.signInWithOAuth({ provider: "google" })`
   - `redirectTo` 设置为 `https://yourdomain.com/auth/callback`

2. **跳转到 Google**
   - Supabase 将用户重定向到 Google 登录页面

3. **Google 授权后回调**
   - Google 将用户重定向到 Supabase 回调 URL：
     `https://[project-ref].supabase.co/auth/v1/callback?code=xxx`
   - Supabase 验证授权码并创建会话

4. **Supabase 重定向到应用**
   - Supabase 将用户重定向到你的应用回调 URL：
     `https://yourdomain.com/auth/callback?code=xxx`

5. **应用处理回调**
   - `/auth/callback` 路由调用 `exchangeCodeForSession(code)`
   - 交换授权码获取会话
   - 重定向到 dashboard

## 测试流程

配置完成后的测试步骤：
1. 访问登录页面
2. 点击 "Sign in with Google" 按钮
3. 应该跳转到 Google 账号选择页面
4. 选择账号并授权
5. 应该跳转到 `/auth/callback` 处理回调
6. 最终跳转到 dashboard 并显示已登录状态

## 需要帮助？

如果仍有问题，请检查：
1. Supabase Dashboard → **Logs** → **Auth Logs** 查看详细错误
2. Google Cloud Console → **APIs & Services** → **OAuth consent screen** 确保应用已发布
3. 确认 Google OAuth Client 类型为 **Web application**

