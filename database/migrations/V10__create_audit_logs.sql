-- ==============================================================================
-- Migration: V10__create_audit_logs.sql
-- Module: MODULE 11 — AUDIT LOGS
-- Project: Dayflow - Human Resource Management System (HRMS)
-- Description:
-- Creates the immutable system activity and security audit trail table 'audit_logs' with:
--   - 1:N relationship from users (audit_logs.user_id -> users.id, ON DELETE SET NULL)
--   - Support for system-generated events (user_id NULL)
--   - Structured action categorization (AUTH_*, USER_*, EMPLOYEE_*, ATTENDANCE_*,
--     LEAVE_*, PAYROLL_*, DOCUMENT_*, NOTIFICATION_*, SYSTEM_ACTION)
--   - Target resource classification (entity_type, entity_id)
--   - Point-in-time state tracking via JSONB (old_values, new_values)
--   - Client origin metadata (ip_address INET, user_agent TEXT, request_id VARCHAR)
--   - Strict immutability (append-only ledger, no updated_at column or modification triggers)
--   - Security isolation: Zero storage of passwords, credentials, tokens, or private secrets
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Create 'audit_logs' Table
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

    -- Foreign Key Constraint (Preserves audit history even if user account is removed)
    CONSTRAINT fk_audit_logs_user FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE SET NULL,

    -- Action & Entity Validation Checks
    CONSTRAINT chk_audit_logs_action CHECK (
        LENGTH(TRIM(action)) > 0
    ),
    CONSTRAINT chk_audit_logs_entity_type CHECK (
        entity_type IS NULL OR LENGTH(TRIM(entity_type)) > 0
    )
);

-- ------------------------------------------------------------------------------
-- 2. Create Performance & Compliance Query Indexes
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_id ON audit_logs(entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_created ON audit_logs(user_id, created_at DESC);

-- ------------------------------------------------------------------------------
-- 3. Comments & Documentation
-- ------------------------------------------------------------------------------
COMMENT ON TABLE audit_logs IS 'Immutable compliance and activity ledger capturing security, authentication, and HR operational events.';
COMMENT ON COLUMN audit_logs.id IS 'Unique identifier for the audit log record (UUID).';
COMMENT ON COLUMN audit_logs.user_id IS 'Foreign key reference to actor user account (users.id, NULL for automated/system actions).';
COMMENT ON COLUMN audit_logs.action IS 'Standardized action code (e.g. AUTH_LOGIN, LEAVE_APPROVED, PAYROLL_CREATED).';
COMMENT ON COLUMN audit_logs.entity_type IS 'Domain entity resource affected (e.g. USER, EMPLOYEE, LEAVE_REQUEST, PAYROLL, DOCUMENT).';
COMMENT ON COLUMN audit_logs.entity_id IS 'UUID identifier of the specific target entity affected.';
COMMENT ON COLUMN audit_logs.description IS 'Human-readable narrative of the audited activity.';
COMMENT ON COLUMN audit_logs.old_values IS 'JSONB payload capturing non-sensitive entity state before modification.';
COMMENT ON COLUMN audit_logs.new_values IS 'JSONB payload capturing non-sensitive entity state after modification.';
COMMENT ON COLUMN audit_logs.ip_address IS 'Network IP address (IPv4 or IPv6 via PostgreSQL INET) of originating request.';
COMMENT ON COLUMN audit_logs.user_agent IS 'Client HTTP User-Agent header string or origin descriptor.';
COMMENT ON COLUMN audit_logs.request_id IS 'Correlation ID linking multiple audit entries to a single backend request.';
COMMENT ON COLUMN audit_logs.created_at IS 'Immutable timestamp with time zone when the audited action occurred.';
