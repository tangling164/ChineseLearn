import postgres from 'postgres';
import { config as loadEnv } from 'dotenv';

loadEnv({ path: '.env' });
loadEnv({ path: '.env.local', override: true });

async function testConnection() {
  console.log('📊 测试数据库连接...\n');

  const directUrl = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;
  
  if (!directUrl) {
    console.error('❌ 未找到 DATABASE_URL 或 DIRECT_DATABASE_URL');
    process.exit(1);
  }

  console.log('连接信息:');
  console.log('  - URL:', directUrl.replace(/:[^:@]+@/, ':***@').substring(0, 80) + '...');
  
  try {
    console.log('\n⏳ 尝试连接数据库...');
    
    const sql = postgres(directUrl, {
      connect_timeout: 10,
      max: 1,
      idle_timeout: 5,
      debug: true, // 启用调试输出
    });

    console.log('✅ 客户端创建成功，尝试执行查询...');
    
    const result = await sql`SELECT current_database(), current_user, version()`;
    
    console.log('\n✅ 连接成功！');
    console.log('数据库信息:');
    console.log('  - 数据库:', result[0].current_database);
    console.log('  - 用户:', result[0].current_user);
    console.log('  - 版本:', result[0].version.substring(0, 50) + '...');
    
    // 检查表是否存在
    console.log('\n📋 检查表...');
    const tables = await sql`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename
    `;
    
    console.log(`找到 ${tables.length} 个表:`);
    tables.forEach((t: any) => console.log(`  - ${t.tablename}`));
    
    await sql.end();
    console.log('\n✅ 测试完成，连接已关闭');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ 连接失败！');
    console.error('错误:', error);
    
    if (error instanceof Error) {
      console.error('错误消息:', error.message);
      console.error('错误堆栈:', error.stack);
    }
    
    console.log('\n🔍 可能的原因:');
    console.log('  1. Supabase 项目被暂停（免费层不活跃会自动暂停）');
    console.log('  2. 数据库密码不正确');
    console.log('  3. IP 地址被限制（检查 Supabase 项目设置）');
    console.log('  4. 网络防火墙阻止了连接');
    console.log('\n💡 解决方案:');
    console.log('  - 访问 Supabase Dashboard 查看项目状态');
    console.log('  - 在 Settings → Database 重置密码并更新 .env.local');
    console.log('  - 检查 Settings → API → Network restrictions');
    
    process.exit(1);
  }
}

testConnection();

