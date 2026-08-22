# Dayflow — Database Architecture & Setup Guide

> **Project Name:** Dayflow - Human Resource Management System  
> **Tagline:** *Every workday, perfectly aligned.*  
> **Current Module:** Module 2 — Users (COMPLETED) / Module 3 — Departments (NEXT)  
> **Database Engine:** PostgreSQL (Version 14+)  
> **Database Name:** `dayflow`  
> **Default Host:** `localhost`  
> **Default Port:** `5432`  

---

## 1. Executive Overview & Purpose

The **Dayflow HRMS** PostgreSQL database serves as the centralized, reliable, and secure data persistence layer for modern organizational human resource operations. Designed for scalability, high data integrity, and role-based access governance, this database supports:

- **Authentication & Security:** Secure credential storage, multi-factor token lifecycle, and role-based access control (RBAC).
- **Organizational Structure:** Multi-level department hierarchies, designations, and administrative boundaries.
- **Employee Lifecycle:** Complete employee records from onboarding to offboarding, reporting lines, and profile details.
- **Time & Attendance:** Real-time clock-in/out tracking, shift configurations, and punctuality analytics.
- **Leave Management:** Custom leave policies, quota tracking, multi-tier approval workflows, and audit history.
- **Payroll & Compensation:** Flexible salary structures, automated deductions, monthly pay run processing, and itemized payslip generation.
- **Notifications & Communication:** Targeted system alerts, broadcast announcements, and delivery status tracking across channels.
- **Document Management:** Employee records, identity proofs, contract lifecycle, and HR policy file tracking.
- **Compliance & Audit Logging:** Immutable audit trails for regulatory compliance, security forensics, and operational transparency.

---

## 2. Current Module Status

| Attribute | Details |
| :--- | :--- |
| **Completed Modules** | **Module 1 (Database Initialization)**, **Module 2 (Users)** |
| **Active / Next Module** | **Module 3: Departments** |
| **Active Tables** | `users` |
| **Active Migrations** | `V1__create_users.sql` |
| **Active Seeds** | `database/seeds/users.sql` |

---

## 3. Database Module Roadmap

The Dayflow database architecture is partitioned into 12 structured, sequential modules:

```text
┌────────────────────────────────────────────────────────┐
│             DAYFLOW HRMS DATABASE ROADMAP              │
├────────────┬─────────────────────────────┬─────────────┤
│  Module 1  │ Database Initialization     │  COMPLETED  │
│  Module 2  │ Users                       │  COMPLETED  │
│  Module 3  │ Departments                 │    NEXT     │
│  Module 4  │ Employees                   │   PLANNED   │
│  Module 5  │ Attendance                  │   PLANNED   │
│  Module 6  │ Leave Types                 │   PLANNED   │
│  Module 7  │ Leave Requests              │   PLANNED   │
│  Module 8  │ Payroll                     │   PLANNED   │
│  Module 9  │ Notifications               │   PLANNED   │
│  Module 10 │ Documents                   │   PLANNED   │
│  Module 11 │ Password Reset              │   PLANNED   │
│  Module 12 │ Audit Logs                  │   PLANNED   │
└────────────┴─────────────────────────────┴─────────────┘
```

- **Module 1: Database Initialization (COMPLETED)** — Database foundation, extensions (`uuid-ossp`, `pgcrypto`), migration & seeding architecture, and environment configuration templates.
- **Module 2: Users (COMPLETED)** — Core authentication entity (`users` table), role designations (`SUPER_ADMIN`, `HR_ADMIN`, `MANAGER`, `EMPLOYEE`), account status flags, timestamps, and seed accounts.
- **Module 3: Departments (NEXT)** — Department hierarchy, head-of-department assignments, and organizational units.
- **Module 4: Employees** — Personal profiles, employment records, contact details, designations, and reporting structures.
- **Module 5: Attendance** — Daily timesheets, clock-in/out timestamps, shift schedules, and overtime tracking.
- **Module 6: Leave Types** — Organization leave policy configuration, quotas, carryover rules, and accrual types.
- **Module 7: Leave Requests** — Employee leave applications, multi-level review workflows, and approval audit logs.
- **Module 8: Payroll** — Salary structures, earnings/deductions breakdown, monthly payroll batches, and payslips.
- **Module 9: Notifications** — System alerts, notifications, delivery channel state, and read receipts.
- **Module 10: Documents** — Employee documentation, verification state, and policy attachment metadata.
- **Module 11: Password Reset** — Time-bound, secure one-time verification tokens for account recovery.
- **Module 12: Audit Logs** — Append-only, tamper-evident audit logging for all transactional events.

---

## 4. Directory Structure

```text
database/
├── migrations/
│   ├── README.md               # Migration versioning rules and roadmap
│   └── V1__create_users.sql    # Migration V1: users table, triggers, and indexes
├── seeds/
│   ├── README.md               # Seed data execution dependencies and rules
│   └── users.sql               # Seed data for demo user accounts
├── schema.sql                  # Master schema definition & active tables
├── seed.sql                    # Master seed orchestration script
└── README.md                   # Master database documentation (this file)
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

4. **Apply Seed Data:**
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

Execute initialization script inside container:
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
2. **Password Cryptography:** User passwords must always be hashed using modern algorithms (Argon2id, bcrypt) with high work factors before insertion into the database.
3. **Principle of Least Privilege:** Production applications should connect using an application-specific user account granted only `DML` privileges (`SELECT`, `INSERT`, `UPDATE`, `DELETE`), rather than the `postgres` superuser.
4. **Encrypted Transport:** Enable SSL (`DB_SSL_MODE=require` or `verify-full`) for all database connections in staging and production deployments.
5. **SQL Injection Prevention:** All backend queries must utilize parameterized statements or prepared queries without exception.
