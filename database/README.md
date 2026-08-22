# Dayflow — Database Architecture & Setup Guide

> **Project Name:** Dayflow - Human Resource Management System  
> **Tagline:** *Every workday, perfectly aligned.*  
> **Current Status:** Modules 1, 2, 3, 4 (COMPLETE)  
> **Next Module:** Module 5 — Attendance (NEXT)  
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
- **Time & Attendance (Module 5):** Real-time clock-in/out tracking, shift configurations, and punctuality analytics.
- **Leave Management:** Custom leave policies, quota tracking, multi-tier approval workflows, and audit history.
- **Payroll & Compensation:** Flexible salary structures, automated deductions, monthly pay run processing, and itemized payslip generation.
- **Notifications & Communication:** Targeted system alerts, broadcast announcements, and delivery status tracking across channels.
- **Document Management:** Employee records, identity proofs, contract lifecycle, and HR policy file tracking.
- **Compliance & Audit Logging:** Immutable audit trails for regulatory compliance, security forensics, and operational transparency.

---

## 2. Implemented Modules & Active Schema

### Module 2: Users (Core Authentication)
The `users` table handles authentication, login credentials, and account operational status.

- **Role Model (Strict Dayflow RBAC):**
  - `ADMIN`: Full administrative control across the HRMS (employee management, department administration, global attendance, leave approvals, payroll oversight).
  - `HR`: Human resources operational access (employee profile management, leave approvals, attendance monitoring, payroll view).
  - `EMPLOYEE`: Standard employee access (view own profile, check-in/out attendance, apply for leave, view personal payslips).
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
- **Architectural Note:** `employee_id` and `employee_code` are **NOT** stored in the `users` table. The `users` table is strictly dedicated to authentication.

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
- **Integrity Constraints:**
  - `uq_departments_name`: Unique department name.
  - `uq_departments_code`: Unique normalized uppercase code (`chk_departments_code_format`).
  - `chk_departments_name_not_empty`: Prevents empty name strings.

---

### Module 4: Employees (Employee Profiles & HR Lifecycle)
The `employees` table represents the official HR profile of a user account.

- **Columns:**
  - `id`: `UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  - `user_id`: `UUID NOT NULL UNIQUE` (1:1 with `users.id`)
  - `employee_code`: `VARCHAR(50) NOT NULL UNIQUE` (Institutional code e.g. `EMP001`)
  - `first_name`: `VARCHAR(100) NOT NULL`
  - `last_name`: `VARCHAR(100) NOT NULL`
  - `date_of_birth`: `DATE NULL` (Checked: $\le$ `CURRENT_DATE`)
  - `gender`: `VARCHAR(30) NULL` (`MALE`, `FEMALE`, `OTHER`, `PREFER_NOT_TO_SAY`)
  - `phone`: `VARCHAR(20) NULL`
  - `address`: `TEXT NULL`
  - `city`: `VARCHAR(100) NULL`
  - `state`: `VARCHAR(100) NULL`
  - `postal_code`: `VARCHAR(20) NULL`
  - `job_title`: `VARCHAR(100) NOT NULL` (e.g., "Senior Software Engineer")
  - `department_id`: `UUID NULL` (N:1 with `departments.id`)
  - `joining_date`: `DATE NOT NULL`
  - `employment_status`: `VARCHAR(30) NOT NULL DEFAULT 'ACTIVE'` (`ACTIVE`, `INACTIVE`, `ON_NOTICE`, `TERMINATED`)
  - `profile_picture_url`: `TEXT NULL`
  - `emergency_contact_name`: `VARCHAR(150) NULL`
  - `emergency_contact_phone`: `VARCHAR(20) NULL`
  - `created_at`: `TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP`
  - `updated_at`: `TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP`
- **Foreign Keys & Referential Integrity:**
  - `fk_employees_user`: `FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT`
  - `fk_employees_department`: `FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT`

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
│  Module 5  │ Attendance                  │    NEXT     │
│  Module 6  │ Leave Types                 │   PLANNED   │
│  Module 7  │ Leave Requests              │   PLANNED   │
│  Module 8  │ Payroll                     │   PLANNED   │
│  Module 9  │ Notifications               │   PLANNED   │
│  Module 10 │ Documents                   │   PLANNED   │
│  Module 11 │ Password Reset              │   PLANNED   │
│  Module 12 │ Audit Logs                  │   PLANNED   │
└────────────┴─────────────────────────────┴─────────────┘
```

### Entity Relationship Diagram (Modules 2, 3, 4)

```text
    users (Module 2)              departments (Module 3)
   ┌─────────────────┐           ┌────────────────────┐
   │ id (UUID PK)    │           │ id (UUID PK)       │
   │ email (UQ)      │           │ name (UQ)          │
   │ password_hash   │           │ code (UQ)          │
   │ role            │           │ is_active          │
   └────────┬────────┘           └─────────┬──────────┘
            │ 1                            │ 1
            │                              │
            │ 1                            │ N
   ┌────────▼──────────────────────────────▼──────────┐
   │ employees (Module 4)                             │
   │ ------------------------------------------------ │
   │ id               UUID PRIMARY KEY                │
   │ user_id          UUID UNIQUE NOT NULL (FK)       │
   │ employee_code    VARCHAR(50) UNIQUE NOT NULL     │
   │ department_id    UUID NULL (FK)                  │
   │ first_name       VARCHAR(100) NOT NULL           │
   │ last_name        VARCHAR(100) NOT NULL           │
   │ job_title        VARCHAR(100) NOT NULL           │
   │ joining_date     DATE NOT NULL                   │
   │ employment_status VARCHAR(30) NOT NULL           │
   │ ...                                              │
   └──────────────────────────────────────────────────┘
```

---

## 4. Directory Structure

```text
database/
├── migrations/
│   ├── README.md                    # Migration versioning rules and roadmap
│   ├── V1__create_users.sql         # Migration V1: users table (ADMIN, HR, EMPLOYEE)
│   ├── V2__create_departments.sql   # Migration V2: departments table, triggers, constraints
│   └── V3__create_employees.sql     # Migration V3: employees table (1:1 users, N:1 departments)
├── seeds/
│   ├── README.md                    # Seed data execution dependencies and rules
│   ├── departments.sql              # Seed data for baseline departments (IT, HR, FIN, MKT, SALES, OPS)
│   ├── users.sql                    # Seed data for demo user accounts (ADMIN, HR, EMPLOYEE)
│   └── employees.sql                # Seed data for demo employee profiles linked to users/departments
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

4. **Apply Seed Data (In Order: Departments $\rightarrow$ Users $\rightarrow$ Employees):**
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
3. **Decoupled Architecture:** Authentication credentials remain strictly isolated in the `users` table. Employee profile entities (`employees`) hold personal and HR lifecycle data without password columns.
4. **Principle of Least Privilege:** Production applications should connect using an application-specific user account granted only `DML` privileges (`SELECT`, `INSERT`, `UPDATE`, `DELETE`), rather than the `postgres` superuser.
5. **Encrypted Transport:** Enable SSL (`DB_SSL_MODE=require` or `verify-full`) for all database connections in staging and production deployments.
6. **SQL Injection Prevention:** All backend queries must utilize parameterized statements or prepared queries without exception.
