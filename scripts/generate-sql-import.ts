import fs from 'fs';
import path from 'path';

const lessonsDataPath = path.join(process.cwd(), 'docs', 'lessons.json');
const lessonsData = JSON.parse(fs.readFileSync(lessonsDataPath, 'utf-8'));

function generateSQLImport() {
  console.log('生成 SQL 导入脚本...\n');
  
  let sql = `-- 课程数据导入 SQL 脚本
-- 生成时间: ${new Date().toISOString()}
-- 注意: 此脚本会使用 INSERT ... ON CONFLICT 来处理重复数据

BEGIN;

`;

  // 导入课程
  for (const lesson of lessonsData) {
    sql += `-- 课程: ${lesson.title_en} (${lesson.title_zh})\n`;
    sql += `INSERT INTO lessons (lesson_id, title_en, title_zh, description_en, cover, tag, "order")\n`;
    sql += `VALUES (\n`;
    sql += `  '${lesson.lesson_id}',\n`;
    sql += `  '${lesson.title_en.replace(/'/g, "''")}',\n`;
    sql += `  '${lesson.title_zh.replace(/'/g, "''")}',\n`;
    sql += `  '${lesson.description_en.replace(/'/g, "''")}',\n`;
    sql += `  '${lesson.cover || ''}',\n`;
    sql += `  '${lesson.tag}',\n`;
    sql += `  ${lesson.order}\n`;
    sql += `)\n`;
    sql += `ON CONFLICT (lesson_id) DO UPDATE SET\n`;
    sql += `  title_en = EXCLUDED.title_en,\n`;
    sql += `  title_zh = EXCLUDED.title_zh,\n`;
    sql += `  description_en = EXCLUDED.description_en,\n`;
    sql += `  cover = EXCLUDED.cover,\n`;
    sql += `  tag = EXCLUDED.tag,\n`;
    sql += `  "order" = EXCLUDED."order",\n`;
    sql += `  updated_at = NOW();\n\n`;
    
    // 获取课程 ID（通过子查询）
    sql += `-- 插入课程项目\n`;
    sql += `DO $$\n`;
    sql += `DECLARE\n`;
    sql += `  lesson_db_id INTEGER;\n`;
    sql += `BEGIN\n`;
    sql += `  SELECT id INTO lesson_db_id FROM lessons WHERE lesson_id = '${lesson.lesson_id}';\n\n`;
    
    // 先删除旧的项目
    sql += `  DELETE FROM lesson_items WHERE lesson_id = lesson_db_id;\n\n`;
    
    // 插入新项目
    for (let i = 0; i < lesson.items.length; i++) {
      const item = lesson.items[i];
      sql += `  INSERT INTO lesson_items (item_id, lesson_id, type, en, zh, py, accepted, audio, "order")\n`;
      sql += `  VALUES (\n`;
      sql += `    '${item.item_id}',\n`;
      sql += `    lesson_db_id,\n`;
      sql += `    '${item.type}',\n`;
      sql += `    '${item.en.replace(/'/g, "''")}',\n`;
      sql += `    '${item.zh.replace(/'/g, "''")}',\n`;
      sql += `    '${item.py.replace(/'/g, "''")}',\n`;
      sql += `    '${JSON.stringify(item.accepted).replace(/'/g, "''")}'::jsonb,\n`;
      sql += `    ${item.audio ? `'${item.audio.replace(/'/g, "''")}'` : 'NULL'},\n`;
      sql += `    ${i + 1}\n`;
      sql += `  );\n`;
    }
    
    sql += `END $$;\n\n`;
  }

  sql += `COMMIT;\n\n`;
  sql += `-- 验证导入结果\n`;
  sql += `SELECT COUNT(*) as total_lessons FROM lessons;\n`;
  sql += `SELECT COUNT(*) as total_items FROM lesson_items;\n`;

  // 写入文件
  const outputPath = path.join(process.cwd(), 'scripts', 'import-lessons.sql');
  fs.writeFileSync(outputPath, sql, 'utf-8');
  
  console.log(`✅ SQL 导入脚本已生成: ${outputPath}`);
  console.log(`\n📊 统计:`);
  console.log(`   - 课程数: ${lessonsData.length}`);
  console.log(`   - 总项目数: ${lessonsData.reduce((sum: number, l: any) => sum + l.items.length, 0)}`);
  console.log(`\n📋 使用说明:`);
  console.log(`   1. 打开 Supabase Dashboard → SQL Editor`);
  console.log(`   2. 复制 ${outputPath} 文件中的内容`);
  console.log(`   3. 粘贴到 SQL Editor`);
  console.log(`   4. 点击 "Run" 执行`);
}

generateSQLImport();

