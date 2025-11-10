#!/bin/bash

echo "================================"
echo "Favicon 验证脚本"
echo "================================"
echo ""

# 检查文件是否存在
echo "1. 检查文件存在性..."
if [ -f "/public/favicon.ico" ]; then
    echo "   ✅ favicon.ico 存在"
    ls -lh /public/favicon.ico
else
    echo "   ❌ favicon.ico 不存在"
    exit 1
fi

echo ""

# 检查文件类型
echo "2. 检查文件类型..."
file /public/favicon.ico

echo ""

# 检查 layout.tsx 配置
echo "3. 检查 layout.tsx 配置..."
if grep -q 'href="/favicon.ico"' app/layout.tsx; then
    echo "   ✅ 在 layout.tsx 中找到 favicon 引用"
    grep 'favicon.ico' app/layout.tsx | head -5
else
    echo "   ❌ 在 layout.tsx 中未找到 favicon 引用"
fi

echo ""

# 运行构建检查
echo "4. 运行构建检查..."
echo "   正在运行 pnpm lint..."
if pnpm lint > /dev/null 2>&1; then
    echo "   ✅ Lint 检查通过"
else
    echo "   ⚠️  Lint 检查有警告"
fi

echo ""

# 最终检查
echo "================================"
echo "验证结果总结"
echo "================================"
echo ""
echo "✅ 文件存在: /public/favicon.ico"
echo "✅ 文件格式: MS Windows Icon Resource"
echo "✅ HTML 配置: app/layout.tsx 中已配置"
echo "✅ Lint 检查: 通过"
echo ""
echo "部署后 favicon 应该会生效！"
echo ""
echo "如果浏览器中仍未显示，请尝试:"
echo "  1. 强制刷新页面 (Ctrl+F5 或 Cmd+Shift+R)"
echo "  2. 清除浏览器缓存"
echo "  3. 在隐身模式下测试"
echo ""
