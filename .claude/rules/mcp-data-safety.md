---
paths:
  - "skills/**"
  - "agents/**"
  - "commands/**"
---

# Data Safety Rules

When invoking MCP tools that create or update records (company, contact, lead, project, NCR):

1. Always summarize what will be created/changed before calling the tool
2. Wait for explicit user confirmation
3. After the operation, confirm what was done and show the result
4. If the operation fails, explain the error in plain language and suggest next steps
