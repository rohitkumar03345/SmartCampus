# SmartCampus

An AI assisted campus helpdesk built with React, Express, and PostgreSQL. Students submit and track campus issues, staff manage their department queue, and administrators monitor campus wide trends.

## Run locally

Requirements: Node.js 20+, npm, and PostgreSQL.

1. Create a PostgreSQL database: `createdb smartcampus`
2. Copy `.env.example` to `.env`. Set `DATABASE_URL` if your local PostgreSQL connection differs, and replace `JWT_SECRET` with a long random value.
3. Install and start the app:

   ```sh
   npm install
   npm run dev
   ```

   The API initializes the database schema and campus knowledge guides on startup. Open <http://localhost:5173>.

4. To populate demo accounts and sample tickets, run `node --env-file=.env server/seedDemo.js` once.

Demo accounts (seed step required):

| Role | Email | Password |
|---|---|---|
| Student | student@smartcampus.dev | Student123! |
| IT staff | staff@smartcampus.dev | Staff123! |
| Admin | admin@smartcampus.dev | Admin123! |

The public registration form always creates a STUDENT account. Staff and admin accounts are provisioned by an administrator outside public registration.

## AI and knowledge assistant

Complaint classification runs without external credentials using transparent keyword rules. Set `OPENAI_API_KEY` in `.env` to use the OpenAI chat completions API; `OPENAI_MODEL` selects the model. The service validates all returned categories, priorities, and departments and falls back locally on errors. Do not commit `.env` or expose the key to the browser.

The Campus Knowledge Assistant retrieves the closest matching seeded PostgreSQL document using simple token matching and shows its filename. It deliberately returns a fixed “not found” response when there is no match instead of generating unsupported policy claims. This is a small retrieval demo, not embeddings based RAG.

## Database relationships

- `users.department_id` optionally points to `departments.id` for staff membership.
- `complaints.student_id` points to the submitting user; `complaints.department_id` points to the assigned department.
- `complaint_history.complaint_id` points to a ticket and cascades on ticket deletion; `changed_by` points to the user who made the update.
- `knowledge_documents` stores named campus reference documents.
- Indexes cover complaint student, department, status, and priority fields.

## API overview

See [docs/api.md](docs/api.md) for routes and authorization. Architecture and interview notes are in [docs/architecture.md](docs/architecture.md) and [docs/interview_questions.md](docs/interview_questions.md).

## Production notes

This is a portfolio starter. Before a real deployment, use HTTPS, a managed secret store, rate limiting, email verification/password reset, structured audit logging, backups, and institution approved knowledge content. Public registration does not permit privileged roles. Staff ticket reads and status changes are checked against department membership on the server.
