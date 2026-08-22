-- ==============================================================================
-- Seed Data: attendance.sql
-- Module: MODULE 5 — ATTENDANCE
-- Project: Dayflow - Human Resource Management System (HRMS)
-- Description:
-- Populates baseline multi-day attendance records for demonstration employees
-- (EMP001 to EMP005) covering PRESENT, HALF_DAY, ABSENT, and LEAVE states.
--
-- Foreign Key Dependency:
--   - employees (employee_id): References existing employee records in 'employees.sql'
-- ==============================================================================

INSERT INTO attendance (
    id,
    employee_id,
    attendance_date,
    check_in,
    check_out,
    status,
    working_minutes,
    remarks,
    created_at,
    updated_at
)
VALUES
    -- =========================================================================
    -- EMP001 (Alex Vance - IT Lead) Attendance (2026-08-16 to 2026-08-22)
    -- =========================================================================
    (
        '30000000-0000-0000-0000-000000000001'::UUID,
        '20000000-0000-0000-0000-000000000001'::UUID,
        '2026-08-16',
        '2026-08-16 09:00:00+00',
        '2026-08-16 18:00:00+00',
        'PRESENT',
        540,
        'Regular shift',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        '30000000-0000-0000-0000-000000000002'::UUID,
        '20000000-0000-0000-0000-000000000001'::UUID,
        '2026-08-17',
        '2026-08-17 08:55:00+00',
        '2026-08-17 17:55:00+00',
        'PRESENT',
        540,
        'On-time arrival',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        '30000000-0000-0000-0000-000000000003'::UUID,
        '20000000-0000-0000-0000-000000000001'::UUID,
        '2026-08-18',
        '2026-08-18 09:00:00+00',
        '2026-08-18 13:00:00+00',
        'HALF_DAY',
        240,
        'Medical appointment in afternoon',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        '30000000-0000-0000-0000-000000000004'::UUID,
        '20000000-0000-0000-0000-000000000001'::UUID,
        '2026-08-19',
        '2026-08-19 09:05:00+00',
        '2026-08-19 18:15:00+00',
        'PRESENT',
        550,
        'Extended shift for server upgrade',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        '30000000-0000-0000-0000-000000000005'::UUID,
        '20000000-0000-0000-0000-000000000001'::UUID,
        '2026-08-20',
        NULL,
        NULL,
        'ABSENT',
        NULL,
        'Unplanned absence',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        '30000000-0000-0000-0000-000000000006'::UUID,
        '20000000-0000-0000-0000-000000000001'::UUID,
        '2026-08-21',
        '2026-08-21 09:00:00+00',
        '2026-08-21 18:00:00+00',
        'PRESENT',
        540,
        'Regular shift',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        '30000000-0000-0000-0000-000000000007'::UUID,
        '20000000-0000-0000-0000-000000000001'::UUID,
        '2026-08-22',
        '2026-08-22 09:00:00+00',
        NULL,
        'PRESENT',
        NULL,
        'Currently clocked in',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),

    -- =========================================================================
    -- EMP002 (Claire Redfield - HR Lead) Attendance (2026-08-16 to 2026-08-22)
    -- =========================================================================
    (
        '30000000-0000-0000-0000-000000000008'::UUID,
        '20000000-0000-0000-0000-000000000002'::UUID,
        '2026-08-16',
        '2026-08-16 08:45:00+00',
        '2026-08-16 17:45:00+00',
        'PRESENT',
        540,
        'Regular shift',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        '30000000-0000-0000-0000-000000000009'::UUID,
        '20000000-0000-0000-0000-000000000002'::UUID,
        '2026-08-17',
        '2026-08-17 09:00:00+00',
        '2026-08-17 18:00:00+00',
        'PRESENT',
        540,
        'Regular shift',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        '30000000-0000-0000-0000-000000000010'::UUID,
        '20000000-0000-0000-0000-000000000002'::UUID,
        '2026-08-18',
        NULL,
        NULL,
        'LEAVE',
        NULL,
        'Approved annual leave',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        '30000000-0000-0000-0000-000000000011'::UUID,
        '20000000-0000-0000-0000-000000000002'::UUID,
        '2026-08-19',
        '2026-08-19 09:00:00+00',
        '2026-08-19 18:00:00+00',
        'PRESENT',
        540,
        'Regular shift',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        '30000000-0000-0000-0000-000000000012'::UUID,
        '20000000-0000-0000-0000-000000000002'::UUID,
        '2026-08-20',
        '2026-08-20 08:50:00+00',
        '2026-08-20 18:00:00+00',
        'PRESENT',
        550,
        'Campus recruitment interview session',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        '30000000-0000-0000-0000-000000000013'::UUID,
        '20000000-0000-0000-0000-000000000002'::UUID,
        '2026-08-21',
        '2026-08-21 09:00:00+00',
        '2026-08-21 17:30:00+00',
        'PRESENT',
        510,
        'Early departure approved',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        '30000000-0000-0000-0000-000000000014'::UUID,
        '20000000-0000-0000-0000-000000000002'::UUID,
        '2026-08-22',
        '2026-08-22 08:55:00+00',
        NULL,
        'PRESENT',
        NULL,
        'Currently clocked in',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),

    -- =========================================================================
    -- EMP003 (John Doe - Senior Software Engineer) Attendance (2026-08-16 to 2026-08-22)
    -- =========================================================================
    (
        '30000000-0000-0000-0000-000000000015'::UUID,
        '20000000-0000-0000-0000-000000000003'::UUID,
        '2026-08-16',
        '2026-08-16 09:15:00+00',
        '2026-08-16 18:15:00+00',
        'PRESENT',
        540,
        'Sprint planning',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        '30000000-0000-0000-0000-000000000016'::UUID,
        '20000000-0000-0000-0000-000000000003'::UUID,
        '2026-08-17',
        '2026-08-17 09:00:00+00',
        '2026-08-17 18:30:00+00',
        'PRESENT',
        570,
        'Release deployment support',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        '30000000-0000-0000-0000-000000000017'::UUID,
        '20000000-0000-0000-0000-000000000003'::UUID,
        '2026-08-18',
        '2026-08-18 09:05:00+00',
        '2026-08-18 18:05:00+00',
        'PRESENT',
        540,
        'Regular shift',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        '30000000-0000-0000-0000-000000000018'::UUID,
        '20000000-0000-0000-0000-000000000003'::UUID,
        '2026-08-19',
        '2026-08-19 13:30:00+00',
        '2026-08-19 18:00:00+00',
        'HALF_DAY',
        270,
        'Morning personal commitment',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        '30000000-0000-0000-0000-000000000019'::UUID,
        '20000000-0000-0000-0000-000000000003'::UUID,
        '2026-08-20',
        '2026-08-20 09:00:00+00',
        '2026-08-20 18:00:00+00',
        'PRESENT',
        540,
        'Regular shift',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        '30000000-0000-0000-0000-000000000020'::UUID,
        '20000000-0000-0000-0000-000000000003'::UUID,
        '2026-08-21',
        '2026-08-21 09:10:00+00',
        '2026-08-21 18:10:00+00',
        'PRESENT',
        540,
        'Code review sessions',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        '30000000-0000-0000-0000-000000000021'::UUID,
        '20000000-0000-0000-0000-000000000003'::UUID,
        '2026-08-22',
        '2026-08-22 09:00:00+00',
        NULL,
        'PRESENT',
        NULL,
        'Currently clocked in',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),

    -- =========================================================================
    -- EMP004 (Sarah Connor - Finance Lead) Attendance (2026-08-16 to 2026-08-22)
    -- =========================================================================
    (
        '30000000-0000-0000-0000-000000000022'::UUID,
        '20000000-0000-0000-0000-000000000004'::UUID,
        '2026-08-16',
        NULL,
        NULL,
        'ABSENT',
        NULL,
        'Sick absence',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        '30000000-0000-0000-0000-000000000023'::UUID,
        '20000000-0000-0000-0000-000000000004'::UUID,
        '2026-08-17',
        '2026-08-17 09:00:00+00',
        '2026-08-17 18:00:00+00',
        'PRESENT',
        540,
        'Monthly reconciliation',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        '30000000-0000-0000-0000-000000000024'::UUID,
        '20000000-0000-0000-0000-000000000004'::UUID,
        '2026-08-18',
        '2026-08-18 09:00:00+00',
        '2026-08-18 18:00:00+00',
        'PRESENT',
        540,
        'Tax audit review',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        '30000000-0000-0000-0000-000000000025'::UUID,
        '20000000-0000-0000-0000-000000000004'::UUID,
        '2026-08-19',
        '2026-08-19 08:45:00+00',
        '2026-08-19 17:45:00+00',
        'PRESENT',
        540,
        'Quarterly budgeting',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        '30000000-0000-0000-0000-000000000026'::UUID,
        '20000000-0000-0000-0000-000000000004'::UUID,
        '2026-08-20',
        NULL,
        NULL,
        'LEAVE',
        NULL,
        'Approved casual leave',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        '30000000-0000-0000-0000-000000000027'::UUID,
        '20000000-0000-0000-0000-000000000004'::UUID,
        '2026-08-21',
        '2026-08-21 09:00:00+00',
        '2026-08-21 18:00:00+00',
        'PRESENT',
        540,
        'Payroll verification',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        '30000000-0000-0000-0000-000000000028'::UUID,
        '20000000-0000-0000-0000-000000000004'::UUID,
        '2026-08-22',
        '2026-08-22 09:05:00+00',
        NULL,
        'PRESENT',
        NULL,
        'Currently clocked in',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),

    -- =========================================================================
    -- EMP005 (David Miller - Marketing Specialist) Attendance (2026-08-16 to 2026-08-22)
    -- =========================================================================
    (
        '30000000-0000-0000-0000-000000000029'::UUID,
        '20000000-0000-0000-0000-000000000005'::UUID,
        '2026-08-16',
        '2026-08-16 09:30:00+00',
        '2026-08-16 18:30:00+00',
        'PRESENT',
        540,
        'Social media campaign launch',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        '30000000-0000-0000-0000-000000000030'::UUID,
        '20000000-0000-0000-0000-000000000005'::UUID,
        '2026-08-17',
        '2026-08-17 09:00:00+00',
        '2026-08-17 18:00:00+00',
        'PRESENT',
        540,
        'Content strategy meeting',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        '30000000-0000-0000-0000-000000000031'::UUID,
        '20000000-0000-0000-0000-000000000005'::UUID,
        '2026-08-18',
        '2026-08-18 09:00:00+00',
        '2026-08-18 18:00:00+00',
        'PRESENT',
        540,
        'Digital ad performance analysis',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        '30000000-0000-0000-0000-000000000032'::UUID,
        '20000000-0000-0000-0000-000000000005'::UUID,
        '2026-08-19',
        NULL,
        NULL,
        'ABSENT',
        NULL,
        'Unplanned absence',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        '30000000-0000-0000-0000-000000000033'::UUID,
        '20000000-0000-0000-0000-000000000005'::UUID,
        '2026-08-20',
        '2026-08-20 09:00:00+00',
        '2026-08-20 18:00:00+00',
        'PRESENT',
        540,
        'Client webinar presentation',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        '30000000-0000-0000-0000-000000000034'::UUID,
        '20000000-0000-0000-0000-000000000005'::UUID,
        '2026-08-21',
        '2026-08-21 09:00:00+00',
        '2026-08-21 18:00:00+00',
        'PRESENT',
        540,
        'Weekly marketing analytics wrap-up',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        '30000000-0000-0000-0000-000000000035'::UUID,
        '20000000-0000-0000-0000-000000000005'::UUID,
        '2026-08-22',
        '2026-08-22 09:15:00+00',
        NULL,
        'PRESENT',
        NULL,
        'Currently clocked in',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )
ON CONFLICT (employee_id, attendance_date) DO UPDATE
SET
    check_in = EXCLUDED.check_in,
    check_out = EXCLUDED.check_out,
    status = EXCLUDED.status,
    working_minutes = EXCLUDED.working_minutes,
    remarks = EXCLUDED.remarks,
    updated_at = CURRENT_TIMESTAMP;
