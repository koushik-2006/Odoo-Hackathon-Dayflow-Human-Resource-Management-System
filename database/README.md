# Dayflow — Database Architecture & Setup Guide

> **Project Name:** Dayflow - Human Resource Management System  
> **Tagline:** *Every workday, perfectly aligned.*  
> **Database Status:** Modules 1–12 (ALL PLANNED MODULES COMPLETE)  
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
- **In-App Notifications & Alerts (Module 9):** Targeted user notifications, read/unread states, event classifiers, and polymorphic application referencing.
- **Document Management & Verification (Module 10):** Centralized employee document repository metadata, file paths / object storage URLs, MIME validation, file sizes, and administrative verification workflows (`PENDING`, `VERIFIED`, `REJECTED`).
- **Audit Logs & Compliance Ledger (Module 11):** Immutable, append-only historical audit trail capturing security events, authentication, profile updates, approval workflows, payroll calculations, and document operations with JSONB before/after snapshots and network provenance (`INET`).
- **Password Reset & Account Recovery (Module 12):** Secure hashed one-time token storage, expiration timestamps, single-use consumption (`used_at`), and invalidation/revocation tracking (`revoked_at`).

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

---

### Module 10: Documents (Employee Document Management & Verification)
The `documents` table stores employee document metadata, storage paths / cloud URLs, MIME validation types, and verification review workflows.

- **Columns:**
  - `id`: `UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  - `employee_id`: `UUID NOT NULL` (N:1 with `employees.id` on delete `CASCADE`)
  - `document_type`: `VARCHAR(50) NOT NULL` (`ID_PROOF`, `ADDRESS_PROOF`, `OFFER_LETTER`, `EMPLOYMENT_CONTRACT`, `RESUME`, `EDUCATION_CERTIFICATE`, `EXPERIENCE_CERTIFICATE`, `SALARY_SLIP`, `OTHER`)
  - `document_name`: `VARCHAR(200) NOT NULL`
  - `file_name`: `VARCHAR(255) NOT NULL`
  - `file_url`: `TEXT NOT NULL` (Local path or cloud bucket URL)
  - `mime_type`: `VARCHAR(100) NOT NULL`
  - `file_size`: `BIGINT NOT NULL` (Byte length $> 0$)
  - `description`: `TEXT NULL`
  - `verification_status`: `VARCHAR(30) NOT NULL DEFAULT 'PENDING'` (`PENDING`, `VERIFIED`, `REJECTED`)
  - `uploaded_by`: `UUID NOT NULL` (N:1 with `users.id` on delete `RESTRICT`)
  - `verified_by`: `UUID NULL` (N:1 with `users.id` on delete `SET NULL`)
  - `verified_at`: `TIMESTAMPTZ NULL`
  - `created_at`: `TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP`
  - `updated_at`: `TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP`

---

### Module 11: Audit Logs (System Activity & Compliance Ledger)
The `audit_logs` table provides an immutable, append-only historical audit trail capturing security events, administrative updates, and domain actions.

- **Columns:**
  - `id`: `UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  - `user_id`: `UUID NULL` (N:1 with `users.id` on delete `SET NULL`, NULL for automated system tasks)
  - `action`: `VARCHAR(100) NOT NULL` (Standardized action identifier e.g. `AUTH_LOGIN`, `EMPLOYEE_CREATED`, `LEAVE_APPROVED`)
  - `entity_type`: `VARCHAR(100) NULL` (Domain resource classifier e.g. `USER`, `EMPLOYEE`, `LEAVE_REQUEST`, `PAYROLL`, `DOCUMENT`)
  - `entity_id`: `UUID NULL` (Target resource identifier)
  - `description`: `TEXT NULL` (Descriptive audit narrative)
  - `old_values`: `JSONB NULL` (Snapshot of non-sensitive entity state prior to modification)
  - `new_values`: `JSONB NULL` (Snapshot of non-sensitive entity state after modification)
  - `ip_address`: `INET NULL` (Network IPv4 / IPv6 address of originating request)
  - `user_agent`: `TEXT NULL` (Client browser / device user-agent string)
  - `request_id`: `VARCHAR(100) NULL` (Backend correlation identifier)
  - `created_at`: `TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP`

