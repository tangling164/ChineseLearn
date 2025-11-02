# 数据库连接超时问题修复指南

## 问题描述

运行 `pnpm db:seed` 或 `pnpm db:push` 时出现 `CONNECT_TIMEOUT` 错误，但 `pnpm db:migrate` 可以正常工作。

## 原因分析

1. **Supabase Pooler vs 直接连接**
   - `db:migrate` 使用 `drizzle.config.ts`，它自动使用 `migrations` target，会尝试使用直接连接
   - `db:seed` 和 `db:push` 原本使用 `runtime` target，可能使用 pooler 连接
   - Pooler 连接不支持某些 DDL 操作，且可能有超时限制

2. **连接超时**
   - Pooler 连接的超时时间较短
   - 脚本操作需要更长的执行时间

## 解决方案

### 已自动修复

代码已经更新：
- ✅ `seed.ts` 现在使用 `getDatabaseForScripts()`，自动使用直接连接
- ✅ 增加了连接超时时间到 30 秒
- ✅ 使用单连接避免连接池问题

### 手动配置（如果仍有问题）

如果自动修复不工作，你需要配置 `DIRECT_DATABASE_URL` 环境变量：

1. **获取直接连接字符串**

   在 Supabase Dashboard：
   - 前往 **Project Settings** → **Database**
   - 找到 **Connection string** 部分
   - 选择 **URI** 标签
   - 复制连接字符串（格式：`postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`）

2. **添加到环境变量**

   在 `.env.local` 文件中添加：

   ```bash
   # 直接数据库连接（用于迁移和种子脚本）
   DIRECT_DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require
   ```

   或者：

   ```bash
   # 使用 SUPABASE_MIGRATIONS_URL（优先）
   SUPABASE_MIGRATIONS_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require
   ```

3. **重要提示**
   - 不要将密码提交到 Git
   - 确保使用 `.env.local`（已在 `.gitignore` 中）
   - 直接连接不使用 pooler，支持所有数据库操作

## 验证修复

运行以下命令验证：

```bash
# 测试种子脚本
pnpm db:seed

# 测试 push（如果需要）
pnpm db:push
```

如果仍然失败，检查：

1. **连接字符串格式**
   ```bash
   # 检查环境变量是否加载
   cat .env.local | grep DATABASE
   ```

2. **网络连接**
   ```bash
   # 测试能否连接到数据库
   # 从连接字符串中提取信息后测试
   telnet db.[PROJECT-REF].supabase.co 5432
   ```

3. **Supabase 项目状态**
   - 确认项目没有被暂停
   - 检查 Supabase Dashboard 中的项目状态

## 环境变量优先级

连接字符串解析的优先级：

1. `SUPABASE_MIGRATIONS_URL` (最高优先级)
2. `DIRECT_DATABASE_URL`
3. `DRIZZLE_MIGRATIONS_URL`
4. 自动推导的直接连接（从 `DATABASE_URL` 推导）

## 完整的 .env.local 示例

```bash
# Supabase 项目 URL
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[ANON-KEY]

# 数据库连接（用于运行时，使用 pooler）
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true

# 直接数据库连接（用于脚本，不使用 pooler）
DIRECT_DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require
```

## 常见错误和解决方案

### 错误：CONNECT_TIMEOUT

**原因**：无法连接到数据库服务器

**解决方案**：
1. 检查防火墙设置
2. 确认 Supabase 项目未被暂停
3. 使用直接连接字符串（不是 pooler）
4. 检查密码是否正确

### 错误：password authentication failed

**原因**：数据库密码不正确

**解决方案**：
1. 在 Supabase Dashboard 重置数据库密码
2. 更新 `.env.local` 中的密码
3. 确认连接字符串中的密码已正确转义（特殊字符需要 URL 编码）

### 错误：relation does not exist

**原因**：表还未创建

**解决方案**：
1. 先运行 `pnpm db:push` 或 `pnpm db:migrate` 创建表结构
2. 然后再运行 `pnpm db:seed` 导入数据

## 相关文件

- `lib/db/index.ts` - 数据库连接配置
- `lib/db/seed.ts` - 种子脚本
- `lib/db/connection-string.ts` - 连接字符串解析
- `drizzle.config.ts` - Drizzle 配置

