import { createClient } from "@supabase/supabase-js";
import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../database.types";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase credentials in environment variables");
}

const supabase: SupabaseClient = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
);

export default supabase;
