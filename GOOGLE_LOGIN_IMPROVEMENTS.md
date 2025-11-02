# Google Login 改进说明

## 问题描述

之前的实现存在以下问题：
1. 使用 Google One Tap 的 `renderButton` 会显示用户头像和邮箱（个性化按钮）
2. 退出登录后，按钮仍显示上一个用户的账号信息
3. 复杂的 One Tap 弹窗逻辑导致用户体验不一致

## 解决方案

### 1. 移除 Google One Tap 集成
- 删除了 Google Identity Services 脚本加载
- 移除了 `renderButton` 和 `prompt` 相关代码
- 删除了所有 One Tap 相关的类型定义

### 2. 使用标准 OAuth 2.0 流程
采用 Supabase 的 `signInWithOAuth` 方法，提供标准的 Google 登录体验：

```typescript
const handleGoogleLogin = async () => {
  const supabase = createClient();
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
      queryParams: {
        access_type: "offline",
        prompt: "select_account",  // 每次都显示账号选择器
      },
    },
  });
};
```

### 3. 自定义 Google 按钮样式
- 使用标准的 outline button 样式
- 添加 Google 官方 SVG 图标
- 清晰的加载状态提示

### 4. 简化退出登录逻辑
- 移除了复杂的 sessionStorage 标记
- 移除了 Google One Tap 清理代码
- 直接跳转到首页

## 优势

1. **一致性**：每次登录都显示 Google 账号选择器，用户可以选择使用哪个账号
2. **隐私性**：不会在按钮上显示用户信息
3. **可维护性**：代码更简洁，减少了 150+ 行复杂的 One Tap 逻辑
4. **可靠性**：使用 Supabase 标准 OAuth 流程，更稳定
5. **用户体验**：标准的 Google 登录流程，用户更熟悉

## 环境变量

不再需要 `NEXT_PUBLIC_GOOGLE_CLIENT_ID`，因为 Supabase 会处理 OAuth 配置。

只需在 Supabase Dashboard 中配置 Google Provider：
1. 前往 Authentication → Providers
2. 启用 Google
3. 填入 Google Cloud Console 的 Client ID 和 Client Secret

## 测试清单

- [ ] 点击 "Sign in with Google" 按钮跳转到 Google 登录页
- [ ] 选择账号后成功登录并跳转到 dashboard
- [ ] 退出登录后返回首页
- [ ] 再次登录时可以选择不同的 Google 账号
- [ ] 按钮样式在亮色/暗色主题下都正常显示

