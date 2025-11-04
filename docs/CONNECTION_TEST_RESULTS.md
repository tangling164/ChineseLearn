# 数据库连接测试结果

## 测试时间
2024年 - 测试数据库密码 `bak18774902382`

## 测试结果

### ✅ 配置状态
- ✅ `DATABASE_URL` 已更新为新密码
- ✅ `DIRECT_DATABASE_URL` 已更新为新密码
- ✅ 连接字符串格式正确

### ❌ 连接测试结果

#### 测试 1: Pooler 连接（端口 6543）
- **状态**: ❌ 连接超时
- **错误**: `CONNECT_TIMEOUT`
- **结论**: 无法建立连接

#### 测试 2: 直接连接（端口 5432）
- **状态**: ❌ 连接超时
- **错误**: `CONNECT_TIMEOUT`
- **结论**: 无法建立连接

## 问题分析

两个连接都超时，这表明问题不在密码（密码错误会立即返回认证失败），而是在**网络层面**。

### 可能的原因

1. **IP 白名单限制**（最可能）
   - Supabase 项目可能启用了 IP 白名单
   - 当前开发环境的公网 IP 不在白名单中

2. **WSL2 网络问题**
   - WSL2 的网络配置可能导致连接问题
   - 虚拟网络适配器可能阻止了某些连接

3. **防火墙/安全组**
   - 系统防火墙阻止了出站连接
   - 或 Supabase 的安全组限制了某些 IP 段

## 解决方案

### 方案 1: 检查并配置 IP 白名单（推荐）

1. **获取当前公网 IP**
   ```bash
   curl ifconfig.me
   ```
   或访问：https://ifconfig.me

2. **在 Supabase Dashboard 中添加 IP**
   - 前往 `Settings` → `Database`
   - 找到 `Network Restrictions` 部分
   - 如果启用，添加你的公网 IP
   - 或暂时禁用 IP 白名单进行测试

3. **重新测试**
   ```bash
   pnpm exec tsx scripts/test-db-connection-detailed.ts
   ```

### 方案 2: 检查 Supabase Network Restrictions 设置

请检查 Supabase Dashboard → Settings → Database → Network Restrictions：

- [ ] 是否显示了 "No restrictions" 或 "Allow all IPs"？
- [ ] 是否有 IP 白名单列表？
- [ ] 如果有列表，你的 IP 是否在其中？

### 方案 3: 使用 Supabase SQL Editor 导入数据（临时方案）

如果网络连接无法解决，可以：

1. 打开 Supabase Dashboard → SQL Editor
2. 手动执行 SQL 导入课程数据
3. 或通过 Supabase API 导入

### 方案 4: 检查 WSL2 网络配置

如果在 WSL2 中，尝试：

```bash
# 检查 WSL2 IP
hostname -I

# 尝试从 Windows 主机测试连接（如果可能）
```

## 下一步行动

### 立即行动
1. ✅ **检查 Supabase Network Restrictions**
   - 截图 Settings → Database → Network Restrictions
   - 确认是否启用了 IP 白名单

2. ✅ **获取公网 IP**
   - 运行 `curl ifconfig.me`
   - 记录显示的 IP 地址

3. ✅ **添加 IP 到白名单**（如果启用）
   - 在 Supabase Dashboard 中添加你的公网 IP
   - 保存后等待几秒钟

4. ✅ **重新测试连接**
   ```bash
   # 测试直接连接
   timeout 25 pnpm exec tsx scripts/test-db-connection-detailed.ts
   
   # 如果成功，导入数据
   pnpm db:seed
   ```

### 如果仍然失败

提供以下信息以便进一步诊断：
1. Supabase Network Restrictions 设置的截图
2. 你的公网 IP 地址
3. 是否使用了 VPN 或代理？
4. 运行环境（WSL2、本地 Linux、虚拟机等）

## 相关文件

- `scripts/test-db-connection-detailed.ts` - 详细连接测试脚本
- `scripts/test-pooler-connection.ts` - Pooler 连接测试脚本
- `.env.local` - 数据库连接配置

