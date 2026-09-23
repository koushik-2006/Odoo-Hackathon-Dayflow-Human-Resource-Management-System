# Dayflow — Human Resource Management System (HRMS)

> **Odoo Hackathon Project**  
> *Every workday, perfectly aligned.*

Dayflow is a modern, enterprise-grade Human Resource Management System (HRMS) built for the modern workforce. Designed with an ultra-sleek dark glassmorphic design system and WebGL-accelerated UI components, Dayflow digitizes core organizational workflows including employee onboarding, biometric/real-time attendance tracking, multi-tier leave approval lifecycles, transparent payroll visibility, and administrative analytics.

---

## 🌐 Live GitHub Pages Deployment

The React/Vite frontend is automatically built and deployed to **GitHub Pages** on every push to `main` via GitHub Actions:

🔗 **Live Application:** [https://koushik-2006.github.io/Odoo-Hackathon-Dayflow-Human-Resource-Management-System/](https://koushik-2006.github.io/Odoo-Hackathon-Dayflow-Human-Resource-Management-System/)

> ⚠️ **Architecture & Hosting Limitation Notice**  
> **GitHub Pages hosts only the static compiled React/Vite frontend.**  
> The **Spring Boot (Java 17)** backend or **Node.js Express** API and **PostgreSQL** database run separately on their respective server environments (local machine, Docker, Render, Railway, or AWS).  
> The frontend features an **intelligent offline fallback system**: if the backend server is not active or reachable, all dashboard metrics, employee directories, attendance feeds, leave requests, and payroll records automatically populate with realistic synthetic data for an uninterrupted presentation and test drive.

---

## ✨ Implemented Features

### 1. Employee Management & Profiles
- **Directory & Quick Search**: Filter employees across departments, designations, and employment statuses.
- **Detailed Employee Profiles**: View personal information, emergency contacts, organizational hierarchy, salary grade, and joined date.
- **Interactive Profile Editing**: Edit employee records with real-time field validation and modal forms.

### 2. Time & Attendance Tracking
- **One-Click Check-In / Check-Out**: Real-time daily attendance recording with timestamp verification.
- **Presence Statuses**: Automated status categorization (`PRESENT`, `ABSENT`, `HALF_DAY`, `LEAVE`).
- **History & Logs**: Tabulated monthly attendance overview with working hour calculations.

### 3. Leave Management & Approval Lifecycle
- **Leave Applications**: Apply for Paid, Sick, or Casual leaves with date range picking and reason specification.
- **Administrative Review Workflows**: Approve or reject pending leave requests in real time.
- **Rejection Reason Dialog**: Dedicated modal capturing administrative rationale for rejections.
- **Leave Balances**: Real-time tracking of remaining leave entitlements per employee.

### 4. Payroll & Compensation Visibility
- **Itemized Salary Breakdown**: Clear visibility of Basic Salary, HRA, Conveyance, Allowances, Tax Deductions, and Net Pay.
- **Administrative Salary Controls**: Authorized administrators can adjust salary structures with audit logging.
- **Payslip Previews**: Clean, itemized payment summaries for employees.

### 5. HR & Admin Governance
- **Executive Analytics Dashboard**: Key metrics including total headcount, daily attendance rate, pending leave requests, and department distribution charts.
- **Audit Logging & Activity Streams**: Track historical changes, role assignments, and status modifications.

### 6. Authentication & Role-Based Access Control (RBAC)
- **Multi-Role Security**: Built-in authorization guards for `Admin`, `HR`, and `Employee` roles.
- **Instant Demo Logins**: Pre-configured instant credentials for Admin, HR, and Employee personas to test-drive features immediately.

### 7. Modern SaaS Aesthetic & WebGL Acceleration
- **Dark Glassmorphism**: Polished dark UI with translucent backdrops, glowing borders, and smooth transitions.
- **Custom Shaders**: WebGL LightTunnel, KineticGrid, Aurora background effects, SpecularButton micro-interactions, and WarpText animations.

---

## 🛠 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite 6, Tailwind CSS v4, Framer Motion, Lucide Icons, Recharts, OGL (WebGL) |
| **Routing** | React Router v7 with GitHub Pages SPA redirect fallback |
| **Primary Backend** | Spring Boot 3.4.2 (Java 17), Spring Data JPA, Spring Security, Flyway, Lombok, JWT |
| **Fallback Backend** | Node.js Express server (`backend/server.js`, `backend/db.js`) |
| **Database** | PostgreSQL 14+ with 12 modular tables, Flyway migrations, and 500 synthetic seed users |
| **CI/CD & Hosting** | GitHub Actions (`.github/workflows/deploy.yml`) deploying to GitHub Pages |

---

## 📁 Repository Structure

```text
Odoo-Hackathon-Dayflow-Human-Resource-Management-System/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions automated workflow for Pages
├── backend/                    # Full-stack backend implementations
│   ├── pom.xml                 # Spring Boot Maven configuration
│   ├── src/                    # Spring Boot 3 Java 17 source code & entities
│   ├── server.js               # Node.js Express API fallback server
│   ├── db.js                   # Node pg pool connection
│   └── package.json            # Node backend dependencies
├── database/                   # PostgreSQL persistence layer
│   ├── schema.sql              # Master DDL database schema (12 modules)
│   ├── seed.sql                # Synthetic seed records
│   ├── migrations/             # SQL versioned migrations
│   └── seeds/                  # 500 realistic synthetic users and profiles
├── public/                     # Static assets & SPA routing fallback
│   ├── 404.html                # GitHub Pages SPA redirect encoder
│   ├── favicon.svg             # Application logo / icon
│   └── icons.svg               # SVG icon sprites
├── src/                        # React 19 / Tailwind CSS v4 frontend
│   ├── components/             # Reusable UI & WebGL shader components
│   ├── context/                # AuthContext and ToastContext
│   ├── data/                   # Fallback demo datasets
│   ├── hooks/                  # Custom React hooks (useAuth, etc.)
│   ├── layouts/                # AdminLayout, EmployeeLayout, AuthLayout
│   ├── pages/                  # Landing, Admin, Employee, and Auth views
│   ├── routes/                 # ProtectedRoute, AdminRoute, EmployeeRoute
│   ├── services/               # Axios/Fetch API service clients with fallbacks
│   ├── utils/                  # Formatters, constants, and storage helpers
│   ├── App.jsx                 # Application router and layout orchestrator
│   ├── index.css               # Global stylesheet and Tailwind directives
│   └── main.jsx                # DOM mounting entry point
├── .env.example                # Environment variables template
├── .gitignore                  # Git tracking exclusions
├── index.html                  # Root HTML entry point & SPA redirect decoder
├── package.json                # Frontend dependencies and npm scripts
├── package-lock.json           # Locked dependency tree
├── vite.config.js              # Vite configuration with GitHub Pages base path
└── README.md                   # Project documentation
```

---

## 🚀 Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/koushik-2006/Odoo-Hackathon-Dayflow-Human-Resource-Management-System.git
cd Odoo-Hackathon-Dayflow-Human-Resource-Management-System
```

### 2. Frontend Setup (React + Vite)
```bash
# Install frontend dependencies
npm install --legacy-peer-deps

# Start the Vite development server
npm run dev
```
The frontend will start at: `http://localhost:3000`

### 3. Backend Setup

#### Option A: Spring Boot Backend (Primary)
```bash
cd backend

# Run with Maven (requires Java 17 and Maven)
./mvnw spring-boot:run
# or on Windows:
mvnw.cmd spring-boot:run
```
The Spring Boot REST API will be active at: `http://localhost:8080/api`

#### Option B: Node.js Express Backend (Fallback / Zero-Config)
```bash
# From repository root:
npm run server

# Or directly in backend:
cd backend
npm install
npm run dev
```
The Node.js Express REST API will run at: `http://localhost:5000/api`

### 4. Database Setup (PostgreSQL)
Ensure PostgreSQL is running locally, then initialize the `dayflow` database:
```bash
# Create database
createdb -U postgres dayflow

# Execute master schema and synthetic seed data
psql -U postgres -d dayflow -f database/schema.sql
psql -U postgres -d dayflow -f database/seed.sql
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` to configure local database and backend connection details:
```bash
cp .env.example .env
```

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | `http://localhost:8080/api` | Base URL for Spring Boot / Node backend API |
| `DB_HOST` | `localhost` | PostgreSQL server hostname |
| `DB_PORT` | `5432` | PostgreSQL server port |
| `DB_NAME` | `dayflow` | PostgreSQL database name |
| `DB_USERNAME` | `postgres` | Database username |
| `DB_PASSWORD` | `YOUR_PASSWORD_HERE` | Database password |

---

## 🚀 GitHub Pages & Deployment Workflow

### Automated GitHub Actions Workflow
The `.github/workflows/deploy.yml` workflow automatically:
1. Checks out the repository.
2. Sets up Node.js 20.
3. Installs dependencies using `npm ci --legacy-peer-deps`.
4. Builds the production bundle via `npm run build`.
5. Uploads the generated `dist/` directory as a GitHub Pages artifact.
6. Deploys the static site to GitHub Pages.

### Configuring GitHub Pages in Repository Settings:
If GitHub Pages is not yet active on the repository:
1. Open [Repository Settings](https://github.com/koushik-2006/Odoo-Hackathon-Dayflow-Human-Resource-Management-System/settings).
2. Click **Pages** in the left sidebar under *Code and automation*.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. Trigger the workflow manually from the **Actions** tab or push a new commit to `main`.

### Single Page App (SPA) Deep Linking Support
Because GitHub Pages natively serves static files and returns a 404 for unknown routes:
- `public/404.html` intercepts sub-path requests (e.g., `/admin/attendance`, `/employee/dashboard`) and redirects them to the root URL with the route query string.
- `index.html` contains the complementary script that restores the original route and passes it to React Router's `<BrowserRouter basename="/Odoo-Hackathon-Dayflow-Human-Resource-Management-System/">`.
This guarantees that direct links, browser refreshes, and bookmarks work without encountering 404 errors.

---

## 👥 Contributors & Hackathon Team

- **Koushik** — Employee workflows, Profile management, and GitHub Pages integration
- **Kumaran** — PostgreSQL schema design, migrations, and synthetic seed datasets
- **ManojRajivee** — Attendance rules, leave application & approval workflows
- **Mukesh** — Administrative dashboard metrics, employee directory, and payroll management controls

---

## 📄 License
This project is licensed under the MIT License for the Odoo Hackathon.
