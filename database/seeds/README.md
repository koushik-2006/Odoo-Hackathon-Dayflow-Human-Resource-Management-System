# Database Seeds — Dayflow HRMS

This directory (`database/seeds/`) contains modular seed data scripts used to populate the **Dayflow Human Resource Management System (HRMS)** with baseline configuration and representative mock data for development, demonstration, and automated testing environments.

---

## 📌 Overview

Seed scripts insert structured initial records once the respective database tables have been established through migrations. They enable developers, testers, and evaluators to work with an instantly functional environment populated with realistic HR records.

---

## 🗂️ Seed Files & Execution Dependency Order

Because relational integrity is enforced by foreign keys, seed files MUST be executed in the strict dependency order listed below:

| Execution Order | Seed File | Target Scope & Seed Content | Implemented Module | Dependencies |
| :---: | :--- | :--- | :---: | :--- |
| **1** | `departments.sql` | Standard corporate departments (`IT`, `HR`, `FIN`, `MKT`, `SALES`, `OPS`) | **Module 3 (ACTIVE)** | *None (Independent)* |
| **2** | `users.sql` | Demo accounts with pre-hashed bcrypt passwords and Dayflow roles (`ADMIN`, `HR`, `EMPLOYEE`) | **Module 2 (ACTIVE)** | *None (Independent)* |
| **3** | `employees.sql` | Employee profile records, personal details, designations, and linkages | **Module 4 (ACTIVE)** | **Depends on `users` (1:1) & `departments` (N:1)** |
| **4** | `leave_types.sql` | Standard organizational leave policies (Annual, Sick, Casual, Maternity, Paternity) | *Module 6 (Planned)* | *None* |
| **5** | `attendance.sql` | Sample 30-day clock-in/out logs, shift records, and punctuality flags | *Module 5 (Planned)* | **Depends on `employees`** |
| **6** | `leave_requests.sql` | Demonstration leave applications in various states (Approved, Pending, Rejected) | *Module 7 (Planned)* | **Depends on `employees` & `leave_types`** |
| **7** | `payroll.sql` | Salary structure templates, monthly pay runs, deductions, and itemized sample payslips | *Module 8 (Planned)* | **Depends on `employees`** |
| **8** | `notifications.sql` | Sample system alerts, broadcast notifications, and unread indicator events | *Module 9 (Planned)* | **Depends on `users` / `employees`** |

> ⚠️ **Important:** Do NOT manually create seed files for unreleased modules. They will be added systematically as each corresponding table schema is implemented.

---

## 🔒 Security & Data Integrity Rules for Seeds

1. **Pre-Hashed Passwords Only:** All user passwords in seed scripts MUST be securely hashed (e.g., using bcrypt with high work factor). Never store or seed plain-text passwords.
2. **Synthetic Data (No PII):** All names, email addresses, phone numbers, and financial details must be completely synthetic. Never use real personal identifiable information.
3. **Deterministic UUIDs / IDs:** Where relationships exist between tables, use deterministic primary and foreign keys so seeding produces repeatable, consistent results.
4. **Environment Isolation:** Seed files containing mock demo records must NEVER be executed against production environments.
