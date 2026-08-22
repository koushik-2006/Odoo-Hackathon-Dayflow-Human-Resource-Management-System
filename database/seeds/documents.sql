-- ==============================================================================
-- Seed Data: documents.sql
-- Module: MODULE 10 — DOCUMENTS
-- Project: Dayflow - Human Resource Management System (HRMS)
-- Description:
-- Populates baseline representative employee document metadata across demo
-- employees (EMP001 to EMP005) covering PENDING, VERIFIED, and REJECTED states.
--
-- Foreign Key Dependencies:
--   - employees (employee_id): References existing employee records in 'employees.sql'
--   - users (uploaded_by, verified_by): References existing user accounts in 'users.sql'
-- NOTE:
--   - Stores metadata and synthetic storage paths only. No binary file assets required.
-- ==============================================================================

INSERT INTO documents (
    id,
    employee_id,
    document_type,
    document_name,
    file_name,
    file_url,
    mime_type,
    file_size,
    description,
    verification_status,
    uploaded_by,
    verified_by,
    verified_at,
    created_at,
    updated_at
)
VALUES
    -- 1. EMP003 (John Doe) - Offer Letter (VERIFIED)
    (
        '80000000-0000-0000-0000-000000000001'::UUID,
        '20000000-0000-0000-0000-000000000003'::UUID,
        'OFFER_LETTER',
        'Official Offer Letter',
        'john-doe-offer-letter.pdf',
        '/uploads/employees/EMP003/john-doe-offer-letter.pdf',
        'application/pdf',
        245678,
        'Signed employment offer letter for Senior Software Engineer role.',
        'VERIFIED',
        '00000000-0000-0000-0000-000000000003'::UUID,
        '00000000-0000-0000-0000-000000000002'::UUID,
        '2026-08-01 11:30:00+00',
        '2026-08-01 10:00:00+00',
        '2026-08-01 11:30:00+00'
    ),
    -- 2. EMP003 (John Doe) - Resume (VERIFIED)
    (
        '80000000-0000-0000-0000-000000000002'::UUID,
        '20000000-0000-0000-0000-000000000003'::UUID,
        'RESUME',
        'Curriculum Vitae',
        'john-doe-cv.pdf',
        '/uploads/employees/EMP003/john-doe-cv.pdf',
        'application/pdf',
        184320,
        'Technical curriculum vitae updated for onboard profiling.',
        'VERIFIED',
        '00000000-0000-0000-0000-000000000003'::UUID,
        '00000000-0000-0000-0000-000000000002'::UUID,
        '2026-08-01 11:35:00+00',
        '2026-08-01 10:05:00+00',
        '2026-08-01 11:35:00+00'
    ),
    -- 3. EMP004 (Sarah Connor) - Degree Certificate (PENDING)
    (
        '80000000-0000-0000-0000-000000000003'::UUID,
        '20000000-0000-0000-0000-000000000004'::UUID,
        'EDUCATION_CERTIFICATE',
        'Master of Finance Degree Certificate',
        'sarah-connor-degree.pdf',
        '/uploads/employees/EMP004/sarah-connor-degree.pdf',
        'application/pdf',
        512000,
        'Official university degree certificate in Finance and Accounting.',
        'PENDING',
        '00000000-0000-0000-0000-000000000004'::UUID,
        NULL,
        NULL,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    -- 4. EMP004 (Sarah Connor) - ID Proof (VERIFIED)
    (
        '80000000-0000-0000-0000-000000000004'::UUID,
        '20000000-0000-0000-0000-000000000004'::UUID,
        'ID_PROOF',
        'Government ID Proof',
        'sarah-connor-govt-id.png',
        '/uploads/employees/EMP004/sarah-connor-govt-id.png',
        'image/png',
        320400,
        'Scanned national identity card for verification.',
        'VERIFIED',
        '00000000-0000-0000-0000-000000000004'::UUID,
        '00000000-0000-0000-0000-000000000002'::UUID,
        '2026-08-03 14:20:00+00',
        '2026-08-03 09:15:00+00',
        '2026-08-03 14:20:00+00'
    ),
    -- 5. EMP005 (David Miller) - Experience Certificate (REJECTED)
    (
        '80000000-0000-0000-0000-000000000005'::UUID,
        '20000000-0000-0000-0000-000000000005'::UUID,
        'EXPERIENCE_CERTIFICATE',
        'Prior Employer Experience Certificate',
        'david-miller-exp-cert.pdf',
        '/uploads/employees/EMP005/david-miller-exp-cert.pdf',
        'application/pdf',
        198400,
        'Previous employer marketing specialist service letter (missing company stamp).',
        'REJECTED',
        '00000000-0000-0000-0000-000000000005'::UUID,
        '00000000-0000-0000-0000-000000000002'::UUID,
        '2026-08-10 16:45:00+00',
        '2026-08-10 11:00:00+00',
        '2026-08-10 16:45:00+00'
    ),
    -- 6. EMP001 (Alex Vance) - Employment Contract (VERIFIED)
    (
        '80000000-0000-0000-0000-000000000006'::UUID,
        '20000000-0000-0000-0000-000000000001'::UUID,
        'EMPLOYMENT_CONTRACT',
        'Executive Employment Contract',
        'alex-vance-contract.pdf',
        '/uploads/employees/EMP001/alex-vance-contract.pdf',
        'application/pdf',
        428000,
        'Signed permanent employment contract for IT Lead.',
        'VERIFIED',
        '00000000-0000-0000-0000-000000000001'::UUID,
        '00000000-0000-0000-0000-000000000001'::UUID,
        '2026-08-01 09:00:00+00',
        '2026-08-01 08:30:00+00',
        '2026-08-01 09:00:00+00'
    ),
    -- 7. EMP002 (Claire Redfield) - Previous Salary Slips (VERIFIED)
    (
        '80000000-0000-0000-0000-000000000007'::UUID,
        '20000000-0000-0000-0000-000000000002'::UUID,
        'SALARY_SLIP',
        'Previous Employer Last 3 Months Salary Slips',
        'claire-prev-payslips.pdf',
        '/uploads/employees/EMP002/claire-prev-payslips.pdf',
        'application/pdf',
        645000,
        'Consolidated pay slips submitted for compensation benchmarking.',
        'VERIFIED',
        '00000000-0000-0000-0000-000000000002'::UUID,
        '00000000-0000-0000-0000-000000000001'::UUID,
        '2026-08-02 10:00:00+00',
        '2026-08-02 09:15:00+00',
        '2026-08-02 10:00:00+00'
    )
ON CONFLICT (id) DO UPDATE
SET
    employee_id = EXCLUDED.employee_id,
    document_type = EXCLUDED.document_type,
    document_name = EXCLUDED.document_name,
    file_name = EXCLUDED.file_name,
    file_url = EXCLUDED.file_url,
    mime_type = EXCLUDED.mime_type,
    file_size = EXCLUDED.file_size,
    description = EXCLUDED.description,
    verification_status = EXCLUDED.verification_status,
    uploaded_by = EXCLUDED.uploaded_by,
    verified_by = EXCLUDED.verified_by,
    verified_at = EXCLUDED.verified_at,
    updated_at = CURRENT_TIMESTAMP;
