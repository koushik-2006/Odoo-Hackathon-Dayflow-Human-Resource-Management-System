-- ==============================================================================
-- Seed Data: leave_requests.sql
-- Module: MODULE 7 — LEAVE REQUESTS
-- Project: Dayflow - Human Resource Management System (HRMS)
-- Description:
-- Populates baseline representative leave applications covering PENDING,
-- APPROVED, and REJECTED states across various employees, leave types, and reviewers.
--
-- Foreign Key Dependencies:
--   - employees (employee_id): References existing employee profiles in 'employees.sql'
--   - leave_types (leave_type_id): References existing leave categories in 'leave_types.sql'
--   - users (reviewer_id): References existing HR/Admin accounts in 'users.sql'
-- ==============================================================================

INSERT INTO leave_requests (
    id,
    employee_id,
    leave_type_id,
    start_date,
    end_date,
    reason,
    status,
    reviewer_id,
    reviewer_comment,
    reviewed_at,
    created_at,
    updated_at
)
VALUES
    -- -------------------------------------------------------------------------
    -- 1. PENDING Request: EMP003 (John Doe) - Paid Vacation
    -- -------------------------------------------------------------------------
    (
        '50000000-0000-0000-0000-000000000001'::UUID,
        '20000000-0000-0000-0000-000000000003'::UUID,
        '40000000-0000-0000-0000-000000000001'::UUID,
        '2026-09-01',
        '2026-09-05',
        'Family vacation and annual travel.',
        'PENDING',
        NULL,
        NULL,
        NULL,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    -- -------------------------------------------------------------------------
    -- 2. APPROVED Request: EMP004 (Sarah Connor) - Sick Leave (Reviewed by HR)
    -- -------------------------------------------------------------------------
    (
        '50000000-0000-0000-0000-000000000002'::UUID,
        '20000000-0000-0000-0000-000000000004'::UUID,
        '40000000-0000-0000-0000-000000000002'::UUID,
        '2026-08-20',
        '2026-08-20',
        'Medical appointment and dental procedure.',
        'APPROVED',
        '00000000-0000-0000-0000-000000000002'::UUID,
        'Approved. Please submit medical slip upon return.',
        '2026-08-19 16:30:00+00',
        '2026-08-19 10:15:00+00',
        '2026-08-19 16:30:00+00'
    ),
    -- -------------------------------------------------------------------------
    -- 3. REJECTED Request: EMP005 (David Miller) - Paid Leave (Reviewed by HR)
    -- -------------------------------------------------------------------------
    (
        '50000000-0000-0000-0000-000000000003'::UUID,
        '20000000-0000-0000-0000-000000000005'::UUID,
        '40000000-0000-0000-0000-000000000001'::UUID,
        '2026-08-28',
        '2026-08-29',
        'Personal leisure travel.',
        'REJECTED',
        '00000000-0000-0000-0000-000000000002'::UUID,
        'Leave period conflicts with the Q3 marketing campaign launch deadline.',
        '2026-08-22 10:00:00+00',
        '2026-08-21 14:00:00+00',
        '2026-08-22 10:00:00+00'
    ),
    -- -------------------------------------------------------------------------
    -- 4. APPROVED Request: EMP002 (Claire Redfield) - Paid Rest (Reviewed by Admin)
    -- -------------------------------------------------------------------------
    (
        '50000000-0000-0000-0000-000000000004'::UUID,
        '20000000-0000-0000-0000-000000000002'::UUID,
        '40000000-0000-0000-0000-000000000001'::UUID,
        '2026-08-18',
        '2026-08-18',
        'Approved annual rest day.',
        'APPROVED',
        '00000000-0000-0000-0000-000000000001'::UUID,
        'Approved. Enjoy your day off.',
        '2026-08-17 11:00:00+00',
        '2026-08-16 15:30:00+00',
        '2026-08-17 11:00:00+00'
    ),
    -- -------------------------------------------------------------------------
    -- 5. PENDING Request: EMP001 (Alex Vance) - Unpaid Sabbatical
    -- -------------------------------------------------------------------------
    (
        '50000000-0000-0000-0000-000000000005'::UUID,
        '20000000-0000-0000-0000-000000000001'::UUID,
        '40000000-0000-0000-0000-000000000003'::UUID,
        '2026-09-15',
        '2026-09-18',
        'Personal academic conference and sabbatical research.',
        'PENDING',
        NULL,
        NULL,
        NULL,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )
ON CONFLICT (id) DO UPDATE
SET
    employee_id = EXCLUDED.employee_id,
    leave_type_id = EXCLUDED.leave_type_id,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    reason = EXCLUDED.reason,
    status = EXCLUDED.status,
    reviewer_id = EXCLUDED.reviewer_id,
    reviewer_comment = EXCLUDED.reviewer_comment,
    reviewed_at = EXCLUDED.reviewed_at,
    updated_at = CURRENT_TIMESTAMP;
