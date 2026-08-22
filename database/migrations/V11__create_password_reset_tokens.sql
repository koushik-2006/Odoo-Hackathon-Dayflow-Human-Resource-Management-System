-- ==============================================================================
-- Migration: V11__create_password_reset_tokens.sql
-- Module: MODULE 12 — PASSWORD RESET TOKENS / ACCOUNT RECOVERY
-- Project: Dayflow - Human Resource Management System (HRMS)
-- Description:
-- Creates the secure self-service account recovery table 'password_reset_tokens' with:
--   - 1:N relationship from users (password_reset_tokens.user_id -> users.id, ON DELETE CASCADE)
--   - Cryptographic token hash storage (token_hash VARCHAR(255) NOT NULL, zero plaintext tokens)
--   - Time-to-live expiration enforcement (expires_at TIMESTAMPTZ NOT NULL)
--   - Single-use consumption tracking (used_at TIMESTAMPTZ NULL)
--   - Explicit invalidation / revocation tracking (revoked_at TIMESTAMPTZ NULL)
--   - Automatic timestamp maintenance trigger (trg_password_reset_tokens_updated_at)
--   - High-performance query indexes for user lookups, token validation, and TTL cleanup
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Create 'password_reset_tokens' Table
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

    -- Foreign Key Constraint (Cascades deletion when a user account is removed)
    CONSTRAINT fk_password_reset_tokens_user FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE,

    -- Token Hash Validation
    CONSTRAINT chk_password_reset_tokens_hash CHECK (
        LENGTH(TRIM(token_hash)) > 0
    )
);

-- ------------------------------------------------------------------------------
-- 2. Create Performance & Validation Query Indexes
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token_hash ON password_reset_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_active ON password_reset_tokens(user_id, expires_at);

-- ------------------------------------------------------------------------------
-- 3. Create 'updated_at' Timestamp Automation Trigger
-- ------------------------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_password_reset_tokens_updated_at ON password_reset_tokens;
CREATE TRIGGER trg_password_reset_tokens_updated_at
BEFORE UPDATE ON password_reset_tokens
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 4. Comments & Documentation
-- ------------------------------------------------------------------------------
COMMENT ON TABLE password_reset_tokens IS 'Secure persistence for hashed self-service password reset verification tokens and lifecycle states.';
COMMENT ON COLUMN password_reset_tokens.id IS 'Unique identifier for the password reset record (UUID).';
COMMENT ON COLUMN password_reset_tokens.user_id IS 'Foreign key reference to recipient user account (users.id, ON DELETE CASCADE).';
COMMENT ON COLUMN password_reset_tokens.token_hash IS 'Cryptographic hash (e.g., SHA-256 / bcrypt) of the single-use reset verification token.';
COMMENT ON COLUMN password_reset_tokens.expires_at IS 'Expiration timestamp with time zone after which the token becomes invalid.';
COMMENT ON COLUMN password_reset_tokens.used_at IS 'Timestamp with time zone when the reset token was successfully consumed (NULL if unused).';
COMMENT ON COLUMN password_reset_tokens.revoked_at IS 'Timestamp with time zone when the reset token was explicitly revoked/invalidated (NULL if active).';
COMMENT ON COLUMN password_reset_tokens.created_at IS 'Timestamp with time zone when the password reset request was initiated.';
COMMENT ON COLUMN password_reset_tokens.updated_at IS 'Timestamp with time zone when the record was last modified.';
