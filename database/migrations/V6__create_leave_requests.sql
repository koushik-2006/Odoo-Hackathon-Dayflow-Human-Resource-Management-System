-- ==============================================================================
-- Migration: V6__create_leave_requests.sql
-- Module: MODULE 7 — LEAVE REQUESTS
-- Project: Dayflow - Human Resource Management System (HRMS)
-- Description:
-- Creates the employee leave applications table 'leave_requests' with:
--   - N:1 relationship to employees (leave_requests.employee_id -> employees.id)
--   - N:1 relationship to leave_types (leave_requests.leave_type_id -> leave_types.id)
--   - N:1 optional relationship to reviewing user (leave_requests.reviewer_id -> users.id)
--   - Workflow status tracking (PENDING, APPROVED, REJECTED)
--   - Date range validation (end_date >= start_date) and mandatory reason
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Create 'leave_requests' Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL,
    leave_type_id UUID NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    reviewer_id UUID NULL,
    reviewer_comment TEXT NULL,
    reviewed_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Foreign Key Constraints
    CONSTRAINT fk_leave_requests_employee FOREIGN KEY (employee_id)
        REFERENCES employees (id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_leave_requests_leave_type FOREIGN KEY (leave_type_id)
        REFERENCES leave_types (id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_leave_requests_reviewer FOREIGN KEY (reviewer_id)
        REFERENCES users (id)
        ON DELETE SET NULL,

    -- Domain & Logical Check Constraints
    CONSTRAINT chk_leave_requests_date_range CHECK (
        end_date >= start_date
    ),
    CONSTRAINT chk_leave_requests_reason CHECK (
        LENGTH(TRIM(reason)) > 0
    ),
    CONSTRAINT chk_leave_requests_status CHECK (
        status IN ('PENDING', 'APPROVED', 'REJECTED')
    )
);

-- ------------------------------------------------------------------------------
-- 2. Create Performance & Lookup Indexes
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_leave_requests_employee_id ON leave_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_leave_type_id ON leave_requests(leave_type_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON leave_requests(status);
CREATE INDEX IF NOT EXISTS idx_leave_requests_start_date ON leave_requests(start_date DESC);
CREATE INDEX IF NOT EXISTS idx_leave_requests_employee_status ON leave_requests(employee_id, status);

-- ------------------------------------------------------------------------------
-- 3. Create Trigger for 'updated_at' Auto-Update
-- ------------------------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_leave_requests_updated_at ON leave_requests;
CREATE TRIGGER trg_leave_requests_updated_at
BEFORE UPDATE ON leave_requests
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 4. Comments & Documentation
-- ------------------------------------------------------------------------------
COMMENT ON TABLE leave_requests IS 'Employee leave applications, workflow statuses (PENDING, APPROVED, REJECTED), and review audit records.';
COMMENT ON COLUMN leave_requests.id IS 'Unique identifier for the leave application (UUID).';
COMMENT ON COLUMN leave_requests.employee_id IS 'Foreign key reference to applying employee (employees.id).';
COMMENT ON COLUMN leave_requests.leave_type_id IS 'Foreign key reference to category of leave requested (leave_types.id).';
COMMENT ON COLUMN leave_requests.start_date IS 'First calendar date of the requested leave span.';
COMMENT ON COLUMN leave_requests.end_date IS 'Last calendar date of the requested leave span (must be >= start_date).';
COMMENT ON COLUMN leave_requests.reason IS 'Mandatory employee explanation/justification for leave application.';
COMMENT ON COLUMN leave_requests.status IS 'Workflow state of the request (PENDING, APPROVED, REJECTED).';
COMMENT ON COLUMN leave_requests.reviewer_id IS 'Optional foreign key to admin/HR user who reviewed the request (users.id).';
COMMENT ON COLUMN leave_requests.reviewer_comment IS 'Optional feedback or justification provided by the approving/rejecting admin.';
COMMENT ON COLUMN leave_requests.reviewed_at IS 'Timestamp with time zone when the request was approved or rejected.';
COMMENT ON COLUMN leave_requests.created_at IS 'Timestamp with time zone when the leave request was submitted.';
COMMENT ON COLUMN leave_requests.updated_at IS 'Timestamp with time zone when the leave request was last modified.';
