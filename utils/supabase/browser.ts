"use client";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or Anonymous Key is missing in environment variables.");
}

// Create and export the browser client
export const createClient = () =>
  createSupabaseClient(supabaseUrl, supabaseAnonKey);
