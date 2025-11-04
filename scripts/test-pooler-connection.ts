import postgres from 'postgres';
import { config as loadEnv } from 'dotenv';

loadEnv({ path: '.env' });
loadEnv({ path: '.env.local', override: true });

async function testPoolerConnection() {
  console.log('测试 Pooler 连接（验证密码是否正确）...\n');
  
  const poolerUrl = process.env.DATABASE_URL;
  
  if (!poolerUrl) {
    console.error('❌ 未找到 DATABASE_URL');
    process.exit(1);
  }
  
  try {
    console.log('⏳ 尝试连接 Pooler (端口 6543)...');
    const sql = postgres(poolerUrl, {
      connect_timeout: 10,
      max: 1,
    });
    
    const result = await sql`SELECT current_database(), current_user`;
    
    console.log('✅ Pooler 连接成功！');
    console.log('  - 数据库:', result[0].current_database);
    console.log('  - 用户:', result[0].current_user);
    console.log('\n✅ 密码验证通过！');
    
    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Pooler 连接失败');
    if (error instanceof Error) {
      console.error('错误:', error.message);
      if (error.message.includes('password')) {
        console.error('\n⚠️  密码可能不正确！');
      }
    }
    process.exit(1);
  }
}

testPoolerConnection();

