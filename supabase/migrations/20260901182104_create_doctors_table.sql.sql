/*
# Create doctors table for medical staff authentication

1. New Tables
- `doctors`
  - `id` (uuid, primary key)
  - `email` (text, unique, not null) — doctor's login email
  - `password_hash` (text, not null) — bcrypt-hashed password
  - `name` (text, not null) — doctor's display name
  - `created_at` (timestamp with time zone, default now())

2. Security
- Enable RLS on `doctors`.
- Allow anon + authenticated CRUD.

3. Important Notes
- This table stores doctor credentials for the FastAPI JWT auth flow.
- A default doctor account will be seeded by the FastAPI backend on startup.
*/

CREATE TABLE IF NOT EXISTS doctors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_doctors" ON doctors;
CREATE POLICY "select_doctors" ON doctors FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_doctors" ON doctors;
CREATE POLICY "insert_doctors" ON doctors
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_doctors" ON doctors;
CREATE POLICY "update_doctors" ON doctors FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_doctors" ON doctors;
CREATE POLICY "delete_doctors" ON doctors FOR DELETE
  TO anon, authenticated USING (true);
