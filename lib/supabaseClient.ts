import { createClient } from '@supabase/supabase-js';

// Hardcoding your correct project URL directly
const supabaseUrl = 'https://fifhlfacbgqoaydqzked.supabase.co';
// Paste your actual anon key from your Supabase dashboard between these quotes
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZmhsZmFjYmdxb2F5ZHF6a2VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyOTA2NDYsImV4cCI6MjA5Njg2NjY0Nn0.B3nUTutVf7DZVACREeZMdFL8CH7otWDoGHX-s7y0ZWw'; 

export const supabase = createClient(supabaseUrl, supabaseKey);
