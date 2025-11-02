# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Type-CN 是一个面向海外中文学习者的分级中文打字学习平台，使用 Next.js + Supabase + Drizzle ORM 构建。

**核心功能**：
- 用户认证（邮箱/密码 + Google One Tap）
- 分级课程学习系统
- 实时打字练习和纠错
- 付费订阅系统（Creem API）
- 学习进度跟踪

## 技术栈

- **框架**: Next.js 15 (App Router) + TypeScript
- **数据库**: Supabase PostgreSQL + Drizzle ORM
- **UI库**: Radix UI + Tailwind CSS + shadcn/ui
- **认证**: Supabase Auth + Google One Tap
- **支付**: Creem API ( webhook 处理)
- **动画**: Framer Motion
- **包管理**: pnpm

## 项目结构

```
/mnt/project/type-cn/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 认证路由组
│   │   ├── sign-in/
│   │   ├── sign-up/
│   │   └── confirm/
│   ├── dashboard/         # 登录后仪表板
│   ├── lesson/           # 课程学习
│   ├── payment/          # 支付处理
│   └── api/              # API 路由
│       ├── auth/         # Supabase 认证回调
│       └── webhooks/     # Creem 支付 webhook
├── components/           # 可复用组件
│   ├── ui/              # shadcn/ui 基础组件
│   ├── dashboard/       # 仪表板组件
│   ├── lesson/          # 课程组件
│   ├── auth-button.tsx
│   ├── login-form.tsx
│   └── sign-up-form.tsx
├── lib/                  # 工具库
│   ├── db/              # 数据库相关
│   │   ├── schema.ts    # Drizzle 表结构
│   │   ├── index.ts     # 数据库实例
│   │   ├── queries.ts   # 数据库查询
│   │   ├── seed.ts      # 数据导入脚本
│   │   └── connection-string.ts
│   ├── supabase/        # Supabase 配置
│   └── utils.ts         # 通用工具
├── drizzle/             # 数据库迁移文件
│   ├── 0000_*.sql      # 迁移 SQL
│   └── meta/           # 迁移元数据
├── docs/               # 项目文档
│   ├── lessons.json    # 课程数据源
│   ├── prd.md          # 产品需求文档
│   ├── IMPORT_LESSONS.md
│   ├── DATABASE_CONNECTION_FIX.md
│   └── creem-*.md      # Creem API 文档
└── scripts/            # 执行脚本
    └── setup-db.ts     # 数据库初始化
```

## 常用命令

### 开发
```bash
pnpm dev              # 启动开发服务器 (Turbopack)
pnpm build            # 构建生产版本
pnpm start            # 启动生产服务器
pnpm lint             # 运行 ESLint
pnpm lint --fix       # 自动修复 lint 问题
```

### 数据库操作
```bash
# 生成迁移文件
pnpm db:generate

# 应用迁移到本地/生产数据库
pnpm db:migrate

# 同步 schema 到 Supabase (开发时)
pnpm db:push

# 打开 Drizzle Studio
pnpm db:studio

# 导入课程数据 (从 docs/lessons.json)
pnpm db:seed
```

## 数据库架构

### 核心表

**用户相关**：
- `profiles` - 用户配置信息
- `user_progress` - 学习进度跟踪

**课程相关**：
- `lessons` - 课程信息
- `lesson_items` - 练习题项

**订阅相关**：
- `user_subscriptions` - 用户订阅状态
- `subscription_events` - 订阅事件日志

### 数据库连接

项目使用双重连接策略：
- **运行时连接**: 使用 Supabase Pooler (`DATABASE_URL`)
  - 格式: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-[REGION].pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true`
- **脚本连接**: 使用直接连接 (`DIRECT_DATABASE_URL` 或 `SUPABASE_MIGRATIONS_URL`)
  - 格式: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require`

详见 `lib/db/connection-string.ts` 和 `docs/DATABASE_CONNECTION_FIX.md`。

## 环境配置

复制 `.env.example` 到 `.env.local` 并配置：

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
DATABASE_URL=              # Supabase Pooler 连接字符串
DIRECT_DATABASE_URL=       # 直接连接 (脚本用)

# Google One Tap
NEXT_PUBLIC_GOOGLE_CLIENT_ID=

# Creem 支付
CREEM_API_KEY=
NEXT_PUBLIC_CREEM_URL=
CREEM_WEBHOOK_SECRET=

