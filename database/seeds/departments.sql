-- ==============================================================================
-- Seed Data: departments.sql
-- Module: MODULE 3 — DEPARTMENTS
-- Project: Dayflow - Human Resource Management System (HRMS)
-- Description:
-- Populates baseline organizational departments with standardized codes
-- and deterministic UUIDs for development, testing, and UI demonstration.
-- ==============================================================================

INSERT INTO departments (
    id,
    name,
    code,
    description,
    is_active,
    created_at,
    updated_at
)
VALUES
    -- 1. Information Technology
    (
        '10000000-0000-0000-0000-000000000001'::UUID,
        'Information Technology',
        'IT',
        'Responsible for enterprise software engineering, cloud infrastructure, and technical support.',
        TRUE,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    -- 2. Human Resources
    (
        '10000000-0000-0000-0000-000000000002'::UUID,
        'Human Resources',
        'HR',
        'Manages people operations, recruitment, employee relations, compliance, and talent growth.',
        TRUE,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    -- 3. Finance & Accounting
    (
        '10000000-0000-0000-0000-000000000003'::UUID,
        'Finance',
        'FIN',
        'Oversees financial planning, corporate budgeting, taxation, audit compliance, and payroll accounting.',
        TRUE,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    -- 4. Marketing
    (
        '10000000-0000-0000-0000-000000000004'::UUID,
        'Marketing',
        'MKT',
        'Drives brand awareness, corporate communications, content creation, and product marketing campaigns.',
        TRUE,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    -- 5. Sales & Business Development
    (
        '10000000-0000-0000-0000-000000000005'::UUID,
        'Sales',
        'SALES',
        'Responsible for customer acquisition, enterprise account management, and revenue growth.',
        TRUE,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    -- 6. Operations
    (
        '10000000-0000-0000-0000-000000000006'::UUID,
        'Operations',
        'OPS',
        'Directs business processes, logistics, facility administration, and workplace management.',
        TRUE,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )
ON CONFLICT (code) DO UPDATE
SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;