---

### Module 12: Password Reset Tokens (Secure Account Recovery)
The `password_reset_tokens` table securely stores cryptographic hashes of single-use password reset verification tokens, expiration timestamps, and consumption states.

- **Columns:**
  - `id`: `UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  - `user_id`: `UUID NOT NULL` (N:1 with `users.id` on delete `CASCADE`)
  - `token_hash`: `VARCHAR(255) NOT NULL` (Cryptographic hash e.g., SHA-256 or bcrypt)
  - `expires_at`: `TIMESTAMPTZ NOT NULL` (Time-to-live threshold)
  - `used_at`: `TIMESTAMPTZ NULL` (Timestamp when consumed; NULL if unused)
  - `revoked_at`: `TIMESTAMPTZ NULL` (Timestamp when explicitly invalidated; NULL if active)
  - `created_at`: `TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP`
  - `updated_at`: `TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP`
- **Security & Lifecycle Validation:**
  - **Zero Plaintext Tokens:** Raw tokens are emailed directly to users and never stored in PostgreSQL.
  - **Active State Rule:** `used_at IS NULL AND revoked_at IS NULL AND expires_at > CURRENT_TIMESTAMP`.
  - **Maintenance Cleanup:** Expired or consumed records can be purged via scheduled maintenance:
    ```sql
    DELETE FROM password_reset_tokens
    WHERE expires_at < CURRENT_TIMESTAMP OR used_at IS NOT NULL OR revoked_at IS NOT NULL;
    ```

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
│  Module 10 │ Documents                   │  COMPLETE   │
│  Module 11 │ Audit Logs                  │  COMPLETE   │
│  Module 12 │ Password Reset Tokens       │  COMPLETE   │
└────────────┴─────────────────────────────┴─────────────┘
```

### Complete Entity Relationship Diagram (Modules 2–12)

```text
                                departments (Module 3)
                               ┌────────────────────┐
                               │ id (UUID PK)       │
                               │ name (UQ)          │
                               │ code (UQ)          │
                               │ is_active          │
                               └─────────┬──────────┘
                                         │ 1
                                         │
                                         │ N
                               ┌─────────▼────────────────────┐
                               │ employees (Module 4)         │
                               │ ---------------------------- │
                               │ id           UUID PRIMARY KEY│
                               │ user_id      UUID NOT NULL FK│
                               │ department_id UUID NULL FK   │
                               │ employee_code VARCHAR UNIQUE │
                               │ first_name   VARCHAR         │
                               └───────┬──────┬───────┬───────┘
                                       │ 1    │ 1     │ 1
                                       │      │       │
                                       │ N    │ N     │ N
                              ┌────────▼─┐ ┌──▼────┐ ┌▼──────────────┐
                              │attendance│ │leave  │ │ documents     │
                              │(Module 5)│ │request│ │ (Module 10)   │
                              │          │ │(M7)   │ │ ------------- │
                              │          │ │       │ │ id    UUID PK │
                              │          │ │       │ │ employee_id FK│
                              │          │ │       │ │ file_url      │
                              │          │ │       │ │ ver_status    │
                              └──────────┘ └───────┘ └───────────────┘
                                              │
                                           ┌──▼──────────────┐
                                           │ payroll (Mod 8) │
                                           │ --------------- │
                                           │ id      UUID PK │
                                           │ employee_id  FK │
                                           │ net_salary      │
                                           │ status          │
                                           └─────────────────┘
                                         ▲
                                         │ 1:1
                                         │
                              ┌──────────┴───────┐
                              │ users (Module 2) │
                              │ ---------------- │
                              │ id (UUID PK)     │
                              │ email (UQ)       │
                              │ password_hash    │
                              │ role             │
                              └───────┬───┬───┬──┘
                                      │   │   │
                     ┌────────────────┘   │   └────────────────┐
                     │ 1:N                │ 1:N                │ 1:N
             ┌───────▼─────────┐  ┌───────▼─────────┐  ┌───────▼─────────┐
             │ notifications   │  │ audit_logs      │  │ password_reset  │
             │ (Module 9)      │  │ (Module 11)     │  │ (Module 12)     │
             │ --------------- │  │ --------------- │  │ --------------- │
             │ id      UUID PK │  │ id      UUID PK │  │ id      UUID PK │
             │ user_id UUID FK │  │ user_id UUID FK │  │ user_id UUID FK │
             │ type    VARCHAR │  │ action  VARCHAR │  │ token_hash  CHAR│
             │ is_read BOOLEAN │  │ old_values JSONB│  │ expires_at  TIME│
             │ ref_type, ref_id│  │ new_values JSONB│  │ used_at     TIME│
             └─────────────────┘  └─────────────────┘  └─────────────────┘
```

