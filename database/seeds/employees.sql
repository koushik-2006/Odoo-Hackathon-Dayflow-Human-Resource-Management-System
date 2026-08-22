-- ==============================================================================
-- Seed Data: employees.sql
-- Module: MODULE 4 — EMPLOYEES
-- Project: Dayflow - Human Resource Management System (HRMS)
-- Description:
-- Populates baseline employee profiles corresponding to the demo accounts
-- in 'users.sql' and organizational units in 'departments.sql'.
--
-- Foreign Key Dependencies:
--   - users (user_id): 1:1 linkage to authentication record
--   - departments (department_id): N:1 linkage to operational division
-- ==============================================================================

INSERT INTO employees (
    id,
    user_id,
    employee_code,
    first_name,
    last_name,
    date_of_birth,
    gender,
    phone,
    address,
    city,
    state,
    postal_code,
    job_title,
    department_id,
    joining_date,
    employment_status,
    profile_picture_url,
    emergency_contact_name,
    emergency_contact_phone,
    created_at,
    updated_at
)
VALUES
    -- 1. System Administrator Profile (IT Department)
    (
        '20000000-0000-0000-0000-000000000001'::UUID,
        '00000000-0000-0000-0000-000000000001'::UUID, -- admin@dayflow.com
        'EMP001',
        'Alex',
        'Vance',
        '1988-04-12',
        'MALE',
        '+1-555-0101',
        '100 Innovation Parkway, Suite 400',
        'San Francisco',
        'California',
        '94105',
        'Principal Systems Architect',
        '10000000-0000-0000-0000-000000000001'::UUID, -- IT
        '2020-01-15',
        'ACTIVE',
        'https://images.dayflow.internal/avatars/emp001.png',
        'Elena Vance',
        '+1-555-0191',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    -- 2. Human Resources Lead Profile (HR Department)
    (
        '20000000-0000-0000-0000-000000000002'::UUID,
        '00000000-0000-0000-0000-000000000002'::UUID, -- hr@dayflow.com
        'EMP002',
        'Claire',
        'Redfield',
        '1992-07-25',
        'FEMALE',
        '+1-555-0102',
        '250 People Operations Way',
        'Austin',
        'Texas',
        '78701',
        'Senior HR Operations Manager',
        '10000000-0000-0000-0000-000000000002'::UUID, -- HR
        '2021-03-01',
        'ACTIVE',
        'https://images.dayflow.internal/avatars/emp002.png',
        'Chris Redfield',
        '+1-555-0192',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    -- 3. Senior Software Engineer Profile (IT Department)
    (
        '20000000-0000-0000-0000-000000000003'::UUID,
        '00000000-0000-0000-0000-000000000003'::UUID, -- employee.john@dayflow.com
        'EMP003',
        'John',
        'Doe',
        '1995-11-14',
        'MALE',
        '+1-555-0103',
        '742 Evergreen Terrace',
        'Seattle',
        'Washington',
        '98101',
        'Senior Software Engineer',
        '10000000-0000-0000-0000-000000000001'::UUID, -- IT
        '2022-02-15',
        'ACTIVE',
        'https://images.dayflow.internal/avatars/emp003.png',
        'Jane Doe',
        '+1-555-0193',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    -- 4. Financial Analyst Profile (Finance Department)
    (
        '20000000-0000-0000-0000-000000000004'::UUID,
        '00000000-0000-0000-0000-000000000004'::UUID, -- employee.sarah@dayflow.com
        'EMP004',
        'Sarah',
        'Connor',
        '1994-09-18',
        'FEMALE',
        '+1-555-0104',
        '88 Wall Street Boulevard',
        'New York',
        'New York',
        '10005',
        'Lead Financial Analyst',
        '10000000-0000-0000-0000-000000000003'::UUID, -- Finance
        '2022-08-01',
        'ACTIVE',
        'https://images.dayflow.internal/avatars/emp004.png',
        'John Connor',
        '+1-555-0194',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    -- 5. Marketing Specialist Profile (Marketing Department)
    (
        '20000000-0000-0000-0000-000000000005'::UUID,
        '00000000-0000-0000-0000-000000000005'::UUID, -- employee@dayflow.com
        'EMP005',
        'David',
        'Miller',
        '1997-02-28',
        'MALE',
        '+1-555-0105',
        '450 Madison Avenue',
        'Chicago',
        'Illinois',
        '60601',
        'Digital Marketing Specialist',
        '10000000-0000-0000-0000-000000000004'::UUID, -- Marketing
        '2023-01-10',
        'ACTIVE',
        'https://images.dayflow.internal/avatars/emp005.png',
        'Rachel Miller',
        '+1-555-0195',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )
ON CONFLICT (employee_code) DO UPDATE
SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    date_of_birth = EXCLUDED.date_of_birth,
    gender = EXCLUDED.gender,
    phone = EXCLUDED.phone,
    address = EXCLUDED.address,
    city = EXCLUDED.city,
    state = EXCLUDED.state,
    postal_code = EXCLUDED.postal_code,
    job_title = EXCLUDED.job_title,
    department_id = EXCLUDED.department_id,
    joining_date = EXCLUDED.joining_date,
    employment_status = EXCLUDED.employment_status,
    profile_picture_url = EXCLUDED.profile_picture_url,
    emergency_contact_name = EXCLUDED.emergency_contact_name,
    emergency_contact_phone = EXCLUDED.emergency_contact_phone,
    updated_at = CURRENT_TIMESTAMP;
