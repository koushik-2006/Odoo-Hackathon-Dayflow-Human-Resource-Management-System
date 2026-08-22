# Dayflow — Database Architecture & Setup Guide

> **Project Name:** Dayflow - Human Resource Management System  
> **Tagline:** *Every workday, perfectly aligned.*  
> **Current Status:** Modules 1, 2, 3, 4, 5, 6, 7, 8, 9 (COMPLETE)  
> **Next Module:** Module 10 — Documents (NEXT)  
> **Database Engine:** PostgreSQL (Version 14+)  
> **Database Name:** `dayflow`  
> **Default Host:** `localhost`  
> **Default Port:** `5432`  

---

## 1. Executive Overview & Purpose

The **Dayflow HRMS** PostgreSQL database serves as the centralized, reliable, and secure data persistence layer for modern organizational human resource operations. Designed for scalability, high data integrity, and role-based access governance, this database supports:

- **Authentication & Security (Module 2):** Secure credential storage, multi-factor token lifecycle, and standardized role-based access control (`ADMIN`, `HR`, `EMPLOYEE`).
- **Organizational Structure & Departments (Module 3):** Multi-department mapping, normalized department codes, team divisions, and soft-deactivation tracking.
- **Employee Lifecycle (Module 4):** Comprehensive employee profiles, 1:1 user linkage, personal & contact records, employee codes, designations, and department assignments.
- **Time & Attendance (Module 5):** Real-time daily clock-in/out tracking, working duration calculations, presence statuses (`PRESENT`, `ABSENT`, `HALF_DAY`, `LEAVE`), daily uniqueness guarantees, and history views.
- **Leave Types & Policy Configuration (Module 6):** Standardized leave categories (`PAID`, `SICK`, `UNPAID`), compensation rules (`is_paid`), annual baseline entitlements (`default_days`), and operational toggles (`is_active`).
- **Leave Requests & Approval Lifecycle (Module 7):** Employee leave applications, date-range validation, multi-tier approval workflows (`PENDING`, `APPROVED`, `REJECTED`), reviewer tracking, and audit history.
- **Payroll & Compensation (Module 8):** Multi-component salary structures (basic, HRA, conveyance, other allowances), statutory/custom deductions (tax, PF), gross/net pay calculation, pay cycle periods, and payment tracking.
- **In-App Notifications & Alerts (Module 9):** Targeted user notifications, read/unread states, event classifiers (`LEAVE_APPLIED`, `LEAVE_APPROVED`, `LEAVE_REJECTED`, `ATTENDANCE_REMINDER`, `ATTENDANCE_ALERT`, `PAYROLL_PROCESSED`, `PAYROLL_PAID`, `GENERAL`), and polymorphic application referencing.
- **Document Management (Module 10):** Employee records, identity proofs, contract lifecycle, and HR policy file tracking.
- **Compliance & Audit Logging (Module 11 & 12):** Password recovery token security and immutable audit trails.

---

## 2. Implemented Modules & Active Schema

### Module 2: Users (Core Authentication)
The `users` table handles authentication, login credentials, and account operational status.

- **Columns:**
  - `id`: `UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  - `email`: `VARCHAR(255) NOT NULL UNIQUE`
  - `password_hash`: `VARCHAR(255) NOT NULL` (bcrypt hash)
  - `role`: `VARCHAR(50) NOT NULL DEFAULT 'EMPLOYEE'` (CHECK: `ADMIN`, `HR`, `EMPLOYEE`)
  - `status`: `VARCHAR(50) NOT NULL DEFAULT 'ACTIVE'` (CHECK: `ACTIVE`, `INACTIVE`, `SUSPENDED`, `PENDING_VERIFICATION`)
  - `is_verified`: `BOOLEAN NOT NULL DEFAULT FALSE`
  - `last_login_at`: `TIMESTAMPTZ NULL`
  - `created_at`: `TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP`
  - `updated_at`: `TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP`

---

### Module 3: Departments (Organizational Units)
The `departments` table stores organizational business units and operational divisions.

- **Columns:**
  - `id`: `UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  - `name`: `VARCHAR(100) NOT NULL UNIQUE` (e.g., "Information Technology")
  - `code`: `VARCHAR(20) NOT NULL UNIQUE` (e.g., "IT", "HR", "FIN")
  - `description`: `TEXT NULL`
  - `is_active`: `BOOLEAN NOT NULL DEFAULT TRUE` (Soft deactivation flag)
  - `created_at`: `TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP`
  - `updated_at`: `TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP`

