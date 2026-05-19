import { pool } from "./api/_supabase.js";

export { pool };

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      username TEXT,
      email TEXT NOT NULL UNIQUE,
      phone TEXT,
      employee_number TEXT,
      employment_status TEXT NOT NULL DEFAULT 'משרה מלאה',
      department TEXT NOT NULL DEFAULT 'NOC',
      role TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending_verification',
      password_hash TEXT,
      password_updated_at TIMESTAMPTZ,
      password_reset_token TEXT UNIQUE,
      password_reset_sent_at TIMESTAMPTZ,
      verification_token TEXT UNIQUE,
      verification_sent_at TIMESTAMPTZ,
      verified_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS attendance_entries (
      id UUID PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE SET NULL,
      employee_name TEXT NOT NULL,
      employee_email TEXT NOT NULL,
      department TEXT NOT NULL DEFAULT 'NOC',
      shift_label TEXT,
      entered_by_name TEXT,
      clock_in TIMESTAMPTZ NOT NULL,
      clock_out TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS weekly_schedules (
      week_start DATE PRIMARY KEY,
      department TEXT NOT NULL DEFAULT 'NOC',
      published_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS shift_assignments (
      id UUID PRIMARY KEY,
      week_start DATE NOT NULL REFERENCES weekly_schedules(week_start) ON DELETE CASCADE,
      department TEXT NOT NULL DEFAULT 'NOC',
      shift_date DATE NOT NULL,
      shift_label TEXT NOT NULL,
      shift_time TEXT NOT NULL,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS availability_entries (
      id UUID PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      availability_date DATE NOT NULL,
      shift_label TEXT NOT NULL,
      status TEXT NOT NULL,
      note TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (user_id, availability_date, shift_label)
    );

    CREATE INDEX IF NOT EXISTS idx_attendance_clock_in ON attendance_entries(clock_in);
    CREATE INDEX IF NOT EXISTS idx_attendance_employee_email ON attendance_entries(employee_email);
    CREATE INDEX IF NOT EXISTS idx_attendance_lower_email ON attendance_entries(LOWER(employee_email));
    CREATE INDEX IF NOT EXISTS idx_attendance_department_clock_in ON attendance_entries(department, clock_in DESC);
    CREATE INDEX IF NOT EXISTS idx_attendance_user_shift_date ON attendance_entries(user_id, shift_label, clock_in DESC);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_attendance_one_open_email ON attendance_entries(LOWER(employee_email)) WHERE clock_out IS NULL;
    CREATE INDEX IF NOT EXISTS idx_shift_assignments_week_start ON shift_assignments(week_start);
    CREATE INDEX IF NOT EXISTS idx_shift_assignments_user_date ON shift_assignments(user_id, shift_date);
    CREATE INDEX IF NOT EXISTS idx_shift_assignments_department_date ON shift_assignments(department, shift_date);
    CREATE INDEX IF NOT EXISTS idx_availability_date ON availability_entries(availability_date);
    CREATE INDEX IF NOT EXISTS idx_availability_user_date ON availability_entries(user_id, availability_date);
    CREATE INDEX IF NOT EXISTS idx_users_department_status ON users(department, status);
    CREATE INDEX IF NOT EXISTS idx_users_lower_email ON users(LOWER(email));

    ALTER TABLE users ADD COLUMN IF NOT EXISTS username TEXT;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS employee_number TEXT;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS employment_status TEXT NOT NULL DEFAULT 'משרה מלאה';
    ALTER TABLE users ADD COLUMN IF NOT EXISTS department TEXT NOT NULL DEFAULT 'NOC';
    ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS password_updated_at TIMESTAMPTZ;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_token TEXT UNIQUE;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_sent_at TIMESTAMPTZ;
    ALTER TABLE attendance_entries ADD COLUMN IF NOT EXISTS shift_label TEXT;
    ALTER TABLE attendance_entries ADD COLUMN IF NOT EXISTS entered_by_name TEXT;
    ALTER TABLE attendance_entries ADD COLUMN IF NOT EXISTS department TEXT NOT NULL DEFAULT 'NOC';
    ALTER TABLE weekly_schedules ADD COLUMN IF NOT EXISTS department TEXT NOT NULL DEFAULT 'NOC';
    ALTER TABLE shift_assignments ADD COLUMN IF NOT EXISTS department TEXT NOT NULL DEFAULT 'NOC';
    ALTER TABLE shift_assignments DROP CONSTRAINT IF EXISTS shift_assignments_week_start_fkey;
    ALTER TABLE weekly_schedules DROP CONSTRAINT IF EXISTS weekly_schedules_pkey;
    CREATE UNIQUE INDEX IF NOT EXISTS idx_weekly_schedules_department_week_start ON weekly_schedules(department, week_start);
    CREATE INDEX IF NOT EXISTS idx_shift_assignments_department_week_start ON shift_assignments(department, week_start);
    ALTER TABLE availability_entries ADD COLUMN IF NOT EXISTS note TEXT;
    UPDATE users SET username = email WHERE username IS NULL;
    UPDATE users SET employment_status = 'משרה מלאה' WHERE employment_status IN ('×ž×©×¨×” ×ž×œ××”', 'NOC - ×ž×©×¨×” ×ž×œ××”');
    UPDATE users SET role = 'מנהל מערכת' WHERE LOWER(email) = 'benhaimoren@gmail.com';
    UPDATE users SET role = 'מנהל מערכת' WHERE role = '×ž× ×”×œ ×ž×¢×¨×›×ª';
    UPDATE users SET role = 'מנהל/ת' WHERE role = '×ž× ×”×œ/×ª';
    UPDATE users SET role = 'עובד/ת' WHERE role = '×¢×•×‘×“/×ª';
    UPDATE users SET role = 'מנהל מערכת' WHERE role = 'מנהל/ת' AND (email = 'manager@fastshift.local' OR name = 'מנהל מערכת');
    UPDATE users SET role = CASE WHEN department = 'SOC' THEN 'מנהל SOC' ELSE 'מנהל NOC' END WHERE role = 'מנהל/ת';
    UPDATE users SET role = CASE WHEN department = 'SOC' THEN 'Tier 1' ELSE 'NOC - משרה מלאה' END WHERE role = 'עובד/ת';
  `);
}
