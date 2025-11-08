import { MetadataRoute } from "next";
import { getAllLessons } from "@/lib/db/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://chinese-learn.vercel.app";
  const currentDate = new Date();

  // 获取所有课程
  const lessons = await getAllLessons();

  // 静态页面
  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: currentDate,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/refund-policy`,
      lastModified: currentDate,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];

  // 课程页面
  const lessonPages = lessons.map((lesson) => ({
    url: `${baseUrl}/lesson/${lesson.lessonId}`,
    lastModified: new Date(lesson.updatedAt || currentDate),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...lessonPages];
}