---

### Module 4: Employees (Employee Profiles & HR Lifecycle)
The `employees` table represents the official HR profile of a user account.

- **Columns:**
  - `id`: `UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  - `user_id`: `UUID NOT NULL UNIQUE` (1:1 with `users.id`)
  - `employee_code`: `VARCHAR(50) NOT NULL UNIQUE` (Institutional code e.g. `EMP001`)
  - `first_name`: `VARCHAR(100) NOT NULL`
  - `last_name`: `VARCHAR(100) NOT NULL`
  - `date_of_birth`: `DATE NULL`
  - `gender`: `VARCHAR(30) NULL`
  - `phone`: `VARCHAR(20) NULL`
  - `address`: `TEXT NULL`
  - `city`: `VARCHAR(100) NULL`
  - `state`: `VARCHAR(100) NULL`
  - `postal_code`: `VARCHAR(20) NULL`
  - `job_title`: `VARCHAR(100) NOT NULL`
  - `department_id`: `UUID NULL` (N:1 with `departments.id`)
  - `joining_date`: `DATE NOT NULL`
  - `employment_status`: `VARCHAR(30) NOT NULL DEFAULT 'ACTIVE'` (`ACTIVE`, `INACTIVE`, `ON_NOTICE`, `TERMINATED`)
  - `profile_picture_url`: `TEXT NULL`
  - `emergency_contact_name`: `VARCHAR(150) NULL`
  - `emergency_contact_phone`: `VARCHAR(20) NULL`
  - `created_at`: `TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP`
  - `updated_at`: `TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP`

---

### Module 5: Attendance (Daily Time Tracking & Work Hours)
The `attendance` table captures daily work logs, check-in/out timestamps, and attendance statuses.

- **Columns:**
  - `id`: `UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  - `employee_id`: `UUID NOT NULL` (N:1 with `employees.id`)
  - `attendance_date`: `DATE NOT NULL` (Work date)
  - `check_in`: `TIMESTAMPTZ NULL` (Check-in timestamp)
  - `check_out`: `TIMESTAMPTZ NULL` (Check-out timestamp)
  - `status`: `VARCHAR(30) NOT NULL DEFAULT 'PRESENT'` (`PRESENT`, `ABSENT`, `HALF_DAY`, `LEAVE`)
  - `working_minutes`: `INTEGER NULL` (Calculated work duration in integer minutes $\ge 0$)
  - `remarks`: `TEXT NULL`
  - `created_at`: `TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP`
  - `updated_at`: `TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP`

---

### Module 6: Leave Types (Master Policy Categories)
The `leave_types` table stores organizational leave categories and baseline entitlement rules.

- **Columns:**
  - `id`: `UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  - `code`: `VARCHAR(50) NOT NULL UNIQUE` (Standard machine identifier e.g., `PAID`, `SICK`, `UNPAID`)
  - `name`: `VARCHAR(100) NOT NULL UNIQUE` (Display title e.g., "Paid Leave", "Sick Leave", "Unpaid Leave")
  - `description`: `TEXT NULL`
  - `is_paid`: `BOOLEAN NOT NULL DEFAULT TRUE`
  - `default_days`: `INTEGER NOT NULL DEFAULT 0`
  - `is_active`: `BOOLEAN NOT NULL DEFAULT TRUE`
  - `created_at`: `TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP`
  - `updated_at`: `TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP`

---

### Module 7: Leave Requests (Employee Leave Applications)
The `leave_requests` table manages the application, workflow status, review, and approval lifecycle of employee leaves.

- **Columns:**
  - `id`: `UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  - `employee_id`: `UUID NOT NULL` (N:1 with `employees.id` on delete `RESTRICT`)
  - `leave_type_id`: `UUID NOT NULL` (N:1 with `leave_types.id` on delete `RESTRICT`)
  - `start_date`: `DATE NOT NULL` (First day of leave)
  - `end_date`: `DATE NOT NULL` (Last day of leave, must be $\ge$ `start_date`)
  - `reason`: `TEXT NOT NULL`
  - `status`: `VARCHAR(30) NOT NULL DEFAULT 'PENDING'` (`PENDING`, `APPROVED`, `REJECTED`)
  - `reviewer_id`: `UUID NULL` (N:1 with `users.id` on delete `SET NULL`)
  - `reviewer_comment`: `TEXT NULL`
  - `reviewed_at`: `TIMESTAMPTZ NULL`
  - `created_at`: `TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP`
  - `updated_at`: `TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP`

