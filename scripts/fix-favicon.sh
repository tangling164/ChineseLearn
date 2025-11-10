#!/bin/bash

echo "=================================="
echo "Favicon 诊断和修复脚本"
echo "=================================="
echo ""

# 1. 检查文件是否存在
echo "1. 检查 favicon.ico 文件..."
if [ -f "public/favicon.ico" ]; then
    echo "   ✅ 文件存在"
    ls -lh public/favicon.ico
    file public/favicon.ico
else
    echo "   ❌ 文件不存在！"
    echo "   请确保 public/favicon.ico 存在"
    exit 1
fi

echo ""

# 2. 检查 layout.tsx 配置
echo "2. 检查 layout.tsx 配置..."
if grep -q "icons:" app/layout.tsx; then
    echo "   ✅ 使用 metadata.icons 配置"
    grep -A 10 "icons:" app/layout.tsx
else
    echo "   ⚠️  未找到 metadata.icons 配置"
fi

echo ""

# 3. 清理 Next.js 缓存
echo "3. 清理 Next.js 缓存..."
if [ -d ".next" ]; then
    echo "   删除 .next 目录..."
    rm -rf .next
    echo "   ✅ 缓存已清理"
else
    echo "   ✅ 无缓存需要清理"
fi

echo ""

# 4. 检查 node_modules
echo "4. 检查 node_modules..."
if [ -d "node_modules" ]; then
    echo "   ✅ node_modules 存在"
else
    echo "   ⚠️  node_modules 不存在，请运行 pnpm install"
fi

echo ""

# 5. 重新安装依赖（可选）
read -p "是否要重新安装依赖？(y/n): " reinstall
if [ "$reinstall" = "y" ] || [ "$reinstall" = "Y" ]; then
    echo ""
    echo "重新安装依赖..."
    pnpm install
fi

echo ""

# 6. 重启开发服务器提示
echo "=================================="
echo "接下来的步骤："
echo "=================================="
echo ""
echo "1. 重启开发服务器："
echo "   pkill -f 'next dev' || true"
echo "   pnpm dev"
echo ""
echo "2. 在浏览器中测试："
echo "   - 打开 http://localhost:3000"
echo "   - 按 Ctrl+F5 强制刷新"
echo "   - 检查标签页是否显示新图标"
echo ""
echo "3. 如果仍未显示："
echo "   - 清除浏览器缓存"
echo "   - 尝试隐身模式"
echo "   - 检查浏览器开发者工具 Network 面板"
echo ""
echo "4. 部署后："
echo "   - 可能需要清除 CDN 缓存"
echo "   - 等待 DNS 传播（最多 48 小时）"
echo ""

# 7. 测试 favicon URL
echo "=================================="
echo "直接测试 favicon URL："
echo "=================================="
echo ""
echo "本地开发："
echo "  http://localhost:3000/favicon.ico"
echo ""
echo "生产环境："
echo "  https://chinese101.app/favicon.ico"
echo ""

echo "=================================="
echo "诊断完成！"
echo "=================================="
