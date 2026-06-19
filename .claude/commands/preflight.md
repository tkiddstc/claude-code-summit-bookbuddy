Run the pre-commit checklist before I commit:

1. Run the test suite with `node --test` and report any failures
2. Check for console.log statements that look like debugging leftovers (not the server startup log)
3. Grep for TODO or FIXME comments and list them
4. Run `git diff --staged` and summarize what's about to be committed
5. If everything passes, say "Ready to commit." If not, list what needs fixing.
