import { createClient } from '@supabase/supabase-js';

// Hardcoding your correct project URL directly
const supabaseUrl = 'https://fifhlfacbgqoaydqzked.supabase.co';
// Paste your actual anon key from your Supabase dashboard between these quotes
const supabaseKey = 'YOUR_ACTUAL_ANON_PUBLIC_KEY_HERE'; 

export const supabase = createClient(supabaseUrl, supabaseKey);
