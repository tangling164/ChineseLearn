# 替代方案：通过 Supabase SQL Editor 导入数据

如果网络连接问题无法解决，可以通过 Supabase Dashboard 的 SQL Editor 手动导入课程数据。

## 方案 1: 通过 SQL Editor 导入（推荐）

### 步骤

1. **打开 Supabase Dashboard**
   - 访问你的项目
   - 点击左侧菜单的 **SQL Editor**

2. **创建导入 SQL 脚本**

   我已经为你准备了 SQL 导入脚本，运行以下命令生成：

   ```bash
   pnpm exec tsx scripts/generate-sql-import.ts
   ```

   这会生成一个 SQL 文件，包含所有课程的 INSERT 语句。

3. **在 SQL Editor 中执行**
   - 复制生成的 SQL 内容
   - 粘贴到 Supabase SQL Editor
   - 点击 "Run" 执行

## 方案 2: 使用 Supabase API（如果网络限制只影响直接数据库连接）

如果通过 HTTP API 可以访问（Supabase REST API），可以考虑通过 API 导入数据。

---

## 下一步

**请先确认**：

1. ✅ 是否点击了 "Allow all access" 按钮？
2. ✅ Network Restrictions 页面是否还显示警告？
3. ✅ 能否获取到 IPv4 地址？

如果可以，我会：
- 生成 SQL 导入脚本
- 或者继续尝试解决连接问题

---

## 临时工作流

1. 在本地开发时，通过 Supabase SQL Editor 手动导入/更新数据
2. 解决网络连接问题后，恢复使用 `pnpm db:seed` 自动导入