---

### Module 8: Payroll (Compensation & Pay Run Processing)
The `payroll` table manages monthly/periodic employee compensation structures, salary component itemization, statutory deductions, net payable calculations, and payment tracking.

- **Columns:**
  - `id`: `UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  - `employee_id`: `UUID NOT NULL` (N:1 with `employees.id` on delete `RESTRICT`)
  - `pay_period_start`: `DATE NOT NULL`
  - `pay_period_end`: `DATE NOT NULL` ($\ge$ `pay_period_start`)
  - `basic_salary`: `NUMERIC(12,2) NOT NULL DEFAULT 0.00`
  - `housing_allowance`: `NUMERIC(12,2) NOT NULL DEFAULT 0.00`
  - `transport_allowance`: `NUMERIC(12,2) NOT NULL DEFAULT 0.00`
  - `other_allowances`: `NUMERIC(12,2) NOT NULL DEFAULT 0.00`
  - `gross_salary`: `NUMERIC(12,2) NOT NULL DEFAULT 0.00`
  - `tax_deduction`: `NUMERIC(12,2) NOT NULL DEFAULT 0.00`
  - `other_deductions`: `NUMERIC(12,2) NOT NULL DEFAULT 0.00`
  - `total_deductions`: `NUMERIC(12,2) NOT NULL DEFAULT 0.00`
  - `net_salary`: `NUMERIC(12,2) NOT NULL DEFAULT 0.00`
  - `currency`: `VARCHAR(3) NOT NULL DEFAULT 'INR'`
  - `payment_date`: `DATE NULL`
  - `status`: `VARCHAR(30) NOT NULL DEFAULT 'DRAFT'` (`DRAFT`, `PROCESSED`, `PAID`, `CANCELLED`)
  - `created_at`: `TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP`
  - `updated_at`: `TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP`

---

### Module 9: Notifications (In-App Alerts & Activity Feeds)
The `notifications` table stores targeted user notifications, unread badges, and domain event references.

- **Columns:**
  - `id`: `UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  - `user_id`: `UUID NOT NULL` (N:1 with `users.id` on delete `CASCADE`)
  - `type`: `VARCHAR(50) NOT NULL` (`LEAVE_APPLIED`, `LEAVE_APPROVED`, `LEAVE_REJECTED`, `ATTENDANCE_REMINDER`, `ATTENDANCE_ALERT`, `PAYROLL_PROCESSED`, `PAYROLL_PAID`, `GENERAL`)
  - `title`: `VARCHAR(200) NOT NULL`
  - `message`: `TEXT NOT NULL`
  - `reference_type`: `VARCHAR(50) NULL` (`LEAVE_REQUEST`, `ATTENDANCE`, `PAYROLL`, `GENERAL`)
  - `reference_id`: `UUID NULL`
  - `is_read`: `BOOLEAN NOT NULL DEFAULT FALSE`
  - `read_at`: `TIMESTAMPTZ NULL`
  - `created_at`: `TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP`
  - `updated_at`: `TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP`
- **Architecture Note:** Notifications decouple delivery channel logic (email/SMS) into the backend service while providing a high-performance in-app persistence layer.

