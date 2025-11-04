# 如何从 Supabase Dashboard 获取正确的连接字符串

## 步骤 1: 打开数据库设置

1. 访问 Supabase Dashboard
2. 选择你的项目 "ChineseLearn"
3. 点击左侧菜单的 **Settings** (设置)
4. 点击 **Database** (数据库)

## 步骤 2: 找到连接字符串

在 Database 设置页面，找到 **Connection string** 部分。

你会看到多个标签页：

### A. URI (直接连接) - 这是我们需要的

**标签**: 通常显示为 **"URI"** 或 **"Connection string"**

**格式示例**:
```
postgresql://postgres:[YOUR-PASSWORD]@db.dfkljhnfbttjkmahsqfo.supabase.co:5432/postgres
```

**重要**：
- ✅ 用户名应该是 `postgres`（不带项目引用后缀）
- ✅ 主机名是 `db.[PROJECT-REF].supabase.co`
- ✅ 端口是 `5432`
- ✅ 需要添加 `?sslmode=require` 参数

**完整格式应该是**：
```
postgresql://postgres:[PASSWORD]@db.dfkljhnfbttjkmahsqfo.supabase.co:5432/postgres?sslmode=require
```

### B. Transaction pooler - 用于运行时

**标签**: **"Transaction pooler"** 或 **"Connection pooling"**

这个用于应用运行时，端口是 `6543`，用户名是 `postgres.[PROJECT-REF]`

## 步骤 3: 重置密码（如果密码不确定）

1. 在同一页面（Settings → Database）
2. 找到 **Database password** 部分
3. 点击 **Reset database password**
4. 复制新生成的密码
5. **立即更新 `.env.local` 文件**，因为密码只显示一次

## 步骤 4: 检查网络限制

在 Settings → Database 页面，查找：

- **Network Restrictions** 或 **IP Whitelist**
- 如果启用了 IP 白名单：
  - 需要添加你的开发环境 IP 地址
  - 或者暂时禁用 IP 白名单进行测试

## 步骤 5: 复制连接字符串

1. 在 URI 标签页，找到完整的连接字符串
2. 点击复制按钮（或手动复制）
3. 确保包含完整的连接字符串，格式如下：

```
postgresql://postgres:[PASSWORD]@db.dfkljhnfbttjkmahsqfo.supabase.co:5432/postgres?sslmode=require
```

## 步骤 6: 更新 .env.local

将复制的连接字符串（替换密码部分）粘贴到 `.env.local`：

```bash
DIRECT_DATABASE_URL="postgresql://postgres:[你的实际密码]@db.dfkljhnfbttjkmahsqfo.supabase.co:5432/postgres?sslmode=require"
```

**注意**：请确保：
- 密码完全匹配（包括特殊字符）
- 如果密码中有特殊字符（如 `@`, `#`, `&` 等），需要进行 URL 编码

## 密码中的特殊字符

如果密码包含特殊字符，需要进行 URL 编码：

- `@` → `%40`
- `#` → `%23`
- `&` → `%26`
- `%` → `%25`
- `:` → `%3A`
- `/` → `%2F`
- `?` → `%3F`

或者：最简单的方法是在 Supabase Dashboard 中重置密码，生成一个只包含字母和数字的密码。

---

## 请提供的信息

请提供以下截图或信息：

1. **Settings → Database → Connection string → URI 标签**的完整截图
2. **Settings → Database → Network Restrictions**（如果存在）的截图
3. 或者直接告诉我：
   - 连接字符串中显示的完整用户名（是否真的是 `postgres`？）
   - 是否重置了密码？

有了这些信息，我可以帮你精确修复连接问题。

