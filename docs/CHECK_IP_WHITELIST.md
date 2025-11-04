# 检查 Supabase IP 白名单设置

## 问题现象

数据库连接一直超时（`CONNECT_TIMEOUT`），即使：
- ✅ 端口 5432 可达
- ✅ 密码已确认正确
- ✅ 连接字符串格式正确

这通常表示 **IP 白名单限制了连接**。

## 检查步骤

### 1. 检查 Network Restrictions

1. 打开 Supabase Dashboard
2. 前往 **Settings** → **Database**
3. 找到 **Network Restrictions** 部分

### 2. 可能的情况

#### 情况 A: 未启用 IP 白名单
- **显示**: "No restrictions" 或 "Allow all IPs"
- **操作**: 无需修改

#### 情况 B: 启用了 IP 白名单
- **显示**: 一个 IP 地址列表
- **操作**: 
  1. 获取你的开发环境公网 IP
  2. 将 IP 添加到白名单
  3. 或者临时禁用 IP 白名单进行测试

### 3. 获取你的公网 IP

在终端运行：

```bash
curl ifconfig.me
```

或者访问：https://ifconfig.me

### 4. 添加 IP 到白名单

在 Supabase Dashboard → Settings → Database → Network Restrictions：

1. 点击 "Add IP" 或 "+" 按钮
2. 输入你的公网 IP
3. 保存更改

### 5. 重新测试

添加 IP 后，等待几秒钟，然后重新运行：

```bash
pnpm db:seed
```

---

## 替代方案：使用 Supabase SQL Editor

如果 IP 白名单无法修改，可以暂时通过 Supabase Dashboard 的 SQL Editor 手动导入数据：

1. 打开 SQL Editor
2. 运行导入 SQL 语句
3. 或者通过 API 导入数据

---

## 请提供的信息

请检查并告诉我：

1. **Settings → Database → Network Restrictions** 的截图
2. 是否启用了 IP 白名单？
3. 你的公网 IP 是什么？（运行 `curl ifconfig.me`）

有了这些信息，我可以帮你精确解决问题。

