# Architecture

The Vite React client talks to the Express REST API through `/api`. JWTs are stored in browser local storage for this portfolio prototype and sent as bearer tokens. Express middleware checks authentication and role. SQL uses parameterized values through the `pg` pool.

## Complaint path

1. A student submits title, description, and location to `/api/complaints/analyze`.
2. `aiService.js` calls the configured LLM or runs a local keyword classifier. LLM output is checked against allowed enums.
3. The student reviews the classification and submits the ticket.
4. Express resolves the department and writes the ticket plus initial status history in one transaction.
5. Staff see only tickets assigned to their department. Status changes create history entries in a transaction.

## Knowledge assistant

Five short documents are stored in `knowledge_documents`. `ragService.js` ranks them by query term overlap and returns the best source text and filename. No relevant match returns a fixed no-answer message. There are no embeddings or vector database in this deliberately small version.

## Roles

- STUDENT: create complaints, see only their own complaints, ask knowledge questions.
- STAFF: see and update tickets whose department matches their account.
- ADMIN: see all complaints and aggregate dashboards, update any ticket.

The client hides irrelevant navigation, but all permission boundaries are enforced in API middleware and ticket queries.
