-- ==============================================================================
-- Project: Dayflow - Human Resource Management System (HRMS)
-- Tagline: Every workday, perfectly aligned.
-- Database: PostgreSQL
-- Database Name: dayflow
-- Current Status: ALL MODULES (1–12) FULLY IMPLEMENTED & COMPLETE
-- ==============================================================================
-- Description:
-- Master schema definition file for the Dayflow HRMS PostgreSQL database.
-- Contains database-level configuration, extensions, active table schemas,
-- foreign key relationships, triggers, indexes, and security architectural constraints.
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
-- ACTIVE TABLES (MODULES 2–12)
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

-- ------------------------------------------------------------------------------
-- MODULE 8: payroll
-- Purpose: Periodic employee compensation, allowances, deductions, and payment status.
-- Relationships:
--   - employees (N : 1): payroll.employee_id -> employees.id (NOT NULL, RESTRICT)
-- Cardinality & Rules:
--   - One employee has at most ONE payroll record per exact pay cycle:
--     UNIQUE(employee_id, pay_period_start, pay_period_end)
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

    CONSTRAINT fk_payroll_employee FOREIGN KEY (employee_id)
        REFERENCES employees (id)
        ON DELETE RESTRICT,
    CONSTRAINT uq_payroll_employee_period UNIQUE (employee_id, pay_period_start, pay_period_end),
    CONSTRAINT chk_payroll_period CHECK (
        pay_period_end >= pay_period_start
    ),
    CONSTRAINT chk_payroll_currency CHECK (
        currency ~ '^[A-Z]{3}$'
    ),
    CONSTRAINT chk_payroll_status CHECK (
        status IN ('DRAFT', 'PROCESSED', 'PAID', 'CANCELLED')
    ),
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

CREATE INDEX IF NOT EXISTS idx_payroll_employee_id ON payroll(employee_id);
CREATE INDEX IF NOT EXISTS idx_payroll_status ON payroll(status);
CREATE INDEX IF NOT EXISTS idx_payroll_payment_date ON payroll(payment_date);
CREATE INDEX IF NOT EXISTS idx_payroll_period_start ON payroll(pay_period_start DESC);
CREATE INDEX IF NOT EXISTS idx_payroll_employee_status ON payroll(employee_id, status);

DROP TRIGGER IF EXISTS trg_payroll_updated_at ON payroll;
CREATE TRIGGER trg_payroll_updated_at
BEFORE UPDATE ON payroll
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- MODULE 9: notifications
-- Purpose: User in-app notifications, event alerts, read state, and reference links.
-- Relationships:
--   - users (N : 1): notifications.user_id -> users.id (NOT NULL, CASCADE)
-- Architecture Note:
--   - Polymorphic referencing (reference_type + reference_id) is managed at the
--     application level rather than via hard database foreign keys.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    reference_type VARCHAR(50) NULL,
    reference_id UUID NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE,
    CONSTRAINT chk_notifications_type CHECK (
        type IN (
            'LEAVE_APPLIED',
            'LEAVE_APPROVED',
            'LEAVE_REJECTED',
            'ATTENDANCE_REMINDER',
            'ATTENDANCE_ALERT',
            'PAYROLL_PROCESSED',
            'PAYROLL_PAID',
            'GENERAL'
        )
    ),
    CONSTRAINT chk_notifications_reference_type CHECK (
        reference_type IS NULL OR reference_type IN (
            'LEAVE_REQUEST',
            'ATTENDANCE',
            'PAYROLL',
            'GENERAL'
        )
    ),
    CONSTRAINT chk_notifications_title CHECK (
        LENGTH(TRIM(title)) > 0
    ),
    CONSTRAINT chk_notifications_message CHECK (
        LENGTH(TRIM(message)) > 0
    )
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON notifications(user_id, created_at DESC);

