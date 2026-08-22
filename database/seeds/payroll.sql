-- ==============================================================================
-- Seed Data: payroll.sql
-- Module: MODULE 8 — PAYROLL
-- Project: Dayflow - Human Resource Management System (HRMS)
-- Description:
-- Populates representative compensation and monthly pay run records across demo
-- employees (EMP001 to EMP005) demonstrating DRAFT, PROCESSED, and PAID states.
--
-- Foreign Key Dependency:
--   - employees (employee_id): References existing employee records in 'employees.sql'
-- ==============================================================================

INSERT INTO payroll (
    id,
    employee_id,
    pay_period_start,
    pay_period_end,
    basic_salary,
    housing_allowance,
    transport_allowance,
    other_allowances,
    gross_salary,
    tax_deduction,
    other_deductions,
    total_deductions,
    net_salary,
    currency,
    payment_date,
    status,
    created_at,
    updated_at
)
VALUES
    -- =========================================================================
    -- EMP001 (Alex Vance - IT Lead) Payroll Records
    -- =========================================================================
    -- July 2026 (PAID)
    (
        '60000000-0000-0000-0000-000000000001'::UUID,
        '20000000-0000-0000-0000-000000000001'::UUID,
        '2026-07-01',
        '2026-07-31',
        120000.00,
        20000.00,
        5000.00,
        5000.00,
        150000.00,
        15000.00,
        3000.00,
        18000.00,
        132000.00,
        'INR',
        '2026-08-05',
        'PAID',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    -- August 2026 (PROCESSED)
    (
        '60000000-0000-0000-0000-000000000002'::UUID,
        '20000000-0000-0000-0000-000000000001'::UUID,
        '2026-08-01',
        '2026-08-31',
        120000.00,
        20000.00,
        5000.00,
        5000.00,
        150000.00,
        15000.00,
        3000.00,
        18000.00,
        132000.00,
        'INR',
        NULL,
        'PROCESSED',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),

    -- =========================================================================
    -- EMP002 (Claire Redfield - HR Lead) Payroll Records
    -- =========================================================================
    -- July 2026 (PAID)
    (
        '60000000-0000-0000-0000-000000000003'::UUID,
        '20000000-0000-0000-0000-000000000002'::UUID,
        '2026-07-01',
        '2026-07-31',
        100000.00,
        15000.00,
        4000.00,
        3000.00,
        122000.00,
        12000.00,
        2000.00,
        14000.00,
        108000.00,
        'INR',
        '2026-08-05',
        'PAID',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    -- August 2026 (DRAFT)
    (
        '60000000-0000-0000-0000-000000000004'::UUID,
        '20000000-0000-0000-0000-000000000002'::UUID,
        '2026-08-01',
        '2026-08-31',
        100000.00,
        15000.00,
        4000.00,
        3000.00,
        122000.00,
        12000.00,
        2000.00,
        14000.00,
        108000.00,
        'INR',
        NULL,
        'DRAFT',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),

    -- =========================================================================
    -- EMP003 (John Doe - Senior Software Engineer) Payroll Records
    -- =========================================================================
    -- July 2026 (PAID)
    (
        '60000000-0000-0000-0000-000000000005'::UUID,
        '20000000-0000-0000-0000-000000000003'::UUID,
        '2026-07-01',
        '2026-07-31',
        90000.00,
        15000.00,
        3000.00,
        2000.00,
        110000.00,
        10000.00,
        2000.00,
        12000.00,
        98000.00,
        'INR',
        '2026-08-05',
        'PAID',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    -- August 2026 (DRAFT)
    (
        '60000000-0000-0000-0000-000000000006'::UUID,
        '20000000-0000-0000-0000-000000000003'::UUID,
        '2026-08-01',
        '2026-08-31',
        90000.00,
        15000.00,
        3000.00,
        2000.00,
        110000.00,
        10000.00,
        2000.00,
        12000.00,
        98000.00,
        'INR',
        NULL,
        'DRAFT',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),

    -- =========================================================================
    -- EMP004 (Sarah Connor - Finance Lead) Payroll Records
    -- =========================================================================
    -- July 2026 (PAID)
    (
        '60000000-0000-0000-0000-000000000007'::UUID,
        '20000000-0000-0000-0000-000000000004'::UUID,
        '2026-07-01',
        '2026-07-31',
        105000.00,
        18000.00,
        4000.00,
        3000.00,
        130000.00,
        13000.00,
        2000.00,
        15000.00,
        115000.00,
        'INR',
        '2026-08-05',
        'PAID',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),

    -- =========================================================================
    -- EMP005 (David Miller - Marketing Specialist) Payroll Records
    -- =========================================================================
    -- July 2026 (PAID)
    (
        '60000000-0000-0000-0000-000000000008'::UUID,
        '20000000-0000-0000-0000-000000000005'::UUID,
        '2026-07-01',
        '2026-07-31',
        65000.00,
        10000.00,
        2500.00,
        2500.00,
        80000.00,
        6000.00,
        1500.00,
        7500.00,
        72500.00,
        'INR',
        '2026-08-05',
        'PAID',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )
ON CONFLICT (employee_id, pay_period_start, pay_period_end) DO UPDATE
SET
    basic_salary = EXCLUDED.basic_salary,
    housing_allowance = EXCLUDED.housing_allowance,
    transport_allowance = EXCLUDED.transport_allowance,
    other_allowances = EXCLUDED.other_allowances,
    gross_salary = EXCLUDED.gross_salary,
    tax_deduction = EXCLUDED.tax_deduction,
    other_deductions = EXCLUDED.other_deductions,
    total_deductions = EXCLUDED.total_deductions,
    net_salary = EXCLUDED.net_salary,
    currency = EXCLUDED.currency,
    payment_date = EXCLUDED.payment_date,
    status = EXCLUDED.status,
    updated_at = CURRENT_TIMESTAMP;
