import { createClient } from "@supabase/supabase-js";
import pg from "pg";

const { Pool } = pg;

export function createSupabaseAdminClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

function shouldUseSsl(connectionString) {
  if (String(process.env.DB_SSL || "").toLowerCase() === "false") return false;
  if (String(process.env.DB_SSL || "").toLowerCase() === "true") return true;
  return process.env.NODE_ENV === "production" || /supabase\.(co|com)|pooler\.supabase\.com/i.test(String(connectionString || ""));
}

const connectionString = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing database connection string. Set SUPABASE_DATABASE_URL or DATABASE_URL.");
}

export const pool = new Pool({
  connectionString,
  max: Number(process.env.DATABASE_POOL_MAX || 5),
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 5000,
  ssl: shouldUseSsl(connectionString) ? { rejectUnauthorized: false } : undefined,
});

export async function query(text, params) {
  return pool.query(text, params);
}
