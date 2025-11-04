# Supabase 连接调试指南

## 需要从 Supabase Dashboard 获取的信息

### 1. 数据库连接字符串（最重要）

**路径**: `Settings` → `Database` → `Connection string`

请选择 **URI** 标签，复制以下两种连接字符串：

#### A. Transaction Pooler (用于运行时)
- 标签: **Transaction pooler** 或 **Connection pooling**
- 端口: `6543`
- 格式: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-us-west-1.pooler.supabase.com:6543/postgres`

#### B. Direct Connection (用于脚本和迁移)
- 标签: **URI** 或 **Direct connection**
- 端口: `5432`
- 格式: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

**注意**: 
- 请直接复制 Supabase Dashboard 中显示的完整连接字符串
- 如果密码中有特殊字符，确保已正确转义
- 确认项目引用 (project ref) 是否正确：`dfkljhnfbttjkmahsqfo`

### 2. 网络限制设置

**路径**: `Settings` → `Database` → `Network Restrictions` 或 `Settings` → `API` → `Network Restrictions`

请检查：
- [ ] 是否启用了 IP 白名单？
- [ ] 如果启用，你的开发环境 IP 是否在白名单中？
- [ ] 是否有任何防火墙规则？

### 3. 数据库密码

**路径**: `Settings` → `Database`

请检查：
- [ ] 密码最近是否被重置？
- [ ] `.env.local` 中的密码是否与 Dashboard 中显示的一致？

### 4. 连接池配置（可选）

**路径**: `Settings` → `Database` → `Connection pooling`

如果显示：
- **Mode**: Transaction 或 Session
- **Pooler port**: 通常是 `6543`

---

## 当前本地配置

检查你的 `.env.local` 文件：

```bash
# 查看当前配置（密码会被隐藏）
cat .env.local | grep DATABASE | sed 's/:[^:@]*@/:***@/g'
```

### 正确的配置示例

```bash
# 运行时连接（使用 pooler）
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-us-west-1.pooler.supabase.com:6543/postgres"

# 直接连接（用于脚本和迁移）
DIRECT_DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require"

# 或者使用 SUPABASE_MIGRATIONS_URL（优先）
SUPABASE_MIGRATIONS_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require"
```

### 常见错误配置

❌ **错误 1**: 直接连接使用了 pooler 的端口
```
DIRECT_DATABASE_URL="...pooler.supabase.com:6543..."  # 错误！
```

❌ **错误 2**: 缺少 sslmode 参数
```
DIRECT_DATABASE_URL="...5432/postgres"  # 缺少 ?sslmode=require
```

❌ **错误 3**: 用户名格式错误
```
# 直接连接应该使用 postgres.[PROJECT-REF]，不是 postgres
postgresql://postgres:[PASSWORD]@...  # 错误！应该是 postgres.dfkljhnfbttjkmahsqfo
```

---

## 测试连接

提供信息后，我们将：

1. ✅ 验证连接字符串格式
2. ✅ 测试直接连接
3. ✅ 如果仍有问题，检查网络和防火墙
4. ✅ 运行完整的导入测试

---

## 下一步

请提供以下截图：

1. **Database → Connection string → URI 标签**（显示直接连接字符串）
2. **Database → Connection string → Transaction pooler 标签**（显示 pooler 连接字符串）
3. **Database → Network Restrictions**（如果存在）

或者直接复制连接字符串（密码部分可以用 `***` 替代）发送给我。

