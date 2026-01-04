type EnvShape = {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
};

const required = ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"] as const;

const env = import.meta.env as EnvShape;

required.forEach((key) => {
  if (!env[key]) {
    // eslint-disable-next-line no-console
    console.warn(`[env] Missing environment variable: ${key}`);
  }
});

export const SUPABASE_URL = env.VITE_SUPABASE_URL || "";
export const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || "";
