-- ==============================================================================
-- Migration: V3__create_employees.sql
-- Module: MODULE 4 — EMPLOYEES
-- Project: Dayflow - Human Resource Management System (HRMS)
-- Description:
-- Creates the core employee profiles table 'employees' holding HR data,
-- personal information, employment lifecycle, and establishing:
--   - 1:1 relationship with 'users' (employees.user_id -> users.id)
--   - N:1 relationship with 'departments' (employees.department_id -> departments.id)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Create 'employees' Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    employee_code VARCHAR(50) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NULL,
    gender VARCHAR(30) NULL,
    phone VARCHAR(20) NULL,
    address TEXT NULL,
    city VARCHAR(100) NULL,
    state VARCHAR(100) NULL,
    postal_code VARCHAR(20) NULL,
    job_title VARCHAR(100) NOT NULL,
    department_id UUID NULL,
    joining_date DATE NOT NULL,
    employment_status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    profile_picture_url TEXT NULL,
    emergency_contact_name VARCHAR(150) NULL,
    emergency_contact_phone VARCHAR(20) NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Uniqueness Constraints
    CONSTRAINT uq_employees_user_id UNIQUE (user_id),
    CONSTRAINT uq_employees_employee_code UNIQUE (employee_code),

    -- Foreign Key Constraints (Restricted Delete for Data Integrity)
    CONSTRAINT fk_employees_user FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_employees_department FOREIGN KEY (department_id)
        REFERENCES departments (id)
        ON DELETE RESTRICT,

    -- Check Constraints
    CONSTRAINT chk_employees_employment_status CHECK (
        employment_status IN ('ACTIVE', 'INACTIVE', 'ON_NOTICE', 'TERMINATED')
    ),
    CONSTRAINT chk_employees_gender CHECK (
        gender IS NULL OR gender IN ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY')
    ),
    CONSTRAINT chk_employees_dob CHECK (
        date_of_birth IS NULL OR date_of_birth <= CURRENT_DATE
    ),
    CONSTRAINT chk_employees_names_not_empty CHECK (
        LENGTH(TRIM(first_name)) > 0 AND LENGTH(TRIM(last_name)) > 0
    ),
    CONSTRAINT chk_employees_code_format CHECK (
        LENGTH(TRIM(employee_code)) >= 2 AND employee_code ~ '^[A-Za-z0-9_-]+$'
    )
);

-- ------------------------------------------------------------------------------
-- 2. Create Performance & Lookup Indexes
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_employees_department_id ON employees(department_id);
CREATE INDEX IF NOT EXISTS idx_employees_employment_status ON employees(employment_status);
CREATE INDEX IF NOT EXISTS idx_employees_joining_date ON employees(joining_date DESC);

-- ------------------------------------------------------------------------------
-- 3. Create Trigger for 'updated_at' Auto-Update
-- ------------------------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_employees_updated_at ON employees;
CREATE TRIGGER trg_employees_updated_at
BEFORE UPDATE ON employees
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 4. Comments & Documentation
-- ------------------------------------------------------------------------------
COMMENT ON TABLE employees IS 'Primary employee profiles table holding personal info, HR lifecycle, and organizational linkages.';
COMMENT ON COLUMN employees.id IS 'Unique identifier for the employee record (UUID).';
COMMENT ON COLUMN employees.user_id IS '1:1 foreign key reference to authentication user account (users.id).';
COMMENT ON COLUMN employees.employee_code IS 'Unique institutional identifier/code for the employee (e.g., EMP001).';
COMMENT ON COLUMN employees.first_name IS 'Employee legal first name.';
COMMENT ON COLUMN employees.last_name IS 'Employee legal last name.';
COMMENT ON COLUMN employees.date_of_birth IS 'Employee birth date for verification and records.';
COMMENT ON COLUMN employees.gender IS 'Employee gender identity (MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY).';
COMMENT ON COLUMN employees.phone IS 'Contact phone number for communication.';
COMMENT ON COLUMN employees.address IS 'Primary residential street address.';
COMMENT ON COLUMN employees.city IS 'City of residence.';
COMMENT ON COLUMN employees.state IS 'State/Province of residence.';
COMMENT ON COLUMN employees.postal_code IS 'Postal or ZIP code.';
COMMENT ON COLUMN employees.job_title IS 'Official organizational designation or role title.';
COMMENT ON COLUMN employees.department_id IS 'N:1 foreign key reference to assigned organizational department (departments.id).';
COMMENT ON COLUMN employees.joining_date IS 'Official commencement date of employment.';
COMMENT ON COLUMN employees.employment_status IS 'HR employment lifecycle state (ACTIVE, INACTIVE, ON_NOTICE, TERMINATED).';
COMMENT ON COLUMN employees.profile_picture_url IS 'External storage URL or relative path to employee avatar image.';
COMMENT ON COLUMN employees.emergency_contact_name IS 'Name of designated emergency contact person.';
COMMENT ON COLUMN employees.emergency_contact_phone IS 'Contact phone number for designated emergency contact.';
