# Google 登录回调问题修复

## 问题描述

Google 登录后跳转回登录页面，没有保持登录状态。

## 根本原因

之前的实现将 `redirectTo` 直接设置为 `/dashboard`，但 Supabase OAuth 流程需要：
1. Google → Supabase 回调 URL
2. Supabase → 应用回调 URL（处理授权码）
3. 应用回调 → Dashboard

缺少了第2步的授权码交换过程，导致会话未正确建立。

## 解决方案

### 1. 创建 OAuth 回调路由

新建 `/app/auth/callback/route.ts`：

```typescript
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_error`);
}
```

### 2. 更新登录表单

修改 `redirectTo` 指向回调路由：

```typescript
const { error: oauthError } = await supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,  // 改为回调路由
    queryParams: {
      access_type: "offline",
      prompt: "select_account",
    },
  },
});
```

### 3. 配置 Supabase 重定向 URL

在 Supabase Dashboard → Authentication → URL Configuration 添加：

```
http://localhost:3000/auth/callback
https://yourdomain.com/auth/callback
https://*.vercel.app/auth/callback
```

## OAuth 流程图

```
用户点击 "Sign in with Google"
    ↓
应用调用 signInWithOAuth({ redirectTo: "/auth/callback" })
    ↓
跳转到 Google 登录页面
    ↓
用户选择账号并授权
    ↓
Google → Supabase 回调: https://[project].supabase.co/auth/v1/callback?code=xxx
    ↓
Supabase 验证并创建会话
    ↓
Supabase → 应用回调: https://yourdomain.com/auth/callback?code=xxx
    ↓
应用调用 exchangeCodeForSession(code)
    ↓
会话建立成功
    ↓
重定向到 /dashboard
    ↓
用户已登录 ✅
```

## 验证步骤

1. **清除浏览器缓存**或使用无痕模式
2. 访问登录页面
3. 点击 "Sign in with Google"
4. 选择 Google 账号
5. 观察 URL 变化：
   - `/auth/login` → Google 登录页 → `/auth/callback?code=xxx` → `/dashboard`
6. 检查是否显示已登录状态

## 调试技巧

### 查看回调 URL
在浏览器开发者工具的 Network 标签中，观察重定向链：
- 应该看到从 Google 重定向到 `/auth/callback?code=xxx`
- 然后重定向到 `/dashboard`

### 查看 Supabase 日志
在 Supabase Dashboard → Logs → Auth Logs 中查看：
- OAuth 授权请求
- 授权码交换
- 会话创建

### 常见错误

1. **仍然跳转到登录页**
   - 检查 Supabase URL Configuration 是否添加了回调 URL
   - 确认回调路由文件存在：`app/auth/callback/route.ts`

2. **显示 "auth_callback_error"**
   - 检查 Supabase Auth Logs 查看具体错误
   - 确认 Google OAuth 配置正确

3. **Code exchange 失败**
   - 确认 Supabase 的 Google Provider 已启用
   - 检查 Client ID 和 Client Secret 是否正确

## 文件清单

修改/新增的文件：
- ✅ `app/auth/callback/route.ts` (新建)
- ✅ `components/login-form.tsx` (修改 redirectTo)
- ✅ `GOOGLE_OAUTH_SETUP.md` (更新配置说明)
- ✅ `GOOGLE_LOGIN_FIX.md` (本文档)

