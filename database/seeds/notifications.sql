-- ==============================================================================
-- Seed Data: notifications.sql
-- Module: MODULE 9 — NOTIFICATIONS
-- Project: Dayflow - Human Resource Management System (HRMS)
-- Description:
-- Populates representative in-app alerts and notifications across demo users
-- demonstrating unread, read, leave, attendance, payroll, and general categories.
--
-- Foreign Key Dependency:
--   - users (user_id): References existing user accounts in 'users.sql'
-- Application References:
--   - leave_requests (reference_id when reference_type = 'LEAVE_REQUEST')
--   - attendance (reference_id when reference_type = 'ATTENDANCE')
--   - payroll (reference_id when reference_type = 'PAYROLL')
-- ==============================================================================

INSERT INTO notifications (
    id,
    user_id,
    type,
    title,
    message,
    reference_type,
    reference_id,
    is_read,
    read_at,
    created_at,
    updated_at
)
VALUES
    -- 1. LEAVE_APPLIED (Unread) - John Doe
    (
        '70000000-0000-0000-0000-000000000001'::UUID,
        '00000000-0000-0000-0000-000000000003'::UUID,
        'LEAVE_APPLIED',
        'Leave Application Submitted',
        'Your paid leave request for Sep 01 - Sep 05 has been submitted and is pending review.',
        'LEAVE_REQUEST',
        '50000000-0000-0000-0000-000000000001'::UUID,
        FALSE,
        NULL,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    -- 2. LEAVE_APPROVED (Read) - Sarah Connor
    (
        '70000000-0000-0000-0000-000000000002'::UUID,
        '00000000-0000-0000-0000-000000000004'::UUID,
        'LEAVE_APPROVED',
        'Leave Request Approved',
        'Your sick leave request for Aug 20 has been approved by HR.',
        'LEAVE_REQUEST',
        '50000000-0000-0000-0000-000000000002'::UUID,
        TRUE,
        '2026-08-19 17:00:00+00',
        '2026-08-19 16:30:00+00',
        '2026-08-19 17:00:00+00'
    ),
    -- 3. LEAVE_REJECTED (Read) - David Miller
    (
        '70000000-0000-0000-0000-000000000003'::UUID,
        '00000000-0000-0000-0000-000000000005'::UUID,
        'LEAVE_REJECTED',
        'Leave Request Rejected',
        'Your paid leave request for Aug 28 - Aug 29 was rejected: Leave period conflicts with Q3 marketing campaign launch.',
        'LEAVE_REQUEST',
        '50000000-0000-0000-0000-000000000003'::UUID,
        TRUE,
        '2026-08-22 10:30:00+00',
        '2026-08-22 10:00:00+00',
        '2026-08-22 10:30:00+00'
    ),
    -- 4. ATTENDANCE_REMINDER (Unread) - John Doe
    (
        '70000000-0000-0000-0000-000000000004'::UUID,
        '00000000-0000-0000-0000-000000000003'::UUID,
        'ATTENDANCE_REMINDER',
        'Attendance Check-In Reminder',
        'Please remember to clock in for today''s workday.',
        'ATTENDANCE',
        NULL,
        FALSE,
        NULL,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    -- 5. ATTENDANCE_ALERT (Read) - David Miller
    (
        '70000000-0000-0000-0000-000000000005'::UUID,
        '00000000-0000-0000-0000-000000000005'::UUID,
        'ATTENDANCE_ALERT',
        'Unplanned Absence Logged',
        'An unplanned absence was recorded for 2026-08-19. Please submit a regularizing leave request.',
        'ATTENDANCE',
        '30000000-0000-0000-0000-000000000032'::UUID,
        TRUE,
        '2026-08-20 09:15:00+00',
        '2026-08-20 08:30:00+00',
        '2026-08-20 09:15:00+00'
    ),
    -- 6. PAYROLL_PROCESSED (Unread) - Admin
    (
        '70000000-0000-0000-0000-000000000006'::UUID,
        '00000000-0000-0000-0000-000000000001'::UUID,
        'PAYROLL_PROCESSED',
        'August 2026 Payroll Processed',
        'August 2026 pay run has been processed and is ready for final administrative review.',
        'PAYROLL',
        '60000000-0000-0000-0000-000000000002'::UUID,
        FALSE,
        NULL,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    -- 7. PAYROLL_PAID (Read) - John Doe
    (
        '70000000-0000-0000-0000-000000000007'::UUID,
        '00000000-0000-0000-0000-000000000003'::UUID,
        'PAYROLL_PAID',
        'July 2026 Salary Disbursed',
        'Your salary for July 2026 (₹98,000.00) has been credited to your bank account.',
        'PAYROLL',
        '60000000-0000-0000-0000-000000000005'::UUID,
        TRUE,
        '2026-08-05 14:00:00+00',
        '2026-08-05 12:00:00+00',
        '2026-08-05 14:00:00+00'
    ),
    -- 8. GENERAL (Read) - Sarah Connor
    (
        '70000000-0000-0000-0000-000000000008'::UUID,
        '00000000-0000-0000-0000-000000000004'::UUID,
        'GENERAL',
        'Welcome to Dayflow HRMS',
        'Welcome to Dayflow HRMS. Please verify your profile details and emergency contact records.',
        'GENERAL',
        NULL,
        TRUE,
        '2026-08-01 10:00:00+00',
        '2026-08-01 09:00:00+00',
        '2026-08-01 10:00:00+00'
    )
ON CONFLICT (id) DO UPDATE
SET
    user_id = EXCLUDED.user_id,
    type = EXCLUDED.type,
    title = EXCLUDED.title,
    message = EXCLUDED.message,
    reference_type = EXCLUDED.reference_type,
    reference_id = EXCLUDED.reference_id,
    is_read = EXCLUDED.is_read,
    read_at = EXCLUDED.read_at,
    updated_at = CURRENT_TIMESTAMP;
