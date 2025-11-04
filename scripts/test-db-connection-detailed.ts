import postgres from 'postgres';
import { config as loadEnv } from 'dotenv';

loadEnv({ path: '.env' });
loadEnv({ path: '.env.local', override: true });

async function testConnection() {
  console.log('='.repeat(70));
  console.log('📊 详细数据库连接测试\n');
  console.log('='.repeat(70));

  // 检查环境变量
  console.log('\n🔍 环境变量检查:');
  console.log('  - DATABASE_URL 存在:', !!process.env.DATABASE_URL);
  console.log('  - DIRECT_DATABASE_URL 存在:', !!process.env.DIRECT_DATABASE_URL);
  console.log('  - SUPABASE_MIGRATIONS_URL 存在:', !!process.env.SUPABASE_MIGRATIONS_URL);
  
  const directUrl = process.env.SUPABASE_MIGRATIONS_URL || 
                    process.env.DIRECT_DATABASE_URL || 
                    process.env.DATABASE_URL;
  
  if (!directUrl) {
    console.error('\n❌ 未找到任何数据库连接 URL');
    process.exit(1);
  }

  // 解析连接字符串（隐藏密码）
  try {
    const url = new URL(directUrl);
    console.log('\n📋 连接字符串解析:');
    console.log('  - 协议:', url.protocol);
    console.log('  - 用户名:', url.username);
    console.log('  - 主机名:', url.hostname);
    console.log('  - 端口:', url.port);
    console.log('  - 数据库:', url.pathname);
    console.log('  - SSL 模式:', url.searchParams.get('sslmode') || '未设置');
    console.log('  - PgBouncer:', url.searchParams.get('pgbouncer') || '未设置');
  } catch (e) {
    console.error('  ❌ 无法解析 URL:', e);
  }
  
  console.log('\n⏳ 尝试创建 PostgreSQL 客户端...');
  
  let sql: postgres.Sql;
  try {
    sql = postgres(directUrl, {
      connect_timeout: 10,
      max: 1,
      idle_timeout: 5,
      debug: (connection, query, parameters) => {
        console.log('\n🔧 PostgreSQL 客户端调试信息:');
        console.log('  - 连接 ID:', connection);
        console.log('  - 查询:', query);
        if (parameters && parameters.length > 0) {
          console.log('  - 参数:', parameters.map((p: any) => 
            typeof p === 'string' && p.length > 50 ? p.substring(0, 50) + '...' : p
          ));
        }
      },
      onnotice: (notice) => {
        console.log('📢 PostgreSQL 通知:', notice);
      },
    });
    
    console.log('✅ PostgreSQL 客户端创建成功');
    
    console.log('\n⏳ 尝试执行测试查询...');
    console.log('查询: SELECT current_database(), current_user, version()');
    
    const startTime = Date.now();
    const result = await sql`SELECT current_database(), current_user, version()`;
    const duration = Date.now() - startTime;
    
    console.log('\n✅ 查询成功！');
    console.log('  - 执行时间:', duration + 'ms');
    console.log('\n📊 数据库信息:');
    console.log('  - 数据库名:', result[0].current_database);
    console.log('  - 用户名:', result[0].current_user);
    console.log('  - PostgreSQL 版本:', result[0].version.substring(0, 80) + '...');
    
    // 检查表
    console.log('\n📋 检查现有表...');
    const tables = await sql`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename
    `;
    
    if (tables.length === 0) {
      console.log('  ⚠️  未找到任何表（这是正常的，如果还没有创建表结构）');
    } else {
      console.log(`  ✅ 找到 ${tables.length} 个表:`);
      tables.forEach((t: any) => console.log(`     - ${t.tablename}`));
    }
    
    await sql.end();
    console.log('\n✅ 测试完成，连接已关闭');
    console.log('\n' + '='.repeat(70));
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ 连接失败！');
    console.error('\n' + '='.repeat(70));
    
    if (error instanceof Error) {
      console.error('错误类型:', error.constructor.name);
      console.error('错误消息:', error.message);
      
      if ('code' in error) {
        console.error('错误代码:', (error as any).code);
      }
      
      if ('errno' in error) {
        console.error('系统错误号:', (error as any).errno);
      }
      
      console.error('\n完整错误堆栈:');
      console.error(error.stack);
    } else {
      console.error('未知错误:', error);
    }
    
    console.error('\n' + '='.repeat(70));
    console.log('\n🔍 诊断建议:');
    console.log('  1. 确认 Supabase Dashboard → Settings → Database 中的连接字符串');
    console.log('  2. 检查密码是否正确（可能需要重置）');
    console.log('  3. 检查 Settings → Database → Network Restrictions 是否启用了 IP 白名单');
    console.log('  4. 如果使用 VPN 或代理，尝试断开后重试');
    console.log('  5. 检查防火墙设置');
    
    process.exit(1);
  }
}

testConnection();

