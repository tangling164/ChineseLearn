const SUPABASE_HOST_PATTERNS = ["supabase.co", "supabase.net", "supabase.com"];
const SUPABASE_POOLER_FRAGMENT = ".pooler.supabase";

const TRUE_PATTERN = /^(1|true|yes|on)$/i;

type Target = "runtime" | "migrations";

export type DatabaseConnectionConfig = {
  connectionString: string;
  usesSupabasePooler: boolean;
};

const sanitize = (value: string) => value.trim().replace(/^['"]+|['"]+$/g, "");

const isSupabaseHost = (host: string) =>
  SUPABASE_HOST_PATTERNS.some((pattern) => host.includes(pattern));

const isSupabasePoolerHost = (host: string) => host.includes(SUPABASE_POOLER_FRAGMENT);

const isTrue = (value: string | undefined) => TRUE_PATTERN.test(value ?? "");

const ensureSupabaseParams = (url: URL, includePgBouncer: boolean) => {
  if (!isSupabaseHost(url.hostname)) return url;

  if (!url.searchParams.has("sslmode")) {
    url.searchParams.set("sslmode", "require");
  }

  if (includePgBouncer) {
    url.searchParams.set("pgbouncer", "true");
  } else {
    url.searchParams.delete("pgbouncer");
  }

  return url;
};

const extractProjectRef = (url: URL): string | null => {
  const decodedUser = decodeURIComponent(url.username || "");
  const userParts = decodedUser.split(".");

  if (userParts.length > 1) {
    return userParts.slice(1).join(".");
  }

  const candidates = [
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_URL,
    process.env.SUPABASE_PROJECT_REF,
  ].filter(Boolean) as string[];

  for (const candidate of candidates) {
    try {
      if (candidate.startsWith("http")) {
        const host = new URL(candidate).hostname;
        const [ref] = host.split(".");
        if (ref) return ref;
      } else if (/^[a-z0-9]{15,}$/i.test(candidate)) {
        return candidate;
      }
    } catch {
      // ignore invalid URLs
    }
  }

  return null;
};

const deriveSupabaseDirectUrl = (pooledUrl: URL): URL | null => {
  const projectRef = extractProjectRef(pooledUrl);

  if (!projectRef) return null;

  const direct = new URL(pooledUrl.toString());
  direct.username = "postgres";
  direct.hostname = `db.${projectRef}.supabase.co`;
  direct.port = "5432";

  ensureSupabaseParams(direct, false);

  return direct;
};

const createUrl = (raw: string): URL => {
  try {
    return new URL(sanitize(raw));
  } catch {
    throw new Error("DATABASE_URL is invalid. Paste the Supabase > Connect > ORM > Drizzle string into .env");
  }
};

export const resolveDatabaseConnection = (target: Target = "runtime"): DatabaseConnectionConfig => {
  const raw = process.env.DATABASE_URL;

  if (!raw) {
    throw new Error("DATABASE_URL is missing. Add the Supabase connection string to your .env file.");
  }

  const pooledUrl = createUrl(raw);
  const usesPooler = isSupabasePoolerHost(pooledUrl.hostname);

  const runtimeUrl = ensureSupabaseParams(new URL(pooledUrl.toString()), usesPooler);

  if (target === "runtime") {
    return {
      connectionString: runtimeUrl.toString(),
      usesSupabasePooler: usesPooler,
    };
  }

  const overrideRaw =
    process.env.SUPABASE_MIGRATIONS_URL ??
    process.env.DIRECT_DATABASE_URL ??
    process.env.DRIZZLE_MIGRATIONS_URL;

  if (target === "migrations" && overrideRaw) {
    const overrideUrl = createUrl(overrideRaw);
    const overrideUsesPooler = isSupabasePoolerHost(overrideUrl.hostname);
    const finalOverrideUrl = ensureSupabaseParams(
      new URL(overrideUrl.toString()),
      overrideUsesPooler,
    );

    return {
      connectionString: finalOverrideUrl.toString(),
      usesSupabasePooler: overrideUsesPooler,
    };
  }

  const shouldReusePoolerForMigrations = isTrue(process.env.SUPABASE_MIGRATIONS_USE_POOLER);

  if (target === "migrations" && shouldReusePoolerForMigrations) {
    return {
      connectionString: runtimeUrl.toString(),
      usesSupabasePooler: usesPooler,
    };
  }

  if (target === "migrations" && usesPooler) {
    const directUrl = deriveSupabaseDirectUrl(pooledUrl);

    if (directUrl) {
      return {
        connectionString: directUrl.toString(),
        usesSupabasePooler: false,
      };
    }
  }

  // Fallback: reuse runtime URL (works for self-hosted Postgres or when project ref cannot be derived)
  const targetUrl = ensureSupabaseParams(new URL(pooledUrl.toString()), usesPooler);

  return {
    connectionString: targetUrl.toString(),
    usesSupabasePooler: usesPooler,
  };
};
