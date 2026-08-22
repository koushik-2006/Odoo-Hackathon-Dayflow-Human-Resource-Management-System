-- ==============================================================================
-- Migration: V1__create_users.sql
-- Module: MODULE 2 — USERS
-- Project: Dayflow - Human Resource Management System (HRMS)
-- Description:
-- Creates the core authentication and user management table 'users'
-- along with associated roles (ADMIN, HR, EMPLOYEE), status constraints,
-- triggers, and indices.
--
-- NOTE: Employee profile details, employee_code, and department mappings
-- are decoupled and will be implemented in Module 4 (employees table)
-- via a 1:1 relationship (employees.user_id -> users.id).
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Create Helper Function for Automatically Updating 'updated_at' Timestamps
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 2. Create 'users' Table
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

    -- Role and Status Domain Constraints
    CONSTRAINT chk_users_role CHECK (
        role IN ('ADMIN', 'HR', 'EMPLOYEE')
    ),
    CONSTRAINT chk_users_status CHECK (
        status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION')
    ),
    CONSTRAINT uq_users_email UNIQUE (email)
);

-- ------------------------------------------------------------------------------
-- 3. Create Performance & Lookup Indexes
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- ------------------------------------------------------------------------------
-- 4. Create Trigger for 'updated_at' Auto-Update
-- ------------------------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 5. Comments & Documentation
-- ------------------------------------------------------------------------------
COMMENT ON TABLE users IS 'Core authentication table holding user credentials, roles (ADMIN, HR, EMPLOYEE), and account lifecycle status.';
COMMENT ON COLUMN users.id IS 'Unique identifier for the user account (UUID).';
COMMENT ON COLUMN users.email IS 'Unique email address used for login and notifications.';
COMMENT ON COLUMN users.password_hash IS 'Cryptographic hash of the user password (bcrypt/Argon2).';
COMMENT ON COLUMN users.role IS 'User authorization role (ADMIN, HR, EMPLOYEE).';
COMMENT ON COLUMN users.status IS 'Account operational state (ACTIVE, INACTIVE, SUSPENDED, PENDING_VERIFICATION).';
COMMENT ON COLUMN users.is_verified IS 'Boolean flag indicating whether the user has verified their email address.';
COMMENT ON COLUMN users.last_login_at IS 'Timestamp of the user most recent successful authentication.';
