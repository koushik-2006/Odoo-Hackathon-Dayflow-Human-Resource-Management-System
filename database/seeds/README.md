# Database Seeds — Dayflow HRMS

This directory (`database/seeds/`) contains modular seed data scripts used to populate the **Dayflow Human Resource Management System (HRMS)** with baseline configuration and representative mock data for development, demonstration, and automated testing environments.

---

## 📌 Overview

Seed scripts insert structured initial records once the respective database tables have been established through migrations. They enable developers, testers, and evaluators to work with an instantly functional environment populated with realistic HR records.

> **Status (Module 1 - Database Initialization):**  
> No seed files or records are inserted at this stage. This directory establishes the architectural pattern and execution dependencies for future seed datasets.

---

## 🗂️ Planned Seed Files & Execution Dependency Order

Because relational integrity is enforced by foreign keys, seed files MUST be executed in the strict dependency order listed below:

| Execution Order | Planned Seed File | Target Scope & Seed Content |
| :---: | :--- | :--- |
| **1** | `departments.sql` | Standard corporate departments (Engineering, HR, Finance, Operations, Sales, Marketing) |
| **2** | `users.sql` | Demo accounts with pre-hashed passwords and defined roles (Super Admin, HR Manager, Team Lead, Employee) |
| **3** | `employees.sql` | Rich employee profiles linked to departments, users, designations, and manager relationships |
| **4** | `leave_types.sql` | Standard organizational leave policies (Annual, Sick, Casual, Maternity, Paternity) |
| **5** | `attendance.sql` | Sample 30-day clock-in/out logs, shift records, and punctuality flags |
| **6** | `leave_requests.sql` | Demonstration leave applications in various states (Approved, Pending, Rejected) |
| **7** | `payroll.sql` | Salary structure templates, monthly pay runs, deductions, and itemized sample payslips |
| **8** | `notifications.sql` | Sample system alerts, broadcast notifications, and unread indicator events |

> ⚠️ **Important:** Do NOT create these seed files or insert mock data during Module 1. They will be added systematically as each corresponding table schema is implemented.

---

## 🔒 Security & Data Integrity Rules for Seeds

1. **Pre-Hashed Passwords Only:** All user passwords in seed scripts MUST be securely hashed (e.g., using Argon2id or bcrypt with high work factor). Never store or seed plain-text passwords.
2. **Synthetic Data (No PII):** All names, email addresses, phone numbers, and financial details must be completely synthetic. Never use real personal identifiable information.
3. **Deterministic UUIDs / IDs:** Where relationships exist between tables, use deterministic foreign keys or lookup references so seeding produces repeatable, consistent results.
4. **Environment Isolation:** Seed files containing mock demo records must NEVER be executed against production environments.
