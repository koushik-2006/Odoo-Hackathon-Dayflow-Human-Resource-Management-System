-- ==============================================================================
-- Project: Dayflow - Human Resource Management System (HRMS)
-- Tagline: Every workday, perfectly aligned.
-- Database: PostgreSQL
-- Database Name: dayflow
-- Current Module: MODULE 7 — LEAVE REQUESTS (COMPLETED)
-- Next Module: MODULE 8 — PAYROLL
-- ==============================================================================
-- Description:
-- Master schema definition file for the Dayflow HRMS PostgreSQL database.
-- Contains database-level configuration, extensions, active table schemas,
-- and documents the planned modular schema architecture.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Database-Level Extensions & Prerequisite Configuration
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set standard timezone to UTC for temporal consistency across modules:
SET timezone = 'UTC';

-- ------------------------------------------------------------------------------
-- 2. Helper Functions
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- ACTIVE TABLES (IMPLEMENTED)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- MODULE 2: users
-- Purpose: Authentication, credentials, role (ADMIN, HR, EMPLOYEE), and account state.
-- Architecture Note: Decoupled from personal profiles (1:1 with employees table).
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'EMPLOYEE',
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    last_login_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_users_role CHECK (
        role IN ('ADMIN', 'HR', 'EMPLOYEE')
    ),
    CONSTRAINT chk_users_status CHECK (
        status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION')
    ),
    CONSTRAINT uq_users_email UNIQUE (email)
);

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- MODULE 3: departments
-- Purpose: Organizational business units, normalized codes, and soft-deactivation.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL,
    description TEXT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_departments_name UNIQUE (name),
    CONSTRAINT uq_departments_code UNIQUE (code),
    CONSTRAINT chk_departments_code_format CHECK (
        code = UPPER(TRIM(code)) AND LENGTH(TRIM(code)) >= 2 AND code ~ '^[A-Z0-9_-]+$'
    ),
    CONSTRAINT chk_departments_name_not_empty CHECK (
        LENGTH(TRIM(name)) > 0
    )
);

CREATE INDEX IF NOT EXISTS idx_departments_is_active ON departments(is_active);

DROP TRIGGER IF EXISTS trg_departments_updated_at ON departments;
CREATE TRIGGER trg_departments_updated_at
BEFORE UPDATE ON departments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- MODULE 4: employees
-- Purpose: Employee personal profiles, HR lifecycle, job details, and linkages.
-- Relationships:
--   - users (1 : 1): employees.user_id -> users.id (UNIQUE NOT NULL)
--   - departments (N : 1): employees.department_id -> departments.id (NULLABLE)
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

    CONSTRAINT uq_employees_user_id UNIQUE (user_id),
    CONSTRAINT uq_employees_employee_code UNIQUE (employee_code),
    CONSTRAINT fk_employees_user FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_employees_department FOREIGN KEY (department_id)
        REFERENCES departments (id)
        ON DELETE RESTRICT,
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

CREATE INDEX IF NOT EXISTS idx_employees_department_id ON employees(department_id);
CREATE INDEX IF NOT EXISTS idx_employees_employment_status ON employees(employment_status);
CREATE INDEX IF NOT EXISTS idx_employees_joining_date ON employees(joining_date DESC);

DROP TRIGGER IF EXISTS trg_employees_updated_at ON employees;
CREATE TRIGGER trg_employees_updated_at
BEFORE UPDATE ON employees
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- MODULE 5: attendance
-- Purpose: Daily employee time tracking, check-in/out, status, and work hours.
-- Relationships:
--   - employees (N : 1): attendance.employee_id -> employees.id (NOT NULL)
-- Cardinality & Rules:
--   - One employee has at most ONE record per calendar date: UNIQUE(employee_id, attendance_date)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL,
    attendance_date DATE NOT NULL,
    check_in TIMESTAMPTZ NULL,
    check_out TIMESTAMPTZ NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PRESENT',
    working_minutes INTEGER NULL,
    remarks TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_attendance_employee_date UNIQUE (employee_id, attendance_date),
    CONSTRAINT fk_attendance_employee FOREIGN KEY (employee_id)
        REFERENCES employees (id)
        ON DELETE RESTRICT,
    CONSTRAINT chk_attendance_status CHECK (
        status IN ('PRESENT', 'ABSENT', 'HALF_DAY', 'LEAVE')
    ),
    CONSTRAINT chk_attendance_checkout CHECK (
        check_out IS NULL OR check_in IS NULL OR check_out >= check_in
    ),
    CONSTRAINT chk_attendance_working_minutes CHECK (
        working_minutes IS NULL OR working_minutes >= 0
    )
);

