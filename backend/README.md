# Dayflow HRMS — Spring Boot Backend

Production-ready enterprise Spring Boot 3 backend for **Dayflow** (Human Resource Management System).

## Tech Stack
- Java 17
- Spring Boot 3.4.2
- Spring Data JPA / Hibernate
- Spring Security + JWT Authentication (HS256)
- PostgreSQL / H2 Database
- Lombok
- OpenAPI 3.0 / Swagger UI

## Getting Started

### Prerequisites
- JDK 17+
- Maven 3.8+
- PostgreSQL (optional; falls back to in-memory H2 if DB is not reachable)

### Running the Application

```bash
cd backend
mvn spring-boot:run
```

The application will start on `http://localhost:8080`.

### Swagger API Documentation
Open your browser and navigate to:
`http://localhost:8080/swagger-ui.html`

### Default Pre-Seeded Users
- **Admin**: `admin@dayflow.io` / `Admin@123` (Employee ID: `EMP001`)
- **HR**: `hr@dayflow.io` / `HR@12345` (Employee ID: `EMP002`)
- **Employee**: `employee@dayflow.io` / `Employee@123` (Employee ID: `EMP003`)
