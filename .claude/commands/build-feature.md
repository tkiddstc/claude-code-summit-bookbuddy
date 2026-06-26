Build this feature: $ARGUMENTS

Follow this pipeline — complete each phase fully before moving to the next:

Phase 1 — Code Writer:
Read .claude/skills/roles/code-writer.md and follow those rules. Implement the feature.

Phase 2 — Test Writer:
Read .claude/skills/roles/test-writer.md and follow those rules. Write tests for what you just built.

Phase 3 — Validate:
Run the tests with `node --test`. If any fail:
  a. Read the failure output carefully
  b. Determine if it's a production code bug or a test bug
  c. Fix the right one (go back to the code-writer role if it's production code, or the test-writer role if it's a test bug)
  d. Re-run the tests
  e. Repeat up to 3 times. If still failing after 3 attempts, stop and report: what's failing, what you tried, and what you think the root cause is.

Phase 4 — Reviewer:
Read .claude/skills/roles/reviewer.md and follow those rules. Review all changes.