DROP TRIGGER IF EXISTS trg_notifications_updated_at ON notifications;
CREATE TRIGGER trg_notifications_updated_at
BEFORE UPDATE ON notifications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- MODULE 10: documents
-- Purpose: Employee document metadata, file storage locations, and verification review.
-- Relationships:
--   - employees (N : 1): documents.employee_id -> employees.id (NOT NULL, CASCADE)
--   - users (N : 1): documents.uploaded_by -> users.id (NOT NULL, RESTRICT)
--   - users (N : 1): documents.verified_by -> users.id (NULLABLE, SET NULL)
-- Architecture Note:
--   - Stores file metadata and storage URLs only. Actual binary payloads are stored
--     in external object storage (S3/Cloudinary/Local disk) and not in PostgreSQL.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    document_name VARCHAR(200) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    description TEXT NULL,
    verification_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    uploaded_by UUID NOT NULL,
    verified_by UUID NULL,
    verified_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_documents_employee FOREIGN KEY (employee_id)
        REFERENCES employees (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_documents_uploaded_by FOREIGN KEY (uploaded_by)
        REFERENCES users (id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_documents_verified_by FOREIGN KEY (verified_by)
        REFERENCES users (id)
        ON DELETE SET NULL,
    CONSTRAINT chk_documents_type CHECK (
        document_type IN (
            'ID_PROOF',
            'ADDRESS_PROOF',
            'OFFER_LETTER',
            'EMPLOYMENT_CONTRACT',
            'RESUME',
            'EDUCATION_CERTIFICATE',
            'EXPERIENCE_CERTIFICATE',
            'SALARY_SLIP',
            'OTHER'
        )
    ),
    CONSTRAINT chk_documents_verification_status CHECK (
        verification_status IN (
            'PENDING',
            'VERIFIED',
            'REJECTED'
        )
    ),
    CONSTRAINT chk_documents_document_name CHECK (
        LENGTH(TRIM(document_name)) > 0
    ),
    CONSTRAINT chk_documents_file_name CHECK (
        LENGTH(TRIM(file_name)) > 0
    ),
    CONSTRAINT chk_documents_file_url CHECK (
        LENGTH(TRIM(file_url)) > 0
    ),
    CONSTRAINT chk_documents_mime_type CHECK (
        LENGTH(TRIM(mime_type)) > 0
    ),
    CONSTRAINT chk_documents_file_size CHECK (
        file_size > 0
    )
);

CREATE INDEX IF NOT EXISTS idx_documents_employee_id ON documents(employee_id);
CREATE INDEX IF NOT EXISTS idx_documents_document_type ON documents(document_type);
CREATE INDEX IF NOT EXISTS idx_documents_verification_status ON documents(verification_status);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_by ON documents(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_documents_employee_status ON documents(employee_id, verification_status);

DROP TRIGGER IF EXISTS trg_documents_updated_at ON documents;
CREATE TRIGGER trg_documents_updated_at
BEFORE UPDATE ON documents
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- MODULE 11: audit_logs
-- Purpose: Immutable activity and security audit trail across all Dayflow entities.
-- Relationships:
--   - users (N : 1): audit_logs.user_id -> users.id (NULLABLE, SET NULL)
-- Characteristics:
--   - Append-only immutable ledger. No update or delete triggers.
--   - Captures actor, action, target resource, JSONB old/new values, IP, and user-agent.
--   - Security: Strictly excludes passwords, hashes, tokens, API keys, or credentials.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NULL,
    entity_id UUID NULL,
    description TEXT NULL,
    old_values JSONB NULL,
    new_values JSONB NULL,
    ip_address INET NULL,
    user_agent TEXT NULL,
    request_id VARCHAR(100) NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_audit_logs_user FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE SET NULL,
    CONSTRAINT chk_audit_logs_action CHECK (
        LENGTH(TRIM(action)) > 0
    ),
    CONSTRAINT chk_audit_logs_entity_type CHECK (
        entity_type IS NULL OR LENGTH(TRIM(entity_type)) > 0
    )
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_id ON audit_logs(entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_created ON audit_logs(user_id, created_at DESC);

-- ------------------------------------------------------------------------------
-- MODULE 12: password_reset_tokens
-- Purpose: Secure self-service account recovery token management and verification.
-- Relationships:
--   - users (N : 1): password_reset_tokens.user_id -> users.id (NOT NULL, CASCADE)
-- Architecture Note:
--   - Stores cryptographic token hashes (SHA-256 / bcrypt) only.
--   - Raw tokens are transmitted to the user's email and NEVER persisted in PostgreSQL.
--   - Active tokens satisfy: used_at IS NULL AND revoked_at IS NULL AND expires_at > CURRENT_TIMESTAMP.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ NULL,
    revoked_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_password_reset_tokens_user FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE,
    CONSTRAINT chk_password_reset_tokens_hash CHECK (
        LENGTH(TRIM(token_hash)) > 0
    )
);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token_hash ON password_reset_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_active ON password_reset_tokens(user_id, expires_at);

DROP TRIGGER IF EXISTS trg_password_reset_tokens_updated_at ON password_reset_tokens;
CREATE TRIGGER trg_password_reset_tokens_updated_at
BEFORE UPDATE ON password_reset_tokens
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- DATABASE IMPLEMENTATION STATUS SUMMARY
-- ==============================================================================
--
-- 1.  MODULE 1:  Database Foundation        [STATUS: COMPLETE]
-- 2.  MODULE 2:  users                      [STATUS: COMPLETE]
-- 3.  MODULE 3:  departments                [STATUS: COMPLETE]
-- 4.  MODULE 4:  employees                  [STATUS: COMPLETE]
-- 5.  MODULE 5:  attendance                 [STATUS: COMPLETE]
-- 6.  MODULE 6:  leave_types                [STATUS: COMPLETE]
-- 7.  MODULE 7:  leave_requests             [STATUS: COMPLETE]
-- 8.  MODULE 8:  payroll                    [STATUS: COMPLETE]
-- 9.  MODULE 9:  notifications              [STATUS: COMPLETE]
-- 10. MODULE 10: documents                  [STATUS: COMPLETE]
-- 11. MODULE 11: audit_logs                 [STATUS: COMPLETE]
-- 12. MODULE 12: password_reset_tokens      [STATUS: COMPLETE]
-- ==============================================================================
