import { createClient } from "@supabase/supabase-js";

const envSupabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

if (!envSupabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase URL or Anon Key is missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file"
  );
}

// If the URL is relative (starts with /), prepend the window origin to make it absolute
// This is required because supabase-js expects a valid HTTP/HTTPS URL
const supabaseUrl =
  envSupabaseUrl.startsWith("/") && typeof window !== "undefined"
    ? `${window.location.origin}${envSupabaseUrl}`
    : envSupabaseUrl;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
