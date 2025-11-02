# 课程数据导入指南

## 概述

本指南说明如何将 `docs/lessons.json` 中的课程数据导入到数据库中。

## 数据格式

课程数据存储在 `docs/lessons.json` 文件中，格式如下：

```json
[
  {
    "lesson_id": "greetings_l1",
    "title_en": "Basic Greetings",
    "title_zh": "基础问候",
    "description_en": "...",
    "cover": "https://...",
    "tag": "Greeting",
    "order": 1,
    "items": [
      {
        "item_id": "uuid",
        "type": "word",
        "en": "Hello",
        "zh": "你好",
        "py": "ni3hao3",
        "accepted": ["nihao", "ni hao", ...],
        "audio": "https://..."
      }
    ]
  }
]
```

## 导入方式

### 方式 1: 使用 npm 命令（推荐）

```bash
pnpm db:seed
```

这会执行增量导入（如果课程已存在则更新，否则插入新课程）。

### 方式 2: 清空后重新导入

如果需要完全清空现有数据并重新导入，需要修改 `scripts/setup-db.ts`：

```typescript
await seedDatabase({ clearExisting: true });
```

或者直接在代码中调用：

```typescript
import { seedDatabase } from './lib/db/seed';

await seedDatabase({ clearExisting: true });
```

## 导入行为

### 增量导入（默认）

- ✅ **新增课程**：如果 `lesson_id` 不存在，创建新课程
- ✅ **更新课程**：如果 `lesson_id` 已存在，更新课程信息
- ✅ **处理项目**：对于每个课程，删除旧项目并重新插入（确保顺序正确）
- ✅ **保留用户进度**：不会影响用户的课程进度数据

### 清空导入

- ⚠️ 会删除所有课程和课程项目
- ⚠️ 可能影响用户的课程进度（外键约束）

## 执行步骤

1. **确保数据库连接配置正确**
   ```bash
   # 检查 .env.local 文件
   cat .env.local | grep DATABASE
   ```

2. **运行导入命令**
   ```bash
   pnpm db:seed
   ```

3. **查看导入结果**
   导入脚本会输出详细的导入信息：
   ```
   开始导入课程数据...
   ✨ 已插入课程: Basic Greetings (基础问候)
      ✓ 已处理 10 个练习项目
   📝 已更新课程: Casual Conversation (日常对话)
      ✓ 已处理 10 个练习项目
   
   ✅ 数据导入完成！
   📊 统计:
      - 新增课程: 2 个
      - 更新课程: 2 个
      - 总课程数: 4 个
      - 总练习项目: 40 个
   ```

## 验证导入结果

### 方式 1: 使用 Drizzle Studio

```bash
pnpm db:studio
```

在浏览器中查看 `lessons` 和 `lesson_items` 表的数据。

### 方式 2: 查询数据库

```sql
-- 查看所有课程
SELECT lesson_id, title_en, title_zh, "order" FROM lessons ORDER BY "order";

-- 查看课程项目数量
SELECT l.lesson_id, l.title_en, COUNT(li.id) as item_count
FROM lessons l
LEFT JOIN lesson_items li ON l.id = li.lesson_id
GROUP BY l.id, l.lesson_id, l.title_en
ORDER BY l."order";
```

## 常见问题

### Q: 导入时出现重复键错误？

**A:** 脚本已经处理了重复数据，会自动更新已存在的课程。如果仍然报错，检查：
1. 数据库连接是否正常
2. `lesson_id` 和 `item_id` 是否唯一

### Q: 如何只导入部分课程？

**A:** 编辑 `docs/lessons.json`，只保留要导入的课程数据，然后运行 `pnpm db:seed`

### Q: 导入后课程顺序不对？

**A:** 检查 JSON 文件中的 `order` 字段是否正确。脚本会按照 `order` 字段的值进行导入。

### Q: 音频链接无效？

**A:** 音频链接不影响数据导入，但如果前端需要播放音频，请确保：
1. 音频文件 URL 可访问
2. 支持 CORS（如果跨域）

## 添加新课程

1. 在 `docs/lessons.json` 中添加新的课程对象
2. 确保 `lesson_id` 唯一
3. 设置正确的 `order` 值
4. 运行 `pnpm db:seed` 导入

示例：

```json
{
  "lesson_id": "new_lesson_l1",
  "title_en": "New Lesson",
  "title_zh": "新课程",
  "description_en": "Description here",
  "cover": "https://...",
  "tag": "Tag",
  "order": 5,
  "items": [
    {
      "item_id": "unique-uuid-here",
      "type": "word",
      "en": "English",
      "zh": "中文",
      "py": "pin1yin1",
      "accepted": ["pinyin", "pin yin"],
      "audio": "https://..."
    }
  ]
}
```

## 注意事项

1. ⚠️ **备份数据**：在生产环境导入前，建议先备份数据库
2. ⚠️ **测试环境**：先在测试环境验证导入脚本
3. ✅ **增量更新**：默认行为是增量更新，不会删除用户进度
4. ✅ **数据验证**：导入脚本会自动验证数据的完整性

## 相关文件

- `docs/lessons.json` - 课程数据源文件
- `lib/db/seed.ts` - 导入脚本
- `scripts/setup-db.ts` - 执行入口
- `lib/db/schema.ts` - 数据库表结构

