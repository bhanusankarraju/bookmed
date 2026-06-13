CREATE TABLE appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  department TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Confirmed',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_appointments" ON appointments FOR SELECT
  TO anon, authenticated USING (true);

CREATE POLICY "insert_appointments" ON appointments FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE POLICY "update_appointments" ON appointments FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "delete_appointments" ON appointments FOR DELETE
  TO anon, authenticated USING (true);
