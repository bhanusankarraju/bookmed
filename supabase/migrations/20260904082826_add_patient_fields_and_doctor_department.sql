-- Add patient details columns to appointments
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS age INTEGER;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS cause_of_visit TEXT;

-- Change default status to Pending (requests need doctor approval)
ALTER TABLE appointments ALTER COLUMN status SET DEFAULT 'Pending';

-- Add department column to doctors so each doctor is tied to a department
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS department TEXT;

-- Assign the existing demo doctor to General Medicine
UPDATE doctors SET department = 'General Medicine' WHERE email = 'doctor@bookmed.com';
