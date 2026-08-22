-- ==============================================================================
-- Seed Data: password_reset_tokens.sql
-- Module: MODULE 12 — PASSWORD RESET TOKENS / ACCOUNT RECOVERY
-- Project: Dayflow - Human Resource Management System (HRMS)
-- Description:
-- Populates baseline deterministic demo password reset verification records across
-- all 4 primary lifecycle states:
--   1. ACTIVE  - Unexpired, unused, unrevoked token awaiting consumption
--   2. EXPIRED - Timestamp exceeded expiration threshold without consumption
--   3. USED    - Successfully consumed token with recorded used_at timestamp
--   4. REVOKED - Explicitly invalidated / superseded token with revoked_at timestamp
--
-- Foreign Key Dependency:
--   - users (user_id): References existing user accounts in 'users.sql' (CASCADE on delete)
-- Security Rules:
--   - Stores ONLY deterministic synthetic cryptographic hashes (SHA-256 mock hashes).
--   - ZERO storage of plaintext verification tokens.
-- ==============================================================================

INSERT INTO password_reset_tokens (
    id,
    user_id,
    token_hash,
    expires_at,
    used_at,
    revoked_at,
    created_at,
    updated_at
)
VALUES
    -- 1. ACTIVE Reset Token (John Doe - Valid until future date, unused)
    (
        'a0000000-0000-0000-0000-000000000001'::UUID,
        '00000000-0000-0000-0000-000000000003'::UUID,
        'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        '2026-12-31 23:59:59+00',
        NULL,
        NULL,
        '2026-08-22 08:00:00+00',
        '2026-08-22 08:00:00+00'
    ),
    -- 2. EXPIRED Reset Token (Sarah Connor - Expiration threshold exceeded)
    (
        'a0000000-0000-0000-0000-000000000002'::UUID,
        '00000000-0000-0000-0000-000000000004'::UUID,
        '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
        '2026-08-01 12:00:00+00',
        NULL,
        NULL,
        '2026-08-01 11:00:00+00',
        '2026-08-01 11:00:00+00'
    ),
    -- 3. USED Reset Token (David Miller - Successfully consumed and password changed)
    (
        'a0000000-0000-0000-0000-000000000003'::UUID,
        '00000000-0000-0000-0000-000000000005'::UUID,
        '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
        '2026-08-10 15:00:00+00',
        '2026-08-10 14:25:30+00',
        NULL,
        '2026-08-10 14:00:00+00',
        '2026-08-10 14:25:30+00'
    ),
    -- 4. REVOKED Reset Token (John Doe - Superseded by subsequent request)
    (
        'a0000000-0000-0000-0000-000000000004'::UUID,
        '00000000-0000-0000-0000-000000000003'::UUID,
        'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
        '2026-08-20 18:00:00+00',
        NULL,
        '2026-08-20 17:30:00+00',
        '2026-08-20 17:00:00+00',
        '2026-08-20 17:30:00+00'
    )
ON CONFLICT (id) DO NOTHING;
