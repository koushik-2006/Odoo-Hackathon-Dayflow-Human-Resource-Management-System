-- ==============================================================================
-- Seed Data: audit_logs.sql
-- Module: MODULE 11 — AUDIT LOGS
-- Project: Dayflow - Human Resource Management System (HRMS)
-- Description:
-- Populates baseline immutable security and activity audit records across demo
-- operations (Authentication, Employee, Attendance, Leave, Payroll, Documents, System).
--
-- Foreign Key Dependency:
--   - users (user_id): References existing user accounts in 'users.sql' (NULL for system events)
-- Security Rules:
--   - Zero storage of passwords, hashes, JWTs, bearer tokens, or sensitive credentials.
-- ==============================================================================

INSERT INTO audit_logs (
    id,
    user_id,
    action,
    entity_type,
    entity_id,
    description,
    old_values,
    new_values,
    ip_address,
    user_agent,
    request_id,
    created_at
)
VALUES
    -- 1. Admin Authentication Login (AUTH_LOGIN)
    (
        '90000000-0000-0000-0000-000000000001'::UUID,
        '00000000-0000-0000-0000-000000000001'::UUID,
        'AUTH_LOGIN',
        'USER',
        '00000000-0000-0000-0000-000000000001'::UUID,
        'Administrator authenticated successfully from corporate workstation.',
        NULL,
        '{"email": "admin@dayflow.com", "role": "ADMIN", "status": "ACTIVE"}'::JSONB,
        '192.168.1.100'::INET,
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0.0.0',
        'req-auth-001',
        '2026-08-01 08:00:00+00'
    ),
    -- 2. Employee Profile Created by HR (EMPLOYEE_CREATED)
    (
        '90000000-0000-0000-0000-000000000002'::UUID,
        '00000000-0000-0000-0000-000000000002'::UUID,
        'EMPLOYEE_CREATED',
        'EMPLOYEE',
        '20000000-0000-0000-0000-000000000003'::UUID,
        'HR Lead created new employee profile for John Doe (EMP003).',
        NULL,
        '{"employee_code": "EMP003", "first_name": "John", "last_name": "Doe", "job_title": "Senior Software Engineer", "employment_status": "ACTIVE"}'::JSONB,
        '192.168.1.102'::INET,
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0.0.0',
        'req-emp-002',
        '2026-08-01 09:30:00+00'
    ),
    -- 3. Daily Attendance Clock-In (ATTENDANCE_CREATED)
    (
        '90000000-0000-0000-0000-000000000003'::UUID,
        '00000000-0000-0000-0000-000000000003'::UUID,
        'ATTENDANCE_CREATED',
        'ATTENDANCE',
        '30000000-0000-0000-0000-000000000015'::UUID,
        'Employee John Doe clocked in for workday 2026-08-18.',
        NULL,
        '{"attendance_date": "2026-08-18", "check_in": "2026-08-18T09:00:00Z", "status": "PRESENT"}'::JSONB,
        '192.168.1.150'::INET,
        'DayflowMobile/1.0 (Android 14)',
        'req-att-003',
        '2026-08-18 09:00:00+00'
    ),
    -- 4. Employee Leave Application Submitted (LEAVE_APPLIED)
    (
        '90000000-0000-0000-0000-000000000004'::UUID,
        '00000000-0000-0000-0000-000000000003'::UUID,
        'LEAVE_APPLIED',
        'LEAVE_REQUEST',
        '50000000-0000-0000-0000-000000000001'::UUID,
        'Employee John Doe submitted paid leave application for Sep 01 to Sep 05.',
        NULL,
        '{"start_date": "2026-09-01", "end_date": "2026-09-05", "status": "PENDING", "reason": "Family vacation"}'::JSONB,
        '192.168.1.150'::INET,
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0.0.0',
        'req-leave-004',
        '2026-08-20 10:00:00+00'
    ),
    -- 5. Leave Request Approved by HR (LEAVE_APPROVED)
    (
        '90000000-0000-0000-0000-000000000005'::UUID,
        '00000000-0000-0000-0000-000000000002'::UUID,
        'LEAVE_APPROVED',
        'LEAVE_REQUEST',
        '50000000-0000-0000-0000-000000000002'::UUID,
        'HR Lead approved sick leave application for Sarah Connor.',
        '{"status": "PENDING", "reviewer_id": null}'::JSONB,
        '{"status": "APPROVED", "reviewer_id": "00000000-0000-0000-0000-000000000002", "reviewer_comment": "Approved as per standard sick leave policy."}'::JSONB,
        '192.168.1.102'::INET,
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0.0.0',
        'req-leave-005',
        '2026-08-19 17:00:00+00'
    ),
    -- 6. Payroll Batch Calculated (PAYROLL_CREATED)
    (
        '90000000-0000-0000-0000-000000000006'::UUID,
        '00000000-0000-0000-0000-000000000001'::UUID,
        'PAYROLL_CREATED',
        'PAYROLL',
        '60000000-0000-0000-0000-000000000001'::UUID,
        'Admin generated monthly payroll record for Alex Vance (July 2026).',
        NULL,
        '{"basic_salary": 120000.00, "gross_salary": 150000.00, "net_salary": 132000.00, "status": "PAID"}'::JSONB,
        '192.168.1.100'::INET,
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0.0.0',
        'req-pay-006',
        '2026-08-05 10:00:00+00'
    ),
    -- 7. Document Uploaded (DOCUMENT_UPLOADED)
    (
        '90000000-0000-0000-0000-000000000007'::UUID,
        '00000000-0000-0000-0000-000000000003'::UUID,
        'DOCUMENT_UPLOADED',
        'DOCUMENT',
        '80000000-0000-0000-0000-000000000001'::UUID,
        'Employee John Doe uploaded signed offer letter.',
        NULL,
        '{"document_name": "Official Offer Letter", "document_type": "OFFER_LETTER", "file_name": "john-doe-offer-letter.pdf", "file_size": 245678, "verification_status": "VERIFIED"}'::JSONB,
        '192.168.1.150'::INET,
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0.0.0',
        'req-doc-007',
        '2026-08-01 10:00:00+00'
    ),
    -- 8. Automated System Background Task (SYSTEM_ACTION)
    (
        '90000000-0000-0000-0000-000000000008'::UUID,
        NULL,
        'SYSTEM_ACTION',
        'SYSTEM',
        NULL,
        'Automated daily attendance lock and midnight rollover completed.',
        NULL,
        '{"job_name": "daily_attendance_sync", "processed_records": 5, "status": "COMPLETED"}'::JSONB,
        '127.0.0.1'::INET,
        'DayflowScheduler/1.0',
        'req-sys-008',
        '2026-08-20 00:00:00+00'
    )
ON CONFLICT (id) DO NOTHING;