---

## 4. Directory Structure

```text
database/
├── migrations/
│   ├── README.md                          # Migration versioning rules and roadmap
│   ├── V1__create_users.sql               # Migration V1: users table (ADMIN, HR, EMPLOYEE)
│   ├── V2__create_departments.sql         # Migration V2: departments table, triggers, constraints
│   ├── V3__create_employees.sql           # Migration V3: employees table (1:1 users, N:1 departments)
│   ├── V4__create_attendance.sql          # Migration V4: attendance table (1:N employees, unique date)
│   ├── V5__create_leave_types.sql         # Migration V5: leave_types master policy table
│   ├── V6__create_leave_requests.sql      # Migration V6: leave_requests employee applications
│   ├── V7__create_payroll.sql             # Migration V7: payroll employee compensation table
│   ├── V8__create_notifications.sql       # Migration V8: notifications user alerts table
│   ├── V9__create_documents.sql           # Migration V9: documents employee metadata table
│   ├── V10__create_audit_logs.sql         # Migration V10: audit_logs immutable compliance ledger
│   └── V11__create_password_reset_tokens.sql # Migration V11: password_reset_tokens security table
├── seeds/
│   ├── README.md                          # Seed data execution dependencies and rules
│   ├── departments.sql                    # Seed data for baseline departments (IT, HR, FIN, MKT, SALES, OPS)
│   ├── users.sql                          # Seed data for demo user accounts (ADMIN, HR, EMPLOYEE)
│   ├── employees.sql                      # Seed data for demo employee profiles
│   ├── attendance.sql                     # Seed data for multi-day employee attendance logs
│   ├── leave_types.sql                    # Seed data for baseline leave categories (PAID, SICK, UNPAID)
│   ├── leave_requests.sql                 # Seed data for demo leave requests (PENDING, APPROVED, REJECTED)
│   ├── payroll.sql                        # Seed data for multi-period employee payroll records
│   ├── notifications.sql                  # Seed data for demo in-app alerts and notifications
│   ├── documents.sql                      # Seed data for demo employee document metadata
│   ├── audit_logs.sql                     # Seed data for demo security and activity audit records
│   └── password_reset_tokens.sql          # Seed data for demo password reset lifecycle states
├── schema.sql                             # Master schema definition & active tables
├── seed.sql                               # Master seed orchestration script (strict dependency order)
└── README.md                              # Master database documentation (this file)
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
3. **Password Reset Token Security:** Password reset verification tokens are never stored in plaintext; only cryptographic hashes (SHA-256 / bcrypt) are persisted in PostgreSQL.
4. **Audit Log Privacy:** Audit records strictly capture event metadata, role modifications, and resource states while completely excluding credentials, session tokens, JWTs, and private keys.
5. **Decoupled Architecture:** Authentication credentials remain strictly isolated in the `users` table. Employee profiles, attendance logs, leave records, payroll data, notifications, and documents hold operational metadata without credential columns.
6. **Principle of Least Privilege:** Production applications should connect using an application-specific user account granted only `DML` privileges (`SELECT`, `INSERT`, `UPDATE`, `DELETE`), rather than the `postgres` superuser.
7. **Encrypted Transport:** Enable SSL (`DB_SSL_MODE=require` or `verify-full`) for all database connections in staging and production deployments.
8. **SQL Injection Prevention:** All backend queries must utilize parameterized statements or prepared queries without exception.
