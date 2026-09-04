-- Add a plain-text demo password column for client-side auth
-- (This is a demo app; real apps should use Supabase Auth)
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS password TEXT;

-- Set the demo password for the existing doctor
UPDATE doctors SET password = 'doctor123' WHERE email = 'doctor@bookmed.com';
