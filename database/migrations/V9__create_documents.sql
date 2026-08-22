-- ==============================================================================
-- Migration: V9__create_documents.sql
-- Module: MODULE 10 — DOCUMENTS
-- Project: Dayflow - Human Resource Management System (HRMS)
-- Description:
-- Creates the employee document metadata table 'documents' with:
--   - 1:N relationship from employees (documents.employee_id -> employees.id, CASCADE)
--   - 1:N relationship from users for uploader (documents.uploaded_by -> users.id, RESTRICT)
--   - 1:N optional relationship from users for verifier (documents.verified_by -> users.id, SET NULL)
--   - Document categorization (ID_PROOF, ADDRESS_PROOF, OFFER_LETTER, EMPLOYMENT_CONTRACT,
--     RESUME, EDUCATION_CERTIFICATE, EXPERIENCE_CERTIFICATE, SALARY_SLIP, OTHER)
--   - Verification lifecycle tracking (PENDING, VERIFIED, REJECTED)
--   - Storage metadata (file_name, file_url, mime_type, file_size > 0 in bytes)
--   - IMPORTANT: Stores metadata and remote/local file pointers only (no BYTEA binary blobs)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Create 'documents' Table
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

    -- Foreign Key Constraints
    CONSTRAINT fk_documents_employee FOREIGN KEY (employee_id)
        REFERENCES employees (id)
        ON DELETE CASCADE,

    CONSTRAINT fk_documents_uploaded_by FOREIGN KEY (uploaded_by)
        REFERENCES users (id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_documents_verified_by FOREIGN KEY (verified_by)
        REFERENCES users (id)
        ON DELETE SET NULL,

    -- Type and Verification Status Domain Checks
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

    -- String & Size Integrity Checks
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

-- ------------------------------------------------------------------------------
-- 2. Create Performance & Lookup Indexes
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_documents_employee_id ON documents(employee_id);
CREATE INDEX IF NOT EXISTS idx_documents_document_type ON documents(document_type);
CREATE INDEX IF NOT EXISTS idx_documents_verification_status ON documents(verification_status);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_by ON documents(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_documents_employee_status ON documents(employee_id, verification_status);

-- ------------------------------------------------------------------------------
-- 3. Create Trigger for 'updated_at' Auto-Update
-- ------------------------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_documents_updated_at ON documents;
CREATE TRIGGER trg_documents_updated_at
BEFORE UPDATE ON documents
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 4. Comments & Documentation
-- ------------------------------------------------------------------------------
COMMENT ON TABLE documents IS 'Employee profile document metadata, file storage locations, MIME types, and verification review records.';
COMMENT ON COLUMN documents.id IS 'Unique identifier for the document record (UUID).';
COMMENT ON COLUMN documents.employee_id IS 'Foreign key reference to associated employee profile (employees.id).';
COMMENT ON COLUMN documents.document_type IS 'Category classification of the document.';
COMMENT ON COLUMN documents.document_name IS 'Human-readable title given to the document.';
COMMENT ON COLUMN documents.file_name IS 'Original uploaded filename or normalized storage filename.';
COMMENT ON COLUMN documents.file_url IS 'Relative filepath or absolute cloud storage URL where physical file is persisted.';
COMMENT ON COLUMN documents.mime_type IS 'Standard MIME media type format (e.g. application/pdf, image/png).';
COMMENT ON COLUMN documents.file_size IS 'Total binary file size in bytes (> 0).';
COMMENT ON COLUMN documents.description IS 'Optional notes or explanations regarding document contents.';
COMMENT ON COLUMN documents.verification_status IS 'Review workflow status (PENDING, VERIFIED, REJECTED).';
COMMENT ON COLUMN documents.uploaded_by IS 'Foreign key reference to user who initiated the upload (users.id).';
COMMENT ON COLUMN documents.verified_by IS 'Foreign key reference to HR/Admin user who reviewed the document (users.id).';
COMMENT ON COLUMN documents.verified_at IS 'Timestamp with time zone when the document was verified or rejected.';
