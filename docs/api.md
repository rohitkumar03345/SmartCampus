# API reference

All routes are prefixed with `/api`. Except registration, login, departments, and health, routes require `Authorization: Bearer <token>`.

| Method | Route | Access | Purpose |
|---|---|---|---|
| GET | `/health` | Public | API and database health |
| GET | `/departments` | Public | Department list |
| POST | `/auth/register` | Public | Create student account only |
| POST | `/auth/login` | Public | Issue JWT |
| GET | `/auth/me` | Any signed in user | Current account |
| POST | `/complaints/analyze` | Student | Suggest category, priority, department, reason |
| POST | `/complaints` | Student | Create ticket and history |
| GET | `/complaints` | Any signed in user | Own, department, or admin list; admin filters supported |
| GET | `/complaints/:id` | Authorized owner/team/admin | Details and history |
| PATCH | `/complaints/:id/status` | Staff or admin | Update status and add history comment |
| GET | `/admin/summary` | Admin | KPI and chart aggregates |
| POST | `/knowledge/ask` | Any signed in user | Retrieve a campus guide answer and source |
