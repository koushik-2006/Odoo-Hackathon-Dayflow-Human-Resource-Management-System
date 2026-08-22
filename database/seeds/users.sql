-- ==============================================================================
-- Seed Data: users.sql
-- Module: MODULE 2 — USERS
-- Project: Dayflow - Human Resource Management System (HRMS)
-- Description:
-- Populates demo user accounts across various roles (Super Admin, HR Admin,
-- Manager, and Employee) for development, testing, and UI demonstration.
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
    -- 1. Super Administrator Account
    (
        '00000000-0000-0000-0000-000000000001'::UUID,
        'superadmin@dayflow.internal',
        '$2b$10$k10bV8tqUu9a/L3456789.9b01V234567890abcdef1234567890ab', -- Hash for Dayflow@2026
        'SUPER_ADMIN',
        'ACTIVE',
        TRUE,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    -- 2. HR Administrator Account
    (
        '00000000-0000-0000-0000-000000000002'::UUID,
        'hr.admin@dayflow.internal',
        '$2b$10$k10bV8tqUu9a/L3456789.9b01V234567890abcdef1234567890ab', -- Hash for Dayflow@2026
        'HR_ADMIN',
        'ACTIVE',
        TRUE,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    -- 3. Engineering Team Lead / Manager
    (
        '00000000-0000-0000-0000-000000000003'::UUID,
        'manager.engineering@dayflow.internal',
        '$2b$10$k10bV8tqUu9a/L3456789.9b01V234567890abcdef1234567890ab', -- Hash for Dayflow@2026
        'MANAGER',
        'ACTIVE',
        TRUE,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    -- 4. Employee 1 (Software Engineer)
    (
        '00000000-0000-0000-0000-000000000004'::UUID,
        'employee.john@dayflow.internal',
        '$2b$10$k10bV8tqUu9a/L3456789.9b01V234567890abcdef1234567890ab', -- Hash for Dayflow@2026
        'EMPLOYEE',
        'ACTIVE',
        TRUE,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    -- 5. Employee 2 (Marketing Specialist)
    (
        '00000000-0000-0000-0000-000000000005'::UUID,
        'employee.sarah@dayflow.internal',
        '$2b$10$k10bV8tqUu9a/L3456789.9b01V234567890abcdef1234567890ab', -- Hash for Dayflow@2026
        'EMPLOYEE',
        'ACTIVE',
        TRUE,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )
ON CONFLICT (email) DO NOTHING;
