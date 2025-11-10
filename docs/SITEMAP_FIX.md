# Sitemap.xml Content-Type 修复

## ❌ 问题描述

Google Search Console 报错：`Sitemap is HTML instead of XML`

**根本原因**:
1. `next.config.ts` 中的重写规则将 `/sitemap.xml` 重写到 `/sitemap`
2. 中间件可能拦截了这些 SEO 关键文件
3. 导致返回 Content-Type: text/html 而不是 application/xml

## ✅ 修复方案

### 1. 移除重写规则
**文件**: `next.config.ts`

**修复前**:
```typescript
async rewrites() {
  return [
    {
      source: "/sitemap.xml",
      destination: "/sitemap",
    },
  ];
}
```

**修复后**:
```typescript
// Removed rewrites to fix sitemap.xml content-type issue
// Next.js App Router automatically handles /sitemap and /robots routes
```

### 2. 更新中间件
**文件**: `middleware.ts`

**修复前**:
```typescript
matcher: "/((?!_next/static|_next/image|favicon.ico|api/payment/webhook|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
```

**修复后**:
```typescript
matcher: "/((?!_next/static|_next/image|favicon.ico|sitemap\\.xml|robots\\.txt|api/payment/webhook|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
```

**说明**: 明确排除 `sitemap.xml` 和 `robots.txt` 路径，防止中间件拦截

### 3. 优化 Sitemap 生成
**文件**: `app/sitemap.ts`

添加:
```typescript
export const dynamic = "force-static";
```

**说明**: 确保 sitemap 作为静态内容生成，提高性能并确保正确的 Content-Type

## 📊 验证结果

构建输出显示正确编译:
```
├ ○ /robots.txt 144 B
├ ○ /sitemap.xml 144 B
```

- ✅ TypeScript 检查通过
- ✅ ESLint 检查通过
- ✅ Next.js 构建成功

## 🚀 部署后验证

### 1. 测试 Sitemap 访问
```bash
curl -I https://chinese101.app/sitemap.xml
```

**期望响应**:
```
HTTP/2 200
content-type: application/xml
```

### 2. 测试 Robots 访问
```bash
curl -I https://chinese101.app/robots.txt
```

**期望响应**:
```
HTTP/2 200
content-type: text/plain
```

### 3. 浏览器验证
- 访问 `https://chinese101.app/sitemap.xml`
- 应该显示 XML 内容，而不是 HTML 页面

## 🔍 Google Search Console 步骤

1. **删除旧提交**:
   - 进入 Sitemaps 页面
   - 删除之前提交的 sitemap

2. **重新提交**:
   - 等待部署完成
   - 重新提交: `https://chinese101.app/sitemap.xml`

3. **监控状态**:
   - 状态应显示 "Success"
   - 不应有 "Couldn't fetch" 错误

## 📋 预防措施

### Content-Type 检查清单
- [ ] sitemap.xml 返回 `application/xml`
- [ ] robots.txt 返回 `text/plain`
- [ ] 中间件不拦截这些路径
- [ ] 没有重写规则干扰

### 测试命令
```bash
# 检查 Content-Type
curl -I https://chinese101.app/sitemap.xml
curl -I https://chinese101.app/robots.txt

# 验证内容
curl https://chinese101.app/sitemap.xml | head -20
```

## 🔧 其他可能的解决方案

如果问题仍然存在，可以考虑：

### 方案 1: API Route (不推荐)
创建 `app/api/sitemap/route.ts`:
```typescript
export async function GET() {
  const sitemap = await generateSitemap();
  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
```

### 方案 2: 静态文件
在 `public/` 目录放置 `sitemap.xml` 和 `robots.txt`

## 📚 参考资料

- [Next.js Sitemap 文档](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Google Sitemap 指南](https://developers.google.com/search/docs/sitemaps/overview)
- [Content-Type 最佳实践](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type)

## 🎯 总结

**问题**: Sitemap 被识别为 HTML
**原因**: 重写规则 + 中间件拦截
**解决**: 移除重写 + 排除路径
**状态**: ✅ 已修复

部署后 sitemap.xml 将正确返回 XML 格式，Google Search Console 可以正常解析。
