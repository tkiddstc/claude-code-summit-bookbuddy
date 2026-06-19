---
description: Security rules for BookBuddy — check these before writing any route handler
---

# Security Checklist

Before writing or modifying any route handler, verify:

1. **No SQL interpolation** — All queries use `?` placeholders via `.prepare()`. Never use template literals or string concatenation with user input in SQL.

2. **Input validation** — Validate and sanitize all user input before use. Check types, ranges, and required fields. Use an allowlist when the valid values are known.

3. **Output escaping** — Use `<%= %>` in EJS templates (auto-escapes HTML). Only use `<%- %>` for trusted includes, never for user data.

4. **Authorization** — Check that the user should have access to the resource they're requesting. Don't rely on obscurity (hidden URLs).

5. **Error messages** — Don't leak internal details (stack traces, SQL errors, file paths) to the user. Log details server-side, show a generic message to the user.
