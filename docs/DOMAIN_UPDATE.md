# 域名更新摘要

## 📝 更新概览

应用域名已更新为: **https://chinese101.app**

同时重新定位目标用户群体：
- 主要面向：旅行者和在中国的外籍人士
- 次要面向：商务人士和汉语学习者

## ✅ 已更新的文件

### 1. `app/layout.tsx` - 根布局 SEO
- ✅ **Title**: `Chinese101 – Learn Chinese for Travel & Business`
- ✅ **Description**: 针对旅行者和商务人士的描述
- ✅ **Keywords**: 更新为旅行和商务相关关键词
- ✅ **Open Graph**: 
  - URL: `https://chinese101.app`
  - Image: `/og-cover.png`
  - Title: `Chinese101 – Learn Chinese for Travel & Business`
- ✅ **Twitter Card**: 同步更新
- ✅ **Canonical URL**: `https://chinese101.app`

### 2. `app/sitemap.ts` - Sitemap
- 默认 URL 更新为: `https://chinese101.app`

### 3. `app/robots.ts` - Robots.txt
- 默认 URL 更新为: `https://chinese101.app`

### 4. `lib/seo.ts` - SEO 工具库
- 默认 SITE_URL 更新为: `https://chinese101.app`
- 默认图片更新为: `/og-cover.png`

## 🎯 SEO 关键词更新

**新增关键词**:
- Learn Chinese
- Chinese travel
- Chinese business
- Travel Chinese
- Business Chinese
- Chinese for expats
- Chinese phrases
- Mandarin lessons

**移除关键词**:
- HSK exam (针对考试)
- 纯技术性关键词

## 📊 更新后的元数据

```html
<title>Chinese101 – Learn Chinese for Travel & Business</title>
<meta name="description" content="Quick and practical Chinese lessons for travelers and expats in China. Learn Mandarin phrases fast with our interactive typing course. Master Pinyin input and Chinese characters for real-world travel and business communication." />
<meta property="og:title" content="Chinese101 – Learn Chinese for Travel & Business" />
<meta property="og:description" content="Quick and practical Chinese lessons for travelers and expats in China. Learn Mandarin phrases fast with our interactive typing course." />
<meta property="og:image" content="https://chinese101.app/og-cover.png" />
<link rel="canonical" href="https://chinese101.app" />
```

## 🚀 部署后注意事项

### 1. 环境变量
在 Vercel 中设置:
```bash
NEXT_PUBLIC_SITE_URL=https://chinese101.app
```

### 2. Google Search Console
- 提交新的 sitemap: `https://chinese101.app/sitemap.xml`
- 更新站点地图位置
- 请求重新索引

### 3. 社交媒体
更新社交媒体资料中的链接:
- Facebook Page
- Twitter Profile
- LinkedIn Company Page

### 4. 重定向
如果旧域名有流量，需要设置 301 重定向:
```
https://chinese-learn.vercel.app → https://chinese101.app
```

### 5. DNS 设置
确保以下 DNS 记录:
```
类型: CNAME
名称: www
值: chinese101.app

类型: A
名称: @
值: [Vercel IP]
```

## 📈 预期效果

### 搜索优化
- 更精准的关键词匹配旅行者和商务用户
- 提高在 "travel Chinese" 和 "business Chinese" 搜索中的排名
- 更好的地域定位（在中国）

### 社交分享
- 更吸引旅行者和商务人士的描述
- 专业的品牌定位
- 清晰的受众定位

## 🔗 验证清单

- [ ] 部署到 Vercel
- [ ] 设置 NEXT_PUBLIC_SITE_URL
- [ ] 更新 og-cover.png 图片文件
- [ ] 提交 sitemap 到 Google
- [ ] 更新 Google Search Console
- [ ] 测试所有页面的元数据
- [ ] 验证 canonical URL
- [ ] 检查 Open Graph 预览

## 📝 下一步

1. 准备 og-cover.png 图片
2. 在 Google Search Console 中更新域名
3. 监控新域名的索引状态
4. 跟踪搜索排名变化

---

**状态**: ✅ 完成
**日期**: 2025-11-09
**域名**: https://chinese101.app
