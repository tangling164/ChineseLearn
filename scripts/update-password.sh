#!/bin/bash
# 更新数据库密码的辅助脚本

echo "请按照以下步骤操作："
echo ""
echo "1. 访问 Supabase Dashboard → Settings → Database"
echo "2. 点击 'Reset database password'"
echo "3. 复制新生成的密码"
echo ""
read -p "请输入新的数据库密码: " NEW_PASSWORD
echo ""

# 更新 DIRECT_DATABASE_URL
sed -i "s|postgresql://postgres:[^@]*@db\.dfkljhnfbttjkmahsqfo|postgresql://postgres:${NEW_PASSWORD}@db.dfkljhnfbttjkmahsqfo|g" .env.local

# 更新 DATABASE_URL
sed -i "s|postgresql://postgres\.dfkljhnfbttjkmahsqfo:[^@]*@aws-1-us-west-1|postgresql://postgres.dfkljhnfbttjkmahsqfo:${NEW_PASSWORD}@aws-1-us-west-1|g" .env.local

echo "✅ 已更新 .env.local 中的密码"
echo ""
echo "现在可以运行: pnpm db:seed"

