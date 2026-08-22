-- ==============================================================================
-- Migration: V2__create_departments.sql
-- Module: MODULE 3 — DEPARTMENTS
-- Project: Dayflow - Human Resource Management System (HRMS)
-- Description:
-- Creates the organizational departments table 'departments' along with
-- unique constraints, uppercase code formatting constraints, triggers, and indices.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Create 'departments' Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL,
    description TEXT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT uq_departments_name UNIQUE (name),
    CONSTRAINT uq_departments_code UNIQUE (code),
    CONSTRAINT chk_departments_code_format CHECK (
        code = UPPER(TRIM(code)) AND LENGTH(TRIM(code)) >= 2 AND code ~ '^[A-Z0-9_-]+$'
    ),
    CONSTRAINT chk_departments_name_not_empty CHECK (
        LENGTH(TRIM(name)) > 0
    )
);

-- ------------------------------------------------------------------------------
-- 2. Create Performance & Filter Index
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_departments_is_active ON departments(is_active);

-- ------------------------------------------------------------------------------
-- 3. Create Trigger for 'updated_at' Auto-Update
-- ------------------------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_departments_updated_at ON departments;
CREATE TRIGGER trg_departments_updated_at
BEFORE UPDATE ON departments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 4. Comments & Documentation
-- ------------------------------------------------------------------------------
COMMENT ON TABLE departments IS 'Organizational departments that define business divisions, teams, and employee groupings.';
COMMENT ON COLUMN departments.id IS 'Unique identifier for the department (UUID).';
COMMENT ON COLUMN departments.name IS 'Descriptive and unique display name of the department.';
COMMENT ON COLUMN departments.code IS 'Normalized, uppercase unique business identifier code for the department (e.g., IT, HR, FIN).';
COMMENT ON COLUMN departments.description IS 'Optional detailed overview of the department responsibilities and purpose.';
COMMENT ON COLUMN departments.is_active IS 'Operational status flag. Inactive departments are soft-retained for historical employee data integrity.';
COMMENT ON COLUMN departments.created_at IS 'Timestamp with time zone when the department record was created.';
COMMENT ON COLUMN departments.updated_at IS 'Timestamp with time zone when the department record was last modified.';
