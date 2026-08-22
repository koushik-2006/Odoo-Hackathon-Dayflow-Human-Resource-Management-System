# Database Migrations — Dayflow HRMS

This directory (`database/migrations/`) manages all versioned database schema migrations for the **Dayflow Human Resource Management System (HRMS)**.

---

## 📌 Overview

Database schema changes in Dayflow are applied sequentially using version-controlled SQL migration scripts. Each file represents a single, well-defined, and atomic schema modification.

> **Status (Module 1 - Database Initialization):**  
> No migration files are created in this stage. This directory documents the conventions and architecture to be followed when creating migration scripts in subsequent modules.

---

## 🏷️ Migration Naming Convention

All future migration files MUST strictly adhere to the standard versioning pattern:

```text
V<VersionNumber>__<description_in_snake_case>.sql
```

### Format Rules:
- **Prefix:** Capital letter `V` followed by a sequential integer version number (`1`, `2`, `3`, etc.).
- **Separator:** Exactly two consecutive underscores (`__`).
- **Description:** Clear, descriptive action in snake_case (e.g., `create_users`, `create_departments`).
- **Extension:** `.sql`.

---

## 🗺️ Planned Migration Sequence

The following migration files are scheduled for future development modules:

| Version | Planned File Name | Target Module / Responsibility |
| :--- | :--- | :--- |
| **V1** | `V1__create_users.sql` | User accounts, credentials, roles, and authentication metadata |
| **V2** | `V2__create_departments.sql` | Organizational structure, departments, and hierarchy |
| **V3** | `V3__create_employees.sql` | Employee profiles, personal data, designations, and manager links |
| **V4** | `V4__create_attendance.sql` | Daily attendance, shift definitions, and clock-in/out logs |
| **V5** | `V5__create_leave_types.sql` | Organization leave policy definitions and allowances |
| **V6** | `V6__create_leave_requests.sql` | Leave applications, status tracking, and approval history |
| **V7** | `V7__create_payroll.sql` | Salary structures, monthly pay runs, deductions, and payslips |
| **V8** | `V8__create_notifications.sql` | In-app alerts, broadcast messages, and delivery channels |
| **V9** | `V9__create_documents.sql` | Employee document repository and compliance file tracking |
| **V10** | `V10__create_password_reset_tokens.sql` | Time-bound tokens for secure password recovery |
| **V11** | `V11__create_audit_logs.sql` | Immutable system-wide audit logging and event tracking |

> ⚠️ **Important:** Do NOT manually create any of these migration files during Module 1. They will be authored and applied in their corresponding feature modules.

---

## 🛠️ Best Practices for Writing Migrations

1. **Atomicity:** Wrap each migration file in a transaction block (`BEGIN; ... COMMIT;`) where supported to avoid partial application upon failure.
2. **Idempotency:** Use `IF NOT EXISTS` / `IF EXISTS` safeguards where appropriate.
3. **Foreign Keys & Indices:** Index all foreign key columns and frequently queried search/filter fields.
4. **Timestamps:** Use `TIMESTAMPTZ` (timestamp with time zone) and default to `CURRENT_TIMESTAMP` for audit fields (`created_at`, `updated_at`).
5. **No Destructive Modifiers Without Fallback:** Avoid dropping columns or tables directly in production migration scripts without a multi-phase deprecation plan.
6. **No Data Seeding in Migrations:** Migrations must contain only DDL (Data Definition Language) and essential reference/lookup data. Demo and mock datasets belong exclusively in `database/seeds/`.
