-- ==============================================================================
-- Project: Dayflow - Human Resource Management System (HRMS)
-- Tagline: Every workday, perfectly aligned.
-- Database: PostgreSQL
-- Database Name: dayflow
-- Current Module: MODULE 2 — USERS
-- ==============================================================================
-- Description:
-- Master seed file for the Dayflow HRMS PostgreSQL database.
-- Executes seed datasets in dependency order across implemented modules.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Implemented Module Seed Scripts
-- ------------------------------------------------------------------------------
-- Include user accounts seed data:
\ir seeds/users.sql

-- ------------------------------------------------------------------------------
-- 2. Future Module Seed Sequence (To Be Activated as Tables are Created)
-- ------------------------------------------------------------------------------
-- \ir seeds/departments.sql       -- Base organizational hierarchy & departments (Module 3)
-- \ir seeds/employees.sql         -- Employee profile records & assignments (Module 4)
-- \ir seeds/leave_types.sql       -- Organizational leave policy configurations (Module 6)
-- \ir seeds/attendance.sql        -- Sample attendance and timesheet logs (Module 5)
-- \ir seeds/leave_requests.sql    -- Demonstration leave applications & approval logs (Module 7)
-- \ir seeds/payroll.sql           -- Salary configurations & demonstration payslips (Module 8)
-- \ir seeds/notifications.sql     -- Sample in-app and system broadcast messages (Module 9)
