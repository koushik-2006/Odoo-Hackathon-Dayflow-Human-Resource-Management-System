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
| **4** | `attendance.sql` | Multi-day clock-in/out logs, shift records, working minutes, and punctuality flags | **Module 5 (ACTIVE)** | **Depends on `employees` (N:1)** |
| **5** | `leave_types.sql` | Standard organizational leave policies (`PAID`, `SICK`, `UNPAID`) | **Module 6 (ACTIVE)** | *Master Reference Data (Independent)* |
| **6** | `leave_requests.sql` | Demonstration leave applications across `PENDING`, `APPROVED`, and `REJECTED` states | **Module 7 (ACTIVE)** | **Depends on `employees` (N:1), `leave_types` (N:1), & `users` (N:1)** |
| **7** | `payroll.sql` | Salary structure records, monthly pay runs, allowances, deductions, and payment records | **Module 8 (ACTIVE)** | **Depends on `employees` (N:1)** |
| **8** | `notifications.sql` | Sample in-app alerts, broadcast notifications, and unread indicators | *Module 9 (Planned)* | **Depends on `users`** |
| **9** | `documents.sql` | Centralized employee HR files, identity proofs, contracts, and company policies | *Module 10 (Planned)* | **Depends on `employees`** |

> ⚠️ **Dependency Rule:** `payroll.sql` references `employees(id)` as the recipient employee. It must be executed after `employees.sql`.

---

## 🔒 Security & Data Integrity Rules for Seeds

1. **Pre-Hashed Passwords Only:** All user passwords in seed scripts MUST be securely hashed (e.g., using bcrypt with high work factor). Never store or seed plain-text passwords.
2. **Synthetic Data (No PII):** All names, email addresses, phone numbers, and financial details must be completely synthetic. Never use real personal identifiable information.
3. **Deterministic UUIDs / IDs:** Where relationships exist between tables, use deterministic primary and foreign keys so seeding produces repeatable, consistent results.
4. **Environment Isolation:** Seed files containing mock demo records must NEVER be executed against production environments.
