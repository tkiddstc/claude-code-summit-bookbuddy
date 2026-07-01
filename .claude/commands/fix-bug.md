Fix this bug: $ARGUMENTS

Follow this pipeline — complete each phase fully before moving to the next:

Phase 1 — Investigator:
Read .claude/skills/roles/investigator.md and follow those rules. Find the root cause. Do NOT change any code — produce a diagnosis.

Phase 2 — Fixer:
Read .claude/skills/roles/fixer.md and follow those rules. Implement the minimal fix for the root cause the investigator found.

Phase 3 — Test Writer:
Read .claude/skills/roles/test-writer.md and follow those rules. Write a regression test that fails without the fix and passes with it.

Phase 4 — Validate:
Run the tests with `node --test`. If any fail:
  a. Read the failure output carefully
  b. Determine if it's a production code bug or a test bug
  c. Fix the right one (go back to the fixer role
     if it's production code, or the test-writer role
     if it's a test bug)
  d. Re-run the tests
  e. Repeat up to 3 times. If still failing after 3 attempts,
     stop and report: what's failing, what you tried, and
     what you think the root cause is.