---

## 3. Relational Architecture & Entity Roadmap

```text
┌────────────────────────────────────────────────────────┐
│             DAYFLOW HRMS DATABASE ROADMAP              │
├────────────┬─────────────────────────────┬─────────────┤
│  Module 1  │ Database Foundation         │  COMPLETE   │
│  Module 2  │ Users                       │  COMPLETE   │
│  Module 3  │ Departments                 │  COMPLETE   │
│  Module 4  │ Employees                   │  COMPLETE   │
│  Module 5  │ Attendance                  │  COMPLETE   │
│  Module 6  │ Leave Types                 │  COMPLETE   │
│  Module 7  │ Leave Requests              │  COMPLETE   │
│  Module 8  │ Payroll                     │  COMPLETE   │
│  Module 9  │ Notifications               │  COMPLETE   │
│  Module 10 │ Documents                   │    NEXT     │
│  Module 11 │ Password Reset              │   PLANNED   │
│  Module 12 │ Audit Logs                  │   PLANNED   │
└────────────┴─────────────────────────────┴─────────────┘
```

### Entity Relationship Diagram (Modules 2–9)

```text
    users (Module 2)              departments (Module 3)
   ┌─────────────────┐           ┌────────────────────┐
   │ id (UUID PK)    │           │ id (UUID PK)       │
   │ email (UQ)      │           │ name (UQ)          │
   │ password_hash   │           │ code (UQ)          │
   │ role            │           │ is_active          │
   └───────┬─────────┘           └─────────┬──────────┘
           │ 1                             │ 1
           ├───────────────┐               │
           │ 1             │ 1             │ N
   ┌───────▼─────────┐ ┌───▼───────────────▼──────────┐
   │ notifications   │ │ employees (Module 4)         │
   │ (Module 9)      │ │ ---------------------------- │
   │ --------------- │ │ id           UUID PRIMARY KEY│
   │ id      UUID PK │ │ user_id      UUID NOT NULL FK│
   │ user_id UUID FK │ │ department_id UUID NULL FK   │
   │ type    VARCHAR │ │ employee_code VARCHAR UNIQUE │
   │ is_read BOOLEAN │ │ first_name   VARCHAR         │
   │ ref_type, ref_id│ └───────┬──────────────┬───────┘
   └─────────────────┘         │ 1            │ 1
                               │              │
                               │ N            │ N
                      ┌────────▼─────────┐ ┌──▼──────────┐
                      │ attendance (M5)  │ │ leave_req   │
                      │ ---------------- │ │ (Module 7)  │
                      │ id       UUID PK │ │ ----------- │
                      │ employee_id  FK  │ │ id  UUID PK │
                      │ attendance_date  │ │ employee_id │
                      │ status           │ │ leave_type  │
                      │ UNIQUE(emp, date)│ │ status      │
                      └──────────────────┘ └─────────────┘
                                                      │
                                           ┌──────────▼──────────┐
                                           │ payroll (Module 8)  │
                                           │ ------------------- │
                                           │ id       UUID PK    │
                                           │ employee_id  FK     │
                                           │ net_salary NUMERIC  │
                                           │ status   VARCHAR(30)│
                                           └─────────────────────┘
```

---

## 4. Directory Structure

