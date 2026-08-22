-- ==============================================================================
-- Project: Dayflow - Human Resource Management System (HRMS)
-- Tagline: Every workday, perfectly aligned.
-- Database: PostgreSQL
-- Database Name: dayflow
-- Current Module: MODULE 4 — EMPLOYEES (COMPLETED)
-- Next Module: MODULE 5 — ATTENDANCE
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

-- ==============================================================================
-- PLANNED DATABASE MODULES SPECIFICATION
-- ==============================================================================
--
-- 1. MODULE: users [STATUS: IMPLEMENTED in Module 2]
-- 2. MODULE: departments [STATUS: IMPLEMENTED in Module 3]
-- 3. MODULE: employees [STATUS: IMPLEMENTED in Module 4]
--
-- 4. MODULE: attendance [STATUS: NEXT - Module 5]
--    Purpose: Daily time tracking, shift management, and punctuality logging.
--    Scope:
--      - Daily attendance records linked to employees.
--      - Clock-in and clock-out timestamps with geographic/IP coordinates if enabled.
--      - Shift schedules, work duration calculations, overtime tracking.
--      - Status categorizations (PRESENT, ABSENT, HALF_DAY, LATE, ON_LEAVE).
--
-- 5. MODULE: leave_types [STATUS: PLANNED - Module 6]
--    Purpose: Configuration of organization-wide leave policies.
--    Scope:
--      - Leave type names (e.g., Annual Leave, Sick Leave, Maternity, Paternity, Casual).
--      - Allocation allowances per calendar/fiscal year.
--      - Policy flags (paid vs. unpaid, carry-forward eligibility, encashment limits).
--
-- 6. MODULE: leave_requests [STATUS: PLANNED - Module 7]
--    Purpose: Leave application lifecycle and approval workflows.
--    Scope:
--      - Application submissions (employee, leave_type, start_date, end_date, reason).
--      - Workflow state tracking (PENDING, APPROVED, REJECTED, CANCELLED).
--      - Approval hierarchy logs (manager review notes, approver employee ID, action timestamp).
--
-- 7. MODULE: payroll [STATUS: PLANNED - Module 8]
--    Purpose: Compensation structures, recurring salary processing, and payslip generation.
--    Scope:
--      - Salary structure definitions (base salary, fixed allowances, tax deductions).
--      - Monthly pay run batches and processing states (DRAFT, CALCULATED, APPROVED, DISBURSED).
--      - Itemized payslip records (gross earnings, statutory deductions, net payable).
--      - Bank account details and payment disbursement references.
--
-- 8. MODULE: notifications [STATUS: PLANNED - Module 9]
--    Purpose: System alerts, notifications, and event broadcasts.
--    Scope:
--      - Targeted recipient user/employee IDs.
--      - Notification categories (SYSTEM, LEAVE, ATTENDANCE, PAYROLL, ANNOUNCEMENT).
--      - Delivery channel statuses (IN_APP, EMAIL, SMS, PUSH) and read/unread flags.
--      - Actionable deep-links and rich message payload content.
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
