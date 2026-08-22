-- ==============================================================================
-- Project: Dayflow - Human Resource Management System (HRMS)
-- Tagline: Every workday, perfectly aligned.
-- Database: PostgreSQL
-- Database Name: dayflow
-- Current Module: MODULE 3 — DEPARTMENTS
-- ==============================================================================
-- Description:
-- Master seed file for the Dayflow HRMS PostgreSQL database.
-- Executes seed datasets in dependency order across implemented modules.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Implemented Module Seed Scripts (In Dependency Order)
-- ------------------------------------------------------------------------------
-- 1. Base organizational hierarchy & departments (Module 3)
\ir seeds/departments.sql

-- 2. User authentication accounts (Module 2)
\ir seeds/users.sql

-- ------------------------------------------------------------------------------
-- 2. Future Module Seed Sequence (To Be Activated as Tables are Created)
-- ------------------------------------------------------------------------------
-- \ir seeds/employees.sql         -- Employee profile records & assignments (Module 4)
-- \ir seeds/leave_types.sql       -- Organizational leave policy configurations (Module 6)
-- \ir seeds/attendance.sql        -- Sample attendance and timesheet logs (Module 5)
-- \ir seeds/leave_requests.sql    -- Demonstration leave applications & approval logs (Module 7)
-- \ir seeds/payroll.sql           -- Salary configurations & demonstration payslips (Module 8)
-- \ir seeds/notifications.sql     -- Sample in-app and system broadcast messages (Module 9)