```text
database/
├── migrations/
│   ├── README.md                    # Migration versioning rules and roadmap
│   ├── V1__create_users.sql         # Migration V1: users table (ADMIN, HR, EMPLOYEE)
│   ├── V2__create_departments.sql   # Migration V2: departments table, triggers, constraints
│   ├── V3__create_employees.sql     # Migration V3: employees table (1:1 users, N:1 departments)
│   ├── V4__create_attendance.sql    # Migration V4: attendance table (1:N employees, unique date)
│   ├── V5__create_leave_types.sql   # Migration V5: leave_types master policy table
│   ├── V6__create_leave_requests.sql# Migration V6: leave_requests employee applications
│   ├── V7__create_payroll.sql       # Migration V7: payroll employee compensation table
│   └── V8__create_notifications.sql # Migration V8: notifications user alerts table
├── seeds/
│   ├── README.md                    # Seed data execution dependencies and rules
│   ├── departments.sql              # Seed data for baseline departments (IT, HR, FIN, MKT, SALES, OPS)
│   ├── users.sql                    # Seed data for demo user accounts (ADMIN, HR, EMPLOYEE)
│   ├── employees.sql                # Seed data for demo employee profiles
│   ├── attendance.sql               # Seed data for multi-day employee attendance logs
│   ├── leave_types.sql              # Seed data for baseline leave categories (PAID, SICK, UNPAID)
│   ├── leave_requests.sql           # Seed data for demo leave requests (PENDING, APPROVED, REJECTED)
│   ├── payroll.sql                  # Seed data for multi-period employee payroll records
│   └── notifications.sql            # Seed data for demo in-app alerts and notifications
├── schema.sql                       # Master schema definition & active tables
├── seed.sql                         # Master seed orchestration script (strict dependency order)
└── README.md                        # Master database documentation (this file)
```

---

## 5. PostgreSQL Setup Instructions

### Prerequisites
- PostgreSQL 14 or higher installed locally or accessible via Docker.
- `psql` command-line client or a graphical client (pgAdmin 4, DBeaver, etc.).

### Option A: Local PostgreSQL Service

1. **Access the PostgreSQL Interactive Terminal:**
   ```bash
   psql -U postgres -h localhost -p 5432
   ```

2. **Create the Dayflow Database:**
   ```sql
   CREATE DATABASE dayflow
       WITH
       OWNER = postgres
       ENCODING = 'UTF8'
       LC_COLLATE = 'en_US.UTF-8'
       LC_CTYPE = 'en_US.UTF-8'
       CONNECTION LIMIT = -1;
   ```

3. **Apply Schema & Migrations:**
   ```bash
   psql -U postgres -h localhost -p 5432 -d dayflow -f database/schema.sql
   ```

4. **Apply Seed Data (In Dependency Order):**
   ```bash
   psql -U postgres -h localhost -p 5432 -d dayflow -f database/seed.sql
   ```

---

### Option B: Docker Container Setup (Recommended for Development)

To start a clean PostgreSQL instance via Docker:

```bash
docker run --name dayflow-postgres \
  -e POSTGRES_DB=dayflow \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=your_secure_password \
  -p 5432:5432 \
  -d postgres:16-alpine
```

Execute initialization scripts inside container:
```bash
docker exec -i dayflow-postgres psql -U postgres -d dayflow < database/schema.sql
docker exec -i dayflow-postgres psql -U postgres -d dayflow < database/seed.sql
```

---

## 6. Environment Variables Configuration

Dayflow components read database connection parameters exclusively through environment variables.

### Configuration Template

Create a `.env` file in the project root based on `.env.example`:

```env
# ==============================================================================
# Dayflow HRMS - Database Connection Settings
# ==============================================================================
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dayflow
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password_here

# Connection Pool & Security Options
DB_SSL_MODE=disable
DB_MAX_CONNECTIONS=20
DB_TIMEOUT_SECONDS=30
```

---

## 7. Security Best Practices

1. **Zero Credential Exposure:** Never commit `.env` files, plaintext passwords, private keys, or connection strings to version control.
2. **Password Cryptography:** User passwords must always be hashed using modern algorithms (bcrypt/Argon2) with high work factors before insertion into the database.
3. **Decoupled Architecture:** Authentication credentials remain strictly isolated in the `users` table. Employee profiles, attendance logs, leave records, payroll data, and notifications hold operational metadata without credential columns.
4. **Principle of Least Privilege:** Production applications should connect using an application-specific user account granted only `DML` privileges (`SELECT`, `INSERT`, `UPDATE`, `DELETE`), rather than the `postgres` superuser.
5. **Encrypted Transport:** Enable SSL (`DB_SSL_MODE=require` or `verify-full`) for all database connections in staging and production deployments.
6. **SQL Injection Prevention:** All backend queries must utilize parameterized statements or prepared queries without exception.
