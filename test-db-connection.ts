import postgres from 'postgres';
import { config as loadEnv } from 'dotenv';
import { resolveDatabaseConnection } from './lib/db/connection-string';
import { promises as dns } from 'node:dns';
import net from 'node:net';

type Target = 'runtime' | 'migrations';

type ConnectionInfo = {
  target: Target;
  connectionString: string;
  host: string;
  port: number;
  params: string;
};

loadEnv({ path: '.env' });
loadEnv({ path: '.env.local', override: true });

const targets: Target[] = ['migrations', 'runtime'];

const hostPorts = new Map<string, Set<number>>();

function printHeader(title: string) {
  console.log(`\n=== ${title} ===`);
}

function printDivider() {
  console.log('------------------------------');
}

function registerHostPort(host: string, port: number) {
  if (!hostPorts.has(host)) {
    hostPorts.set(host, new Set());
  }
  hostPorts.get(host)!.add(port);
}

function parseConnection(target: Target): ConnectionInfo | null {
  try {
    const { connectionString } = resolveDatabaseConnection(target);
    const url = new URL(connectionString);
    const port = url.port ? Number(url.port) : 5432;
    const params = url.searchParams.toString();

    registerHostPort(url.hostname, port);

    return {
      target,
      connectionString,
      host: url.hostname,
      port,
      params,
    };
  } catch (error) {
    console.error(`Failed to resolve connection for "${target}":`, error);
    return null;
  }
}

async function testPostgresConnection(info: ConnectionInfo) {
  printDivider();
  console.log(`Target: ${info.target}`);
  console.log(`Host: ${info.host}`);
  console.log(`Port: ${info.port}`);
  console.log(`Params: ${info.params || '(none)'}`);

  const sql = postgres(info.connectionString, {
    max: 1,
    connect_timeout: 10,
  });

  try {
    const [{ version }] = await sql`SELECT version()`;
    console.log('✅ PostgreSQL connection successful');
    console.log(`Version: ${version.substring(0, 60)}...`);
  } catch (error) {
    const err = error as { message?: string; code?: string };
    console.error('❌ PostgreSQL connection failed');
    console.error('Message:', err?.message ?? error);
    console.error('Code:', err?.code ?? 'n/a');
  } finally {
    try {
      await sql.end({ timeout: 2 });
    } catch {
      // ignore shutdown errors
    }
  }
}

async function testDns(host: string) {
  printDivider();
  console.log(`DNS lookup for ${host}`);
  try {
    const result = await dns.lookup(host, { all: true });
    console.log('✅ DNS resolved addresses:', result.map((entry) => `${entry.address} (IPv${entry.family})`).join(', '));
  } catch (error) {
    const err = error as { message?: string; code?: string };
    console.error('❌ DNS lookup failed');
    console.error('Message:', err?.message ?? error);
    console.error('Code:', err?.code ?? 'n/a');
  }
}

async function testTcp(host: string, port: number) {
  printDivider();
  console.log(`TCP connect test ${host}:${port}`);

  await new Promise<void>((resolve) => {
    const start = Date.now();
    const socket = net.connect({ host, port, timeout: 10000 });

    socket.on('connect', () => {
      console.log(`✅ TCP connection established in ${Date.now() - start} ms`);
      socket.end();
      resolve();
    });

    socket.on('timeout', () => {
      console.error(`❌ TCP connection timed out after ${Date.now() - start} ms`);
      socket.destroy();
      resolve();
    });

    socket.on('error', (error) => {
      const err = error as { message?: string; code?: string };
      console.error('❌ TCP connection error');
      console.error('Message:', err?.message ?? error);
      console.error('Code:', err?.code ?? 'n/a');
      resolve();
    });
  });
}

async function main() {
  const connections = targets
    .map(parseConnection)
    .filter((value): value is ConnectionInfo => value !== null);

  printHeader('PostgreSQL connection tests');
  for (const info of connections) {
    // eslint-disable-next-line no-await-in-loop
    await testPostgresConnection(info);
  }

  printHeader('DNS resolution tests');
  for (const host of hostPorts.keys()) {
    // eslint-disable-next-line no-await-in-loop
    await testDns(host);
  }

  printHeader('TCP connectivity tests');
  for (const [host, ports] of hostPorts.entries()) {
    for (const port of ports) {
      // eslint-disable-next-line no-await-in-loop
      await testTcp(host, port);
    }
  }

  console.log('\nAll tests completed.');
}

void main();
