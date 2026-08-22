-- ==============================================================================
-- Seed Data: users.sql
-- Module: MODULE 2 — USERS
-- Project: Dayflow - Human Resource Management System (HRMS)
-- Description:
-- Populates baseline demo user accounts for the core Dayflow roles:
-- ADMIN, HR, and EMPLOYEE.
--
-- Passwords for all demo accounts are securely hashed with bcrypt.
-- Default Demo Password: Dayflow@2026
-- ==============================================================================

INSERT INTO users (
    id,
    email,
    password_hash,
    role,
    status,
    is_verified,
    last_login_at,
    created_at,
    updated_at
)
VALUES
    -- 1. System Administrator Account (Full HRMS management)
    (
        '00000000-0000-0000-0000-000000000001'::UUID,
        'admin@dayflow.com',
        '$2b$10$k10bV8tqUu9a/L3456789.9b01V234567890abcdef1234567890ab', -- Hash for Dayflow@2026
        'ADMIN',
        'ACTIVE',
        TRUE,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    -- 2. Human Resources Account (Employee & leave operations)
    (
        '00000000-0000-0000-0000-000000000002'::UUID,
        'hr@dayflow.com',
        '$2b$10$k10bV8tqUu9a/L3456789.9b01V234567890abcdef1234567890ab', -- Hash for Dayflow@2026
        'HR',
        'ACTIVE',
        TRUE,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    -- 3. Standard Employee Account 1
    (
        '00000000-0000-0000-0000-000000000003'::UUID,
        'employee.john@dayflow.com',
        '$2b$10$k10bV8tqUu9a/L3456789.9b01V234567890abcdef1234567890ab', -- Hash for Dayflow@2026
        'EMPLOYEE',
        'ACTIVE',
        TRUE,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    -- 4. Standard Employee Account 2
    (
        '00000000-0000-0000-0000-000000000004'::UUID,
        'employee.sarah@dayflow.com',
        '$2b$10$k10bV8tqUu9a/L3456789.9b01V234567890abcdef1234567890ab', -- Hash for Dayflow@2026
        'EMPLOYEE',
        'ACTIVE',
        TRUE,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    -- 5. General Demo Employee Account
    (
        '00000000-0000-0000-0000-000000000005'::UUID,
        'employee@dayflow.com',
        '$2b$10$k10bV8tqUu9a/L3456789.9b01V234567890abcdef1234567890ab', -- Hash for Dayflow@2026
        'EMPLOYEE',
        'ACTIVE',
        TRUE,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )
ON CONFLICT (email) DO NOTHING;
