Add a new Express route to BookBuddy.

Create a new route file at `routes/$ARGUMENTS.js` following these rules:
- Use express.Router()
- Add CRUD handlers: GET / (list), GET /:id (detail), POST / (create), POST /:id/delete (delete)
- Inline database queries (matching the existing pattern in routes/books.js)
- Add try/catch to all handlers
- Register the route in server.js under `/$ARGUMENTS`
- Create a basic EJS view at `views/$ARGUMENTS-list.ejs` using the header/footer includes
