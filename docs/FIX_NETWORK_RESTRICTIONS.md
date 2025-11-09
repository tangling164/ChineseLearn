# 修复 Network Restrictions 配置

## 问题确认

从截图看到 Network Restrictions 显示警告：
> "Your network restrictions were not applied correctly. Please try to add your network restrictions again."

这导致了数据库连接超时问题。

## 解决方案

### 步骤 1: 点击 "Allow all access" 按钮

1. 在 Supabase Dashboard → Settings → Database → Network Restrictions 页面
2. **点击绿色的 "Allow all access" 按钮**
3. 确认设置已保存（页面应该刷新或显示成功消息）

### 步骤 2: 验证设置

确认 Network Restrictions 部分显示：
- ✅ "Allow all access" 或
- ✅ "No restrictions" 或
- ✅ 不再显示警告消息

### 步骤 3: 等待配置生效

Supabase 配置更改可能需要 **30-60 秒**才能生效。

### 步骤 4: 重新测试连接

等待 30-60 秒后，运行：

```bash
timeout 30 pnpm exec tsx scripts/test-db-connection-detailed.ts
```

### 步骤 5: 如果测试成功，导入数据

```bash
pnpm db:seed
```

---

## 重要提示

- ⚠️ **"Allow all access"** 允许任何 IP 访问数据库，适合开发环境
- 🔒 生产环境建议使用 IP 白名单限制访问
- ⏱️ 配置更改可能需要几分钟才能生效

---

## 如果仍然失败

如果点击 "Allow all access" 后等待 1-2 分钟仍然超时，请：

1. 刷新 Supabase Dashboard 页面，确认设置已保存
2. 检查是否还有其他网络限制设置
3. 尝试使用 Supabase SQL Editor 验证数据库是否可访问
4. 提供新的截图显示 Network Restrictions 的当前状态




