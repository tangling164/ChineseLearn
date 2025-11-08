# SEO 快速参考指南

## 🎯 关键优化项目

### ✅ 已完成
1. ✅ 基础 SEO 工具库 (`lib/seo.ts`)
2. ✅ 全局 metadata (`app/layout.tsx`)
3. ✅ 课程页面 metadata (`app/lesson/[lessonId]/page.tsx`)
4. ✅ Dashboard 页面 metadata (`app/dashboard/page.tsx`)
5. ✅ 结构化数据 (JSON-LD)
6. ✅ Sitemap 自动生成 (`app/sitemap.ts`)
7. ✅ Robots.txt 配置 (`app/robots.ts`)
8. ✅ 性能优化 (`next.config.ts`)
9. ✅ PWA 支持 (`public/site.webmanifest`)
10. ✅ 面包屑导航 (`components/ui/breadcrumbs.tsx`)

## 🔧 日常使用

### 为新页面添加 SEO
```typescript
import { generateSEOMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generateSEOMetadata({
  title: "页面标题",
  description: "页面描述",
  keywords: ["关键词1", "关键词2"],
});
```

### 为动态页面添加 SEO
```typescript
export async function generateMetadata({ params }) {
  const data = await fetchData(params.id);
  
  return generateSEOMetadata({
    title: data.title,
    description: data.description,
    keywords: data.tags,
  });
}
```

### 添加结构化数据
```typescript
import { generateCourseSchema } from "@/lib/seo";

const schema = generateCourseSchema({
  name: "课程名称",
  description: "课程描述",
  url: "/lesson/lesson-id",
  image: "/image.jpg",
  instructor: "讲师",
  offers: { price: "9.99", priceCurrency: "USD" },
});

return (
  <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <YourContent />
  </>
);
```

## 📊 验证工具

### Google 工具
- [PageSpeed Insights](https://pagespeed.web.dev/) - 测试性能
- [Search Console](https://search.google.com/search-console) - 监控搜索
- [Rich Results Test](https://search.google.com/test/rich-results) - 测试富媒体
- [Schema Validator](https://validator.schema.org/) - 验证结构化数据

### 验证命令
```bash
# 检查构建
pnpm build

# 运行 lint
pnpm lint

# 本地测试
pnpm dev
```

## 📈 监控指标

### SEO 指标
- 有机流量
- 关键词排名
- 点击率 (CTR)
- 页面停留时间

### 性能指标 (Core Web Vitals)
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1

## 📋 定期任务

### 每周
- [ ] 检查 Search Console 消息
- [ ] 查看 PageSpeed Insights 分数
- [ ] 监控新的索引页面

### 每月
- [ ] 审查关键词排名
- [ ] 分析流量趋势
- [ ] 更新 sitemap

### 每次发布
- [ ] 验证新页面 metadata
- [ ] 检查结构化数据
- [ ] 测试页面速度

## 🔗 重要文件

| 文件 | 用途 |
|------|------|
| `lib/seo.ts` | SEO 工具库 |
| `app/layout.tsx` | 全局 metadata |
| `app/sitemap.ts` | Sitemap 生成 |
| `app/robots.ts` | Robots.txt |
| `next.config.ts` | 性能配置 |
| `components/ui/breadcrumbs.tsx` | 面包屑 |

## 🎨 关键配置

### Sitemap
- 自动包含所有课程
- 静态页面优先级设置
- 定期更新频率

### 结构化数据
- Course: 课程页面
- Organization: 组织信息
- WebSite: 网站信息
- Breadcrumb: 面包屑

### 性能
- 图片格式: AVIF, WebP
- 压缩: 启用
- 缓存: 60秒
- SWC: 启用

## 💡 最佳实践

1. **标题**: 包含主关键词，60字符内
2. **描述**: 吸引人，160字符内
3. **关键词**: 5-10个相关词
4. **图片**: 使用 WebP/AVIF 格式
5. **速度**: LCP < 2.5s

## 🚀 快速测试

1. 打开 [PageSpeed Insights](https://pagespeed.web.dev/)
2. 输入网站 URL
3. 检查分数和建议
4. 运行 Rich Results Test
5. 验证 sitemap: `/sitemap.xml`

---

**下一步**: 在 Search Console 中提交 sitemap，监控表现
