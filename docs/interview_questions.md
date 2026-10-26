# Interview talking points

1. **How are roles enforced?** JWT identifies the user; Express middleware checks role, and complaint queries additionally constrain students to their own tickets and staff to their assigned department.
2. **How is the ticket history kept consistent?** Ticket creation and status changes write the complaint and history in a PostgreSQL transaction.
3. **What does the AI do?** It classifies a specific helpdesk workflow into controlled enums and provides a short reason. A local rules fallback preserves ticket creation when the provider is unavailable.
4. **How do you prevent arbitrary AI routing?** Category, priority, and department values are validated against allowlists before persistence.
5. **What is the retrieval strategy?** Small knowledge base documents are ranked with simple token overlap. The answer exposes its source and refuses when no source matches.
6. **What would you improve for production?** Add request rate limits, refresh/session strategy, email verification and recovery, schema migrations, pagination, observability, deployment secrets, and curated institutional policies.
