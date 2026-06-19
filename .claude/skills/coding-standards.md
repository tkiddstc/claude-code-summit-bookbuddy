---
description: BookBuddy coding standards and conventions
---

# BookBuddy Coding Standards

## Naming
- Use camelCase for all JavaScript variables and functions
- Use kebab-case for file names and URL paths
- Database columns use snake_case (SQLite convention)

## Routes
- Each resource gets its own file in `routes/`
- Route handlers must have try/catch with a 500 response on error
- Validation happens at the top of each handler before any DB calls
- Use parameterized queries (?) for all database operations — never interpolate user input

## Views
- All views include `header.ejs` at the top and `footer.ejs` at the bottom
- Use `<%= %>` for escaped output, `<%- %>` only for includes
- Keep logic minimal in templates — compute values in the route handler

## Database
- Use better-sqlite3 synchronous API
- Access the database via `req.app.locals.db`
- All queries use prepared statements with `.prepare()`

## Testing
- Use the built-in Node.js test runner (`node:test`)
- No external test frameworks
- Test files go in `tests/` with the naming pattern `*.test.js`
