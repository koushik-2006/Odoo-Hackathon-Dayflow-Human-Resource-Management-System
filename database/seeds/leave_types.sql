-- ==============================================================================
-- Seed Data: leave_types.sql
-- Module: MODULE 6 — LEAVE TYPES
-- Project: Dayflow - Human Resource Management System (HRMS)
-- Description:
-- Populates baseline master leave categories (Paid Leave, Sick Leave, Unpaid Leave)
-- with standard entitlements and deterministic UUIDs for development, testing, and UI.
-- ==============================================================================

INSERT INTO leave_types (
    id,
    code,
    name,
    description,
    is_paid,
    default_days,
    is_active,
    created_at,
    updated_at
)
VALUES
    -- 1. Paid Leave (Annual / Vacation Leave)
    (
        '40000000-0000-0000-0000-000000000001'::UUID,
        'PAID',
        'Paid Leave',
        'Standard paid annual leave allowance for vacation and personal rest.',
        TRUE,
        20,
        TRUE,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    -- 2. Sick Leave (Medical Time Off)
    (
        '40000000-0000-0000-0000-000000000002'::UUID,
        'SICK',
        'Sick Leave',
        'Compensated medical leave for personal health, illness, or medical appointments.',
        TRUE,
        10,
        TRUE,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    -- 3. Unpaid Leave (Uncompensated Time Off)
    (
        '40000000-0000-0000-0000-000000000003'::UUID,
        'UNPAID',
        'Unpaid Leave',
        'Uncompensated time off for extended personal absences or emergency leaves.',
        FALSE,
        0,
        TRUE,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )
ON CONFLICT (code) DO UPDATE
SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    is_paid = EXCLUDED.is_paid,
    default_days = EXCLUDED.default_days,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;
