-- ==============================================================================
-- Migration: V7__create_payroll.sql
-- Module: MODULE 8 — PAYROLL
-- Project: Dayflow - Human Resource Management System (HRMS)
-- Description:
-- Creates the employee compensation and payroll records table 'payroll' with:
--   - 1:N relationship from employees (payroll.employee_id -> employees.id)
--   - Pay period tracking and exact period uniqueness per employee
--   - Itemized salary components (basic, housing, transport, other allowances)
--   - Itemized deductions (tax, other deductions) and gross/net calculations
--   - Lifecycle statuses (DRAFT, PROCESSED, PAID, CANCELLED) and payment dates
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Create 'payroll' Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payroll (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL,
    pay_period_start DATE NOT NULL,
    pay_period_end DATE NOT NULL,
    basic_salary NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    housing_allowance NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    transport_allowance NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    other_allowances NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    gross_salary NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    tax_deduction NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    other_deductions NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    total_deductions NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    net_salary NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    payment_date DATE NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Foreign Key Constraint (Protected Financial History)
    CONSTRAINT fk_payroll_employee FOREIGN KEY (employee_id)
        REFERENCES employees (id)
        ON DELETE RESTRICT,

    -- Unique Constraint: One payroll record per employee for exact pay period
    CONSTRAINT uq_payroll_employee_period UNIQUE (employee_id, pay_period_start, pay_period_end),

    -- Date Range & Currency Checks
    CONSTRAINT chk_payroll_period CHECK (
        pay_period_end >= pay_period_start
    ),
    CONSTRAINT chk_payroll_currency CHECK (
        currency ~ '^[A-Z]{3}$'
    ),
    CONSTRAINT chk_payroll_status CHECK (
        status IN ('DRAFT', 'PROCESSED', 'PAID', 'CANCELLED')
    ),

    -- Non-Negative Financial Checks
    CONSTRAINT chk_payroll_basic_salary CHECK (basic_salary >= 0),
    CONSTRAINT chk_payroll_housing_allowance CHECK (housing_allowance >= 0),
    CONSTRAINT chk_payroll_transport_allowance CHECK (transport_allowance >= 0),
    CONSTRAINT chk_payroll_other_allowances CHECK (other_allowances >= 0),
    CONSTRAINT chk_payroll_gross_salary CHECK (gross_salary >= 0),
    CONSTRAINT chk_payroll_tax_deduction CHECK (tax_deduction >= 0),
    CONSTRAINT chk_payroll_other_deductions CHECK (other_deductions >= 0),
    CONSTRAINT chk_payroll_total_deductions CHECK (total_deductions >= 0),
    CONSTRAINT chk_payroll_net_salary CHECK (net_salary >= 0)
);

-- ------------------------------------------------------------------------------
-- 2. Create Performance & Reporting Indexes
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_payroll_employee_id ON payroll(employee_id);
CREATE INDEX IF NOT EXISTS idx_payroll_status ON payroll(status);
CREATE INDEX IF NOT EXISTS idx_payroll_payment_date ON payroll(payment_date);
CREATE INDEX IF NOT EXISTS idx_payroll_period_start ON payroll(pay_period_start DESC);
CREATE INDEX IF NOT EXISTS idx_payroll_employee_status ON payroll(employee_id, status);

-- ------------------------------------------------------------------------------
-- 3. Create Trigger for 'updated_at' Auto-Update
-- ------------------------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_payroll_updated_at ON payroll;
CREATE TRIGGER trg_payroll_updated_at
BEFORE UPDATE ON payroll
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 4. Comments & Documentation
-- ------------------------------------------------------------------------------
COMMENT ON TABLE payroll IS 'Employee periodic salary calculations, allowances, deductions, net pay, and payment tracking records.';
COMMENT ON COLUMN payroll.id IS 'Unique identifier for the payroll record (UUID).';
COMMENT ON COLUMN payroll.employee_id IS 'Foreign key reference to compensated employee (employees.id).';
COMMENT ON COLUMN payroll.pay_period_start IS 'Start date of the compensation cycle.';
COMMENT ON COLUMN payroll.pay_period_end IS 'End date of the compensation cycle (must be >= pay_period_start).';
COMMENT ON COLUMN payroll.basic_salary IS 'Base monthly/periodic compensation in specified currency.';
COMMENT ON COLUMN payroll.housing_allowance IS 'House rent allowance (HRA) component.';
COMMENT ON COLUMN payroll.transport_allowance IS 'Conveyance / travel allowance component.';
COMMENT ON COLUMN payroll.other_allowances IS 'Special, performance, or miscellaneous allowances.';
COMMENT ON COLUMN payroll.gross_salary IS 'Calculated sum of basic salary and all allowances.';
COMMENT ON COLUMN payroll.tax_deduction IS 'TDS / income tax statutory deduction.';
COMMENT ON COLUMN payroll.other_deductions IS 'PF, insurance, or miscellaneous salary deductions.';
COMMENT ON COLUMN payroll.total_deductions IS 'Calculated sum of all deductions.';
COMMENT ON COLUMN payroll.net_salary IS 'Final payable amount (gross_salary - total_deductions, >= 0).';
COMMENT ON COLUMN payroll.currency IS 'Three-letter ISO currency code (default: INR).';
COMMENT ON COLUMN payroll.payment_date IS 'Actual calendar date when salary disbursement was executed.';
COMMENT ON COLUMN payroll.status IS 'Lifecycle state (DRAFT, PROCESSED, PAID, CANCELLED).';
