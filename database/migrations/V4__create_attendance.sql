-- ==============================================================================
-- Migration: V4__create_attendance.sql
-- Module: MODULE 5 — ATTENDANCE
-- Project: Dayflow - Human Resource Management System (HRMS)
-- Description:
-- Creates the daily time tracking and attendance table 'attendance' with:
--   - 1:N relationship from employees (attendance.employee_id -> employees.id)
--   - Strict unique daily attendance per employee (employee_id, attendance_date)
--   - Validated attendance statuses (PRESENT, ABSENT, HALF_DAY, LEAVE)
--   - Timezone-aware check-in/out timestamps and working minutes calculations
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Create 'attendance' Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL,
    attendance_date DATE NOT NULL,
    check_in TIMESTAMPTZ NULL,
    check_out TIMESTAMPTZ NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PRESENT',
    working_minutes INTEGER NULL,
    remarks TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Unique Daily Attendance Constraint
    CONSTRAINT uq_attendance_employee_date UNIQUE (employee_id, attendance_date),

    -- Foreign Key Constraint (Restricted Delete)
    CONSTRAINT fk_attendance_employee FOREIGN KEY (employee_id)
        REFERENCES employees (id)
        ON DELETE RESTRICT,

    -- Check Constraints
    CONSTRAINT chk_attendance_status CHECK (
        status IN ('PRESENT', 'ABSENT', 'HALF_DAY', 'LEAVE')
    ),
    CONSTRAINT chk_attendance_checkout CHECK (
        check_out IS NULL OR check_in IS NULL OR check_out >= check_in
    ),
    CONSTRAINT chk_attendance_working_minutes CHECK (
        working_minutes IS NULL OR working_minutes >= 0
    )
);

-- ------------------------------------------------------------------------------
-- 2. Create Performance & Filter Indexes
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_attendance_employee_id ON attendance(employee_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(attendance_date DESC);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON attendance(status);

-- ------------------------------------------------------------------------------
-- 3. Create Trigger for 'updated_at' Auto-Update
-- ------------------------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_attendance_updated_at ON attendance;
CREATE TRIGGER trg_attendance_updated_at
BEFORE UPDATE ON attendance
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 4. Comments & Documentation
-- ------------------------------------------------------------------------------
COMMENT ON TABLE attendance IS 'Daily employee attendance records, check-in/out timestamps, working hours, and presence status.';
COMMENT ON COLUMN attendance.id IS 'Unique identifier for the attendance record (UUID).';
COMMENT ON COLUMN attendance.employee_id IS 'Foreign key reference to the employee (employees.id).';
COMMENT ON COLUMN attendance.attendance_date IS 'The calendar work date for which attendance is logged.';
COMMENT ON COLUMN attendance.check_in IS 'Timestamp with time zone when the employee checked in.';
COMMENT ON COLUMN attendance.check_out IS 'Timestamp with time zone when the employee checked out.';
COMMENT ON COLUMN attendance.status IS 'Daily attendance status (PRESENT, ABSENT, HALF_DAY, LEAVE).';
COMMENT ON COLUMN attendance.working_minutes IS 'Total calculated working duration for the day in integer minutes.';
COMMENT ON COLUMN attendance.remarks IS 'Optional notes or explanations (e.g., late arrival, approved adjustment).';
