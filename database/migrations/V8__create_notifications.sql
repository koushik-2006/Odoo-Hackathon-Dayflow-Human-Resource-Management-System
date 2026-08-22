-- ==============================================================================
-- Migration: V8__create_notifications.sql
-- Module: MODULE 9 — NOTIFICATIONS
-- Project: Dayflow - Human Resource Management System (HRMS)
-- Description:
-- Creates the user in-app notifications and alerts table 'notifications' with:
--   - 1:N relationship from users (notifications.user_id -> users.id)
--   - Notification categories (LEAVE_APPLIED, LEAVE_APPROVED, LEAVE_REJECTED,
--     ATTENDANCE_REMINDER, ATTENDANCE_ALERT, PAYROLL_PROCESSED, PAYROLL_PAID, GENERAL)
--   - Application-level polymorphic referencing (reference_type, reference_id)
--   - Read/unread tracking (is_read BOOLEAN, read_at TIMESTAMPTZ)
--   - Optimized indexes for unread badge counts and chronological feeds
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Create 'notifications' Table
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

    -- Foreign Key Constraint (User Account Ownership)
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE,

    -- Type and Reference Validation
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

    -- Non-Empty Text Validation
    CONSTRAINT chk_notifications_title CHECK (
        LENGTH(TRIM(title)) > 0
    ),
    CONSTRAINT chk_notifications_message CHECK (
        LENGTH(TRIM(message)) > 0
    )
);

-- ------------------------------------------------------------------------------
-- 2. Create Performance & Feed Indexes
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON notifications(user_id, created_at DESC);

-- ------------------------------------------------------------------------------
-- 3. Create Trigger for 'updated_at' Auto-Update
-- ------------------------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_notifications_updated_at ON notifications;
CREATE TRIGGER trg_notifications_updated_at
BEFORE UPDATE ON notifications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 4. Comments & Documentation
-- ------------------------------------------------------------------------------
COMMENT ON TABLE notifications IS 'User in-app notifications, event alerts, read statuses, and application entity references.';
COMMENT ON COLUMN notifications.id IS 'Unique identifier for the notification (UUID).';
COMMENT ON COLUMN notifications.user_id IS 'Foreign key reference to recipient user account (users.id).';
COMMENT ON COLUMN notifications.type IS 'Standardized notification category code.';
COMMENT ON COLUMN notifications.title IS 'Short headline / subject summary.';
COMMENT ON COLUMN notifications.message IS 'Detailed descriptive body text.';
COMMENT ON COLUMN notifications.reference_type IS 'Application-level entity classifier (LEAVE_REQUEST, ATTENDANCE, PAYROLL, GENERAL).';
COMMENT ON COLUMN notifications.reference_id IS 'UUID identifier of related domain record (application-level validation).';
COMMENT ON COLUMN notifications.is_read IS 'Read state boolean flag (FALSE = unread, TRUE = read).';
COMMENT ON COLUMN notifications.read_at IS 'Timestamp with time zone when user viewed/read notification.';
