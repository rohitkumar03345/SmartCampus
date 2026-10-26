-- Student's own complaints
SELECT * FROM complaints WHERE student_id = $1 ORDER BY created_at DESC;
-- Department-scoped staff inbox
SELECT * FROM complaints WHERE department_id = $1 ORDER BY created_at DESC;
-- Ticket history
SELECT * FROM complaint_history WHERE complaint_id = $1 ORDER BY created_at;
