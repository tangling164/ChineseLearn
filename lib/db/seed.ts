import { getDatabaseForScripts } from './index';
import { lessons, lessonItems } from './schema';
import lessonsData from '../../docs/lessons.json';
import { eq } from 'drizzle-orm';

export async function seedDatabase(options?: { clearExisting?: boolean }) {
  // 使用脚本专用的数据库连接（直接连接，不使用 pooler）
  const db = getDatabaseForScripts();
  
  try {
    console.log('开始导入课程数据...');
    const clearExisting = options?.clearExisting ?? false;

    if (clearExisting) {
      console.log('⚠️  警告: 将清空所有现有课程数据...');
      await db.delete(lessonItems);
      await db.delete(lessons);
      console.log('✅ 已清空现有数据');
    }

    let insertedCount = 0;
    let updatedCount = 0;
    let totalItemsCount = 0;

    // 导入课程数据
    for (const lessonData of lessonsData) {
      // 检查课程是否已存在
      const existingLesson = await db
        .select()
        .from(lessons)
        .where(eq(lessons.lessonId, lessonData.lesson_id))
        .limit(1);

      let lesson;
      
      if (existingLesson.length > 0) {
        // 更新现有课程
        [lesson] = await db
          .update(lessons)
          .set({
            titleEn: lessonData.title_en,
            titleZh: lessonData.title_zh,
            descriptionEn: lessonData.description_en,
            cover: lessonData.cover,
            tag: lessonData.tag,
            order: lessonData.order,
            updatedAt: new Date(),
          })
          .where(eq(lessons.lessonId, lessonData.lesson_id))
          .returning();
        updatedCount++;
        console.log(`📝 已更新课程: ${lessonData.title_en} (${lessonData.title_zh})`);
        
        // 删除旧的课程项目，以便重新插入
        await db
          .delete(lessonItems)
          .where(eq(lessonItems.lessonId, lesson.id));
      } else {
        // 插入新课程
        [lesson] = await db.insert(lessons).values({
          lessonId: lessonData.lesson_id,
          titleEn: lessonData.title_en,
          titleZh: lessonData.title_zh,
          descriptionEn: lessonData.description_en,
          cover: lessonData.cover,
          tag: lessonData.tag,
          order: lessonData.order,
        }).returning();
        insertedCount++;
        console.log(`✨ 已插入课程: ${lessonData.title_en} (${lessonData.title_zh})`);
      }

      // 插入/更新课程项目
      let itemsInserted = 0;
      for (let i = 0; i < lessonData.items.length; i++) {
        const item = lessonData.items[i];
        
        // 检查项目是否已存在
        const existingItem = await db
          .select()
          .from(lessonItems)
          .where(eq(lessonItems.itemId, item.item_id))
          .limit(1);

        if (existingItem.length > 0) {
          // 更新现有项目
          await db
            .update(lessonItems)
            .set({
              lessonId: lesson.id,
              type: item.type,
              en: item.en,
              zh: item.zh,
              py: item.py,
              accepted: item.accepted,
              audio: item.audio,
              order: i + 1,
            })
            .where(eq(lessonItems.itemId, item.item_id));
        } else {
          // 插入新项目
          await db.insert(lessonItems).values({
            itemId: item.item_id,
            lessonId: lesson.id,
            type: item.type,
            en: item.en,
            zh: item.zh,
            py: item.py,
            accepted: item.accepted,
            audio: item.audio,
            order: i + 1,
          });
          itemsInserted++;
        }
      }

      totalItemsCount += lessonData.items.length;
      console.log(`   ✓ 已处理 ${lessonData.items.length} 个练习项目`);
    }

    console.log('\n✅ 数据导入完成！');
    console.log(`📊 统计:`);
    console.log(`   - 新增课程: ${insertedCount} 个`);
    console.log(`   - 更新课程: ${updatedCount} 个`);
    console.log(`   - 总课程数: ${lessonsData.length} 个`);
    console.log(`   - 总练习项目: ${totalItemsCount} 个`);

  } catch (error) {
    console.error('❌ 数据导入失败:', error);
    if (error instanceof Error) {
      console.error('错误详情:', error.message);
      console.error('错误堆栈:', error.stack);
    }
    throw error;
  }
}

// 如果直接运行此文件，则执行数据种子
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('数据种子执行完成');
      process.exit(0);
    })
    .catch((error) => {
      console.error('数据种子执行失败:', error);
      process.exit(1);
    });
} 