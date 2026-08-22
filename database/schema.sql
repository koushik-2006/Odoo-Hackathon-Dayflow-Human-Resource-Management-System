-- ==============================================================================
-- Project: Dayflow - Human Resource Management System (HRMS)
-- Tagline: Every workday, perfectly aligned.
-- Database: PostgreSQL
-- Database Name: dayflow
-- Current Module: MODULE 2 — USERS
-- ==============================================================================
-- Description:
-- Master schema foundation file for the Dayflow HRMS PostgreSQL database.
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
        role IN ('SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE')
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

-- ==============================================================================
-- PLANNED DATABASE MODULES SPECIFICATION
-- ==============================================================================
--
-- 1. MODULE: users [STATUS: IMPLEMENTED in Module 2]
--
-- 2. MODULE: departments [STATUS: NEXT - Module 3]
--    Purpose: Organizational structure and team hierarchy.
--    Scope:
--      - Department identifiers, codes, and descriptive names.
--      - Hierarchical relationships (parent/child departments).
--      - Department head assignments (linked to employees).
--      - Operational status and budget center codes.
--
-- 3. MODULE: employees [STATUS: PLANNED - Module 4]
--    Purpose: Comprehensive employee profiles and employment lifecycle.
--    Scope:
--      - Primary employee identification (employee code, user reference).
--      - Personal data (first name, last name, date of birth, contact details).
--      - Employment metadata (designation, department reference, manager reference,
--        employment type: FULL_TIME, PART_TIME, CONTRACTOR, join date, exit date).
--      - Address and emergency contact records.
--
-- 4. MODULE: attendance [STATUS: PLANNED - Module 5]
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
