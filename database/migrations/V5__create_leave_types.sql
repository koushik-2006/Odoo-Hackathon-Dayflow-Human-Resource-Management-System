-- ==============================================================================
-- Migration: V5__create_leave_types.sql
-- Module: MODULE 6 — LEAVE TYPES
-- Project: Dayflow - Human Resource Management System (HRMS)
-- Description:
-- Creates the master leave categories table 'leave_types' with:
--   - Standardized leave codes (PAID, SICK, UNPAID)
--   - Paid vs. unpaid categorization (is_paid BOOLEAN)
--   - Annual default day entitlements (default_days INTEGER >= 0)
--   - Soft-deactivation support (is_active BOOLEAN)
--   - Foundation for 1:N linkage from future Module 7 'leave_requests'
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Create 'leave_types' Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS leave_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    is_paid BOOLEAN NOT NULL DEFAULT TRUE,
    default_days INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Uniqueness Constraints
    CONSTRAINT uq_leave_types_code UNIQUE (code),
    CONSTRAINT uq_leave_types_name UNIQUE (name),

    -- Check Constraints
    CONSTRAINT chk_leave_types_code CHECK (
        LENGTH(TRIM(code)) > 0 AND code ~ '^[A-Z0-9_-]+$'
    ),
    CONSTRAINT chk_leave_types_name CHECK (
        LENGTH(TRIM(name)) > 0
    ),
    CONSTRAINT chk_leave_types_default_days CHECK (
        default_days >= 0
    )
);

-- ------------------------------------------------------------------------------
-- 2. Create Performance & Filter Index
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_leave_types_is_active ON leave_types(is_active);

-- ------------------------------------------------------------------------------
-- 3. Create Trigger for 'updated_at' Auto-Update
-- ------------------------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_leave_types_updated_at ON leave_types;
CREATE TRIGGER trg_leave_types_updated_at
BEFORE UPDATE ON leave_types
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 4. Comments & Documentation
-- ------------------------------------------------------------------------------
COMMENT ON TABLE leave_types IS 'Master organizational leave categories defining leave policies, paid status, and default allowances.';
COMMENT ON COLUMN leave_types.id IS 'Unique identifier for the leave type (UUID).';
COMMENT ON COLUMN leave_types.code IS 'Standard machine-readable unique code for the leave type (e.g., PAID, SICK, UNPAID).';
COMMENT ON COLUMN leave_types.name IS 'Human-readable unique display name of the leave category (e.g., Paid Leave, Sick Leave).';
COMMENT ON COLUMN leave_types.description IS 'Detailed policy overview and guidelines for this leave category.';
COMMENT ON COLUMN leave_types.is_paid IS 'Boolean flag indicating whether leave under this category is compensated (TRUE) or unpaid (FALSE).';
COMMENT ON COLUMN leave_types.default_days IS 'Default annual baseline entitlement in days (0 for unpaid or uncapped).';
COMMENT ON COLUMN leave_types.is_active IS 'Operational status flag. Deactivated leave types are preserved to maintain historical leave request integrity.';
COMMENT ON COLUMN leave_types.created_at IS 'Timestamp with time zone when the leave type was created.';
COMMENT ON COLUMN leave_types.updated_at IS 'Timestamp with time zone when the leave type was last modified.';
