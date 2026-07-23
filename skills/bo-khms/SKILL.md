---
description: Business Online QHSE/KHMS module — Non-Conformance Reports (NCR/avvik), quality management, HSE incidents, audits, and corrective actions. Auto-invoked for NCR management, quality tracking, and HSE compliance.
argument-hint: "[NCR ID or search term]"
allowed-tools:
  - Read
  - Grep
  - Glob
  # NCR server (4 tools)
  - mcp__claude_ai_Business_Online_NCR__create_ncr
  - mcp__claude_ai_Business_Online_NCR__retrieve_ncr
  - mcp__claude_ai_Business_Online_NCR__retrieve_ncrs
  - mcp__claude_ai_Business_Online_NCR__update_ncr
---

# Business Online QHSE (KHMS)

Quality, Health, Safety, and Environment management through BO. Core entity: NCR (Non-Conformance Report / Avvik).

If the user provided an argument (`$ARGUMENTS`), treat it as an NCR ID or search term: look up matching NCR cards and present the results.

## Capabilities via MCP

### NCR Cards
- **List NCRs**: `retrieve_ncrs` — Filter by type (typeRegistration), project, company, lead, department, or search term. Supports pagination.
- **Get NCR details**: `retrieve_ncr` — Full NCR with description, root cause, corrective actions, attachments
- **Create NCR**: `create_ncr` — Report new non-conformance; requires title + typeRegistration (Customer Feedback, Non-Conformance, Observation, Improvements, Supplier Deviation)
- **Update NCR**: `update_ncr` — Update status, assign responsible, add root cause, corrective actions, close NCR

## NCR Workflow
1. **Reported**: Initial registration with description and category
2. **Under Investigation**: Root cause analysis assigned
3. **Corrective Action**: Actions defined and assigned
4. **Verification**: Actions verified as effective
5. **Closed**: NCR resolved and documented

## NCR Categories (typical)
- Quality deviation
- HSE incident / near-miss
- Customer complaint
- Supplier non-conformance
- Internal audit finding
- Environmental incident

## Patterns

### NCR Dashboard Review
1. `retrieve_ncrs` with type filter (or search) for open NCRs
2. Group by category and severity for trend analysis
3. Identify overdue NCRs (investigation or corrective action past due)
4. Drill into specific NCRs for detail

### Incident Reporting
1. `create_ncr` with incident details
2. Assign responsible person for investigation
3. Set severity and category
4. Follow up with timeline events

### NCR Lifecycle Management
1. `retrieve_ncr` to review current state
2. `update_ncr` to progress through workflow stages
3. Update root cause, corrective actions, and responsible person as investigation progresses
4. Close NCR when corrective actions are verified

## Integration with Other Modules
- NCRs can link to **Projects** (quality issues on project deliverables)
- NCRs can link to **Companies** (customer complaints, supplier issues)
- **Document management**: Attach evidence, photos, reports to NCR cards
- **Notifications**: Responsible persons notified via email/Teams

## Compliance Notes
- NCR data supports ISO 9001, ISO 14001, ISO 45001 requirements
- Audit trail: all changes are logged with timestamp and user
- Reports can be generated for management review
- Data retention follows configured policies per tenant

## When MCP Calls Fail

If an NCR tool call fails:
- **Timeout or connection error**: Tell the user the NCR service is unavailable. Suggest waiting a moment and retrying.
- **Not found (404)**: The NCR ID may be wrong — ask the user to verify it, or list open NCRs with `retrieve_ncrs`.
- **Validation error**: Show the error message. Common issues: missing required fields (title, typeRegistration) when creating NCRs.
- NCR is the smallest MCP server (4 tools). If it's down, offer to help with CRM or Projects in the meantime.

## Reference Documentation
For detailed user guides:
- `${CLAUDE_SKILL_DIR}/../../docs/brukermanual/khms/introduksjon.md`
- `${CLAUDE_SKILL_DIR}/../../docs/brukermanual/khms/qdms.md`
- `${CLAUDE_SKILL_DIR}/../../docs/brukermanual/khms/rapportering.md` — Prosedyreveiledning for KHMS-rapportering (implementeringssjekkliste)
- `${CLAUDE_SKILL_DIR}/../../docs/brukermanual/khms/rapportering/khms-rapporteringskort.md`
- `${CLAUDE_SKILL_DIR}/../../docs/brukermanual/khms/rapportering/khms-arbeidsrom.md`
- `${CLAUDE_SKILL_DIR}/../../docs/brukermanual/khms/rapportering/anonym-rapportering.md`
- `${CLAUDE_SKILL_DIR}/../../docs/brukermanual/khms/bpm.md`
- `${CLAUDE_SKILL_DIR}/../../docs/brukermanual/khms/risikostyring.md`
