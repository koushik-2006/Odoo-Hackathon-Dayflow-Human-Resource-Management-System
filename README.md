# Dayflow — Human Resource Management System (HRMS)

> **Odoo Hackathon Full-Stack Multi-Branch Integration**  
> *Every workday, perfectly aligned.*

Dayflow is an enterprise-grade, modern Human Resource Management System (HRMS) organized in a clean three-tier architecture (**Frontend**, **Backend**, and **Database**). It integrates contributions from across all hackathon development branches into a unified, locally runnable platform with automated GitHub Pages deployment for the frontend.

---

## 🌐 Live GitHub Pages Deployment

The React/Vite frontend is built and deployed automatically via GitHub Actions:

🔗 **Live Application:** [https://koushik-2006.github.io/Odoo-Hackathon-Dayflow-Human-Resource-Management-System/](https://koushik-2006.github.io/Odoo-Hackathon-Dayflow-Human-Resource-Management-System/)

> ⚠️ **Architecture & Hosting Notice**  
> - **GitHub Pages hosts only the static compiled frontend (`frontend/dist`)**.  
> - The **Spring Boot (Java 17)** / **Node.js Express** backend and **PostgreSQL** database run on a dedicated server environment or local machine.  
> - The frontend features an **intelligent offline fallback system**: if the backend server is unreachable, mock datasets automatically populate all views for seamless demonstration and testing.

---

## 📁 Three-Tier Repository Structure

```text
Odoo-Hackathon-Dayflow-Human-Resource-Management-System/
├── .github/
│   └── workflows/
│       └── deploy-frontend.yml # GitHub Actions workflow deploying dist to GitHub Pages
├── public/                     # Static assets (favicon, icons, 404.html SPA handler)
├── src/                        # React 19 UI Components, WebGL shaders, Pages, Context, Services
├── index.html                  # Frontend DOM entry point & SPA redirect decoder
├── package.json                # Frontend dependencies & npm scripts
├── package-lock.json           # Locked frontend dependencies
├── vite.config.js              # Vite configuration with GitHub Pages base path
├── backend/                    # Spring Boot 3 Java 17 + Node.js Express server
│   ├── pom.xml                 # Spring Boot Maven configuration
│   ├── src/                    # Spring Boot entities, controllers, services, migrations
│   ├── server.js               # Node.js Express API fallback server
│   ├── db.js                   # Node pg pool database connection
│   └── package.json            # Node backend dependencies
├── database/                   # PostgreSQL persistence layer
│   ├── schema.sql              # Master DDL schema (12 modular tables)
│   ├── seed.sql                # Core seed data
│   ├── migrations/             # SQL versioned migrations (V1 to V11)
│   └── seeds/                  # 500 realistic synthetic users and profiles
├── docker-compose.yml          # Instant local PostgreSQL database container
├── .env.example                # Unified environment variables template
├── .gitignore                  # Git tracking rules
└── README.md                   # Complete system documentation
```

---

## 👥 Hackathon Branch Contributions Integrated

| Contributor / Branch | Key Contributions Integrated |
| :--- | :--- |
| **Kumaran** (`origin/Kumaran`) | **Database Persistence Layer**: 12 modular tables (`users`, `employees`, `attendance`, `leave_requests`, `payroll`, `departments`, `audit_logs`, `password_reset_tokens`), Flyway migrations, and 500 synthetic seed users. |
| **ManojRajivee** (`origin/ManojRajivee`) | **Backend Services & Business Logic**: Attendance rules, check-in/out logic, leave application, approval/rejection workflows, and Flyway database migrations in Spring Boot. |
| **Mukesh** (`origin/Mukesh`) | **Admin Operations & Analytics**: Admin dashboard metrics, employee directory filters, status PATCH endpoints, payroll control APIs, and employee details editing. |
| **Koushik** (`origin/Koushik`) | **Employee Experience & WebGL UI**: Module 4–7 employee workflows, dark glassmorphic design system, and custom WebGL shaders (LightTunnel, BorderGlow, SpecularButton, WarpText). |

---

## 🚀 Running the Full Stack Locally

Run the complete Dayflow HRMS application locally in three simple steps:

### Step 1: Database (PostgreSQL)

You can launch the database using Docker Compose or your local PostgreSQL installation:

#### Option A: Docker Compose (Instant Zero-Config)
```bash
docker compose up -d
```
*This automatically starts PostgreSQL on port `5432`, creates the `dayflow` database, and runs `schema.sql` and `seed.sql`.*

#### Option B: Local PostgreSQL
```bash
createdb -U postgres dayflow
psql -U postgres -d dayflow -f database/schema.sql
psql -U postgres -d dayflow -f database/seed.sql
```

---

### Step 2: Backend API

#### Option A: Spring Boot Backend (Primary — Port 8080)
```bash
cd backend
./mvnw spring-boot:run
# On Windows PowerShell / CMD:
mvnw.cmd spring-boot:run
```
*API Base URL:* `http://localhost:8080/api`  
*Swagger Documentation:* `http://localhost:8080/swagger-ui.html`

#### Option B: Node.js Express Server (Fallback — Port 5000)
```bash
cd backend
npm install
npm run dev
```
*API Base URL:* `http://localhost:5000/api`

---

### Step 3: Frontend (React + Vite — Port 3000)
```bash
npm install --legacy-peer-deps
npm run dev
```
*Application URL:* `http://localhost:3000`

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` in the root:
```bash
cp .env.example .env
```

| Variable | Default | Purpose |
| :--- | :--- | :--- |
| `VITE_API_URL` | `http://localhost:8080/api` | API endpoint for frontend requests |
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_NAME` | `dayflow` | PostgreSQL database name |
| `DB_USERNAME` | `postgres` | PostgreSQL username |
| `DB_PASSWORD` | `postgres_password` | PostgreSQL password |

---

## 🌐 GitHub Pages Deployment Details

The `.github/workflows/deploy-frontend.yml` workflow automatically builds the project at root and publishes `dist` to GitHub Pages on every push to `main`:
- **Source setting in GitHub repository:** Settings ➔ Pages ➔ Build and deployment ➔ Source: **GitHub Actions** (recommended for Vite/React single-page apps)
- **Base Path:** `/Odoo-Hackathon-Dayflow-Human-Resource-Management-System/` configured in `vite.config.js`.
- **SPA Fallback:** `public/404.html` and `index.html` handle direct navigation and page refreshes on sub-routes without 404 errors.

---

## 📄 License
This project is licensed under the MIT License for the Odoo Hackathon.
