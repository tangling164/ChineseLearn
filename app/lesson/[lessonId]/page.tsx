import { LessonPlayer } from "@/components/lesson/lesson-player";
import { AccessDeniedCard } from "@/components/lesson/access-denied-card";
import { notFound } from "next/navigation";
import { getLessonWithItems, canUserAccessLesson } from "@/lib/db/queries";
import { createClient } from "@/lib/supabase/server";
import { generateSEOMetadata, generateCourseSchema } from "@/lib/seo";
import type { Metadata } from "next";

interface LessonPageProps {
  params: Promise<{
    lessonId: string;
  }>;
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { lessonId } = await params;
  const lesson = await getLessonWithItems(lessonId);

  if (!lesson) {
    return {
      title: "Lesson Not Found",
    };
  }

  return generateSEOMetadata({
    title: `${lesson.titleEn} - Chinese Typing Course`,
    description: lesson.descriptionEn,
    keywords: [
      lesson.titleEn,
      "Chinese typing",
      lesson.tag,
      "HSK typing",
      "Pinyin practice",
    ],
    type: "article",
  });
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { lessonId } = await params;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return notFound();
  }
  
  // Find the lesson data from database
  const lesson = await getLessonWithItems(lessonId);
  
  if (!lesson) {
    notFound();
  }

  // 检查用户是否可以访问该课程
  const accessCheck = await canUserAccessLesson(user.id, lessonId);
  
  if (!accessCheck.canAccess) {
    return <AccessDeniedCard lessonId={lessonId} />;
  }

  // 生成课程结构化数据
  const courseSchema = generateCourseSchema({
    name: lesson.titleEn,
    description: lesson.descriptionEn,
    url: `/lesson/${lessonId}`,
    image: lesson.cover || "/default-course-image.png",
    instructor: "Chinese101 Team",
    offers: {
      price: "9.99",
      priceCurrency: "USD",
      availability: "InStock",
    },
    aggregateRating: {
      ratingValue: "4.8",
      ratingCount: "250",
    },
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(courseSchema),
        }}
      />
      <LessonPlayer lesson={lesson} userId={user.id} />
    </>
  );
} 