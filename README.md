# Dayflow — Human Resource Management System (HRMS)

An enterprise-grade, modern HRMS platform designed for the Odoo Hackathon. Dayflow digitizes core HR operations including employee onboarding & profile management, real-time attendance tracking, leave management, payroll visibility, and HR/Admin approval workflows.

---

## 📁 Repository Structure

The repository is organized so that `index.html` and the frontend application reside at the root level of the `main` branch, enabling direct support for **GitHub Pages** alongside full-stack backend services:

```text
├── .github/
│   └── workflows/
│       └── deploy.yml        # Automated GitHub Actions workflow for GitHub Pages
├── backend/                  # Node.js Express server & REST API
│   ├── server.js
│   ├── db.js
│   └── package.json
├── database/                 # PostgreSQL schemas, migrations & seed data
│   ├── schema.sql
│   ├── seed.sql
│   └── migrations/
├── public/                   # Static assets (favicons, SVGs, and SPA 404 handler)
│   ├── favicon.svg
│   ├── icons.svg
│   └── 404.html
├── src/                      # React 18 + Tailwind CSS v4 frontend source code
│   ├── components/           # UI components, layout, common elements
│   ├── context/              # Auth and Toast contexts
│   ├── pages/                # Employee, Admin, and Authentication pages
│   ├── services/             # API services and clients
│   ├── App.jsx               # Main router and route configuration
│   └── main.jsx              # React DOM entry point
├── dist/                     # Production build artifacts
├── index.html                # Main application entry point (at repository root)
├── vite.config.js            # Vite configuration with relative base URL
├── package.json              # Project dependencies and development scripts
└── README.md
```

---

## 🌐 Enabling GitHub Pages

This project is pre-configured with automated GitHub Actions to deploy to **GitHub Pages** on every push to `main`.

### Setup Steps:
1. Go to your repository on GitHub:  
   `https://github.com/koushik-2006/Odoo-Hackathon-Dayflow-Human-Resource-Management-System`
2. Click on **Settings** (top right tab).
3. In the left sidebar, click on **Pages** (under *Code and automation*).
4. Under **Build and deployment** > **Source**, select **GitHub Actions**.
5. Push any commit to `main` (or trigger the workflow manually from the **Actions** tab).
6. Once the action runs, your site will be live at:  
   `https://koushik-2006.github.io/Odoo-Hackathon-Dayflow-Human-Resource-Management-System/`

> **Note on Client-Side Routing**: `public/404.html` and `index.html` contain the GitHub Pages SPA redirect handler, ensuring direct links and page refreshes on sub-routes (such as `/login`, `/employee/dashboard`, or `/admin/attendance`) work seamlessly without 404 errors.

---

## 🚀 Running Locally

### 1. Frontend Development Server
Install dependencies and launch the Vite development server from the repository root:
```bash
npm install --legacy-peer-deps
npm run dev
```
The frontend will start at: `http://localhost:3000`

### 2. Backend API Server
To start the backend server:
```bash
npm run server
# or navigate to the backend directory:
cd backend
npm install
npm run dev
```
The backend server will run at: `http://localhost:5000`

### 3. Build for Production
To build the optimized static assets:
```bash
npm run build
```
To test and preview the production build locally:
```bash
npm run preview
```
