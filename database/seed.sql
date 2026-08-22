-- ==============================================================================
-- Project: Dayflow - Human Resource Management System (HRMS)
-- Tagline: Every workday, perfectly aligned.
-- Database: PostgreSQL
-- Database Name: dayflow
-- Current Module: MODULE 7 — LEAVE REQUESTS
-- ==============================================================================
-- Description:
-- Master seed file for the Dayflow HRMS PostgreSQL database.
-- Executes seed datasets in strict dependency order across implemented modules.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Implemented Module Seed Scripts (In Strict Dependency Order)
-- ------------------------------------------------------------------------------
-- 1. Base organizational hierarchy & departments (Module 3)
\ir seeds/departments.sql

-- 2. User authentication accounts (Module 2)
\ir seeds/users.sql

-- 3. Employee HR profiles & organizational assignments (Module 4)
\ir seeds/employees.sql

-- 4. Daily attendance, check-in/out, and timesheet logs (Module 5)
\ir seeds/attendance.sql

-- 5. Master leave categories & policy allowances (Module 6)
\ir seeds/leave_types.sql

-- 6. Employee leave applications & approval logs (Module 7)
\ir seeds/leave_requests.sql