# 其他
NEXT_PUBLIC_SITE_URL=
```

## 开发指南

### 编码规范
- 使用 TypeScript，严格类型检查
- 优先使用 Server Components，仅在需要 hooks 时添加 `"use client"`
- 文件命名：kebab-case
- 组件命名：PascalCase
- Hooks 命名：camelCase
- 缩进：2 空格
- 通过 `pnpm lint --fix` 自动格式化

### 组件开发
- 基础 UI 组件在 `components/ui/`
- 功能组件按模块分组：`components/dashboard/`, `components/lesson/`
- 使用 `class-variance-authority` + `tailwind-merge` 处理复杂样式
- 优先使用 shadcn/ui 组件，保持设计一致性

### 数据库变更流程

1. **修改 schema** → `lib/db/schema.ts`
2. **生成迁移文件** → `pnpm db:generate`
3. **审核 SQL** → `drizzle/*.sql`
4. **应用迁移** → `pnpm db:migrate` (生产) 或 `pnpm db:push` (开发)
5. **提交变更** → 包含 SQL 文件 + `drizzle/meta` 文件

**重要**：
- 每次迁移都要生成新的 SQL 文件
- 团队协作时避免同时使用 `db:push`
- 先在测试环境验证再部署到生产

### 添加新课程

1. 编辑 `docs/lessons.json`，添加课程数据：
```json
{
  "lesson_id": "unique_id",
  "title_en": "English Title",
  "title_zh": "中文标题",
  "description_en": "...",
  "tag": "Category",
  "order": 1,
  "items": [
    {
      "item_id": "unique-item-id",
      "type": "word",
      "en": "Hello",
      "zh": "你好",
      "py": "ni3hao3",
      "accepted": ["nihao", "ni hao", "ni3hao3", "ni3 hao3"]
    }
  ]
}
```

2. 导入数据：`pnpm db:seed`

详见 `docs/IMPORT_LESSONS.md`。

### 认证流程

**邮箱认证**：
1. 用户注册 → 发送确认邮件
2. 点击确认链接 → `/auth/confirm?token_hash=xxx&type=signup`
3. 验证 token → 更新用户状态
4. 自动登录并重定向到仪表板

**Supabase 配置**：
- 需在 Supabase Dashboard 配置确认邮件模板和重定向 URL
- 详见 `SUPABASE_SETUP.md`

### 支付集成

使用 Creem API 处理订阅：
- API 配置：`CREEM_API_KEY`, `CREEM_WEBHOOK_SECRET`, `NEXT_PUBLIC_CREEM_URL`
- Webhook 端点：`app/api/webhooks/creem/route.ts`
- 处理订阅事件并更新 `user_subscriptions` 表
- 详见 `docs/creem-*.md`

## 关键文件

### 认证
- `components/login-form.tsx` - 登录表单 + Google One Tap
- `components/sign-up-form.tsx` - 注册表单
- `app/api/auth/confirm/route.ts` - 邮箱确认处理
- `middleware.ts` - 路由保护

### 课程学习
- `app/lesson/[lessonId]/page.tsx` - 课程页面
- `components/lesson/` - 课程相关组件
- `lib/db/queries.ts` - 课程数据查询

### 支付
- `app/payment/page.tsx` - 订阅页面
- `app/api/webhooks/creem/route.ts` - 支付 webhook
- `components/membership/` - 会员相关组件

### 数据库
- `lib/db/schema.ts` - 表结构定义
- `lib/db/index.ts` - 数据库实例
- `lib/db/queries.ts` - 业务查询
- `lib/db/seed.ts` - 数据导入脚本

## 部署

### Vercel 部署
1. 连接 GitHub 仓库到 Vercel
2. 配置环境变量 (在 Vercel Dashboard)
3. 自动部署 (基于 main 分支)

### Supabase 配置
1. 创建 Supabase 项目
2. 获取 API keys 和数据库连接字符串
3. 配置认证设置（重定向 URL、邮件模板）
4. 设置 Row Level Security (RLS) 策略

## 重要提醒

### 环境变量安全
- 🔒 服务端密钥 (Supabase service key, Creem secret) **仅**存储在 Vercel/Supabase Dashboard
- 🔒 数据库密码 **不**提交到 Git
- ✅ 使用 `.env.local` (已在 `.gitignore`)

### 数据库连接
- 开发时使用 `pnpm db:push` 快速同步
- 生产环境使用 `pnpm db:migrate`
- 种子脚本使用直接连接，避免超时

### 测试流程
当前没有自动化测试，提交前手动测试：
1. 认证流程 (注册/登录/确认)
2. 课程学习功能
3. 仪表板数据
4. 支付流程 (如适用)
5. `pnpm lint` 通过

### 团队协作
- 小提交 + 清晰信息
- 列出 schema 变更、env 变量变更
- 避免同时使用 `db:push`
- 通过 Slack 协调数据库操作

## 相关文档

- `README.md` - 项目基础信息
- `SUPABASE_SETUP.md` - Supabase 配置指南
- `docs/prd.md` - 产品需求文档
- `docs/IMPORT_LESSONS.md` - 课程数据导入
- `docs/DATABASE_CONNECTION_FIX.md` - 数据库连接问题修复
- `docs/creem-*.md` - Creem API 集成文档