CREATE INDEX IF NOT EXISTS idx_attendance_employee_id ON attendance(employee_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(attendance_date DESC);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON attendance(status);

DROP TRIGGER IF EXISTS trg_attendance_updated_at ON attendance;
CREATE TRIGGER trg_attendance_updated_at
BEFORE UPDATE ON attendance
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- MODULE 6: leave_types
-- Purpose: Master organization-wide leave categories, paid flags, and baseline days.
-- Characteristics: Master/reference table (generic, no employee-specific data).
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

    CONSTRAINT uq_leave_types_code UNIQUE (code),
    CONSTRAINT uq_leave_types_name UNIQUE (name),
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

CREATE INDEX IF NOT EXISTS idx_leave_types_is_active ON leave_types(is_active);

DROP TRIGGER IF EXISTS trg_leave_types_updated_at ON leave_types;
CREATE TRIGGER trg_leave_types_updated_at
BEFORE UPDATE ON leave_types
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- MODULE 7: leave_requests
-- Purpose: Employee leave applications, workflow statuses, and approval logs.
-- Relationships:
--   - employees (N : 1): leave_requests.employee_id -> employees.id (NOT NULL, RESTRICT)
--   - leave_types (N : 1): leave_requests.leave_type_id -> leave_types.id (NOT NULL, RESTRICT)
--   - users (N : 1): leave_requests.reviewer_id -> users.id (NULLABLE, SET NULL)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL,
    leave_type_id UUID NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    reviewer_id UUID NULL,
    reviewer_comment TEXT NULL,
    reviewed_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_leave_requests_employee FOREIGN KEY (employee_id)
        REFERENCES employees (id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_leave_requests_leave_type FOREIGN KEY (leave_type_id)
        REFERENCES leave_types (id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_leave_requests_reviewer FOREIGN KEY (reviewer_id)
        REFERENCES users (id)
        ON DELETE SET NULL,
    CONSTRAINT chk_leave_requests_date_range CHECK (
        end_date >= start_date
    ),
    CONSTRAINT chk_leave_requests_reason CHECK (
        LENGTH(TRIM(reason)) > 0
    ),
    CONSTRAINT chk_leave_requests_status CHECK (
        status IN ('PENDING', 'APPROVED', 'REJECTED')
    )
);

CREATE INDEX IF NOT EXISTS idx_leave_requests_employee_id ON leave_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_leave_type_id ON leave_requests(leave_type_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON leave_requests(status);
CREATE INDEX IF NOT EXISTS idx_leave_requests_start_date ON leave_requests(start_date DESC);
CREATE INDEX IF NOT EXISTS idx_leave_requests_employee_status ON leave_requests(employee_id, status);

DROP TRIGGER IF EXISTS trg_leave_requests_updated_at ON leave_requests;
CREATE TRIGGER trg_leave_requests_updated_at
BEFORE UPDATE ON leave_requests
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- PLANNED DATABASE MODULES SPECIFICATION
-- ==============================================================================
--
-- 1. MODULE: users [STATUS: IMPLEMENTED in Module 2]
-- 2. MODULE: departments [STATUS: IMPLEMENTED in Module 3]
-- 3. MODULE: employees [STATUS: IMPLEMENTED in Module 4]
-- 4. MODULE: attendance [STATUS: IMPLEMENTED in Module 5]
-- 5. MODULE: leave_types [STATUS: IMPLEMENTED in Module 6]
-- 6. MODULE: leave_requests [STATUS: IMPLEMENTED in Module 7]
--
-- 7. MODULE: payroll [STATUS: NEXT - Module 8]
--    Purpose: Employee salary structure, periodic pay runs, allowances, and deductions.
--    Scope:
--      - Salary components: Basic pay, HRA, Transport, Medical, Special allowances.
--      - Statutory and custom deductions: Income Tax / TDS, PF, insurance.
--      - Pay period start/end dates, gross pay, net pay, and currency.
--      - Pay slip generation metadata and payment execution statuses.
--
-- 8. MODULE: notifications [STATUS: PLANNED - Module 9]
--    Purpose: In-app user notifications and workflow event alerts.
--    Scope:
--      - Notification delivery payload (type, title, message, link).
--      - Read status tracking (is_read, read_at).
--      - Recipient user linkage (users.id) and category filtering.
--
-- 9. MODULE: documents [STATUS: PLANNED - Module 10]
--    Purpose: Centralized employee document repository and HR policy files.
--    Scope:
--      - Document metadata (title, category: ID_PROOF, CONTRACT, CERTIFICATION, POLICY).
--      - Secure storage references / object storage URLs.
--      - Verification status (PENDING_VERIFICATION, VERIFIED, REJECTED).
--      - Access control tags and expiration tracking.
--
-- 10. MODULE: password_reset_tokens [STATUS: PLANNED - Module 11]
--     Purpose: Secure self-service account recovery.
--     Scope:
--       - Secure, hashed one-time verification tokens.
--       - Expiration timestamps (time-to-live restrictions).
--       - Consumption status (USED, EXPIRED, REVOKED) and request origin metadata.
--
-- 11. MODULE: audit_logs [STATUS: PLANNED - Module 12]
--     Purpose: Comprehensive compliance, security, and activity tracking.
--     Scope:
--       - Actor tracking (user ID, session ID, client IP address, user agent).
--       - Action descriptors (CREATE, UPDATE, DELETE, LOGIN, EXPORT, PERMISSION_CHANGE).
--       - Target resource name and entity identifier.
--       - Structured JSON change payloads (before/after snapshots).
--       - Immutable, append-only records with microsecond timestamps.
-- ==============================================================================
