---
description: Business Online QHSE/KHMS module — Non-Conformance Reports (NCR/avvik), quality management, HSE incidents, audits, and corrective actions. Auto-invoked for NCR management, quality tracking, and HSE compliance.
---

# Business Online QHSE (KHMS)

Quality, Health, Safety, and Environment management through BO. Core entity: NCR (Non-Conformance Report / Avvik).

## Capabilities via MCP

### NCR Cards
- **List NCRs**: `retrieve_all_ncrs` — Filter by status, category, date range, responsible person. Supports pagination.
- **Get NCR details**: `retrieve_specific_ncr_card` — Full NCR with description, root cause, corrective actions, attachments
- **Create NCR**: `create_ncr_card` — Report new non-conformance with category, severity, description, responsible person
- **Update NCR**: `update_specific_ncr_card` — Update status, assign responsible, add root cause, corrective actions, close NCR

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
1. `retrieve_all_ncrs` with status filter for open NCRs
2. Group by category and severity for trend analysis
3. Identify overdue NCRs (investigation or corrective action past due)
4. Drill into specific NCRs for detail

### Incident Reporting
1. `create_ncr_card` with incident details
2. Assign responsible person for investigation
3. Set severity and category
4. Follow up with timeline events

### NCR Lifecycle Management
1. `retrieve_specific_ncr_card` to review current state
2. `update_specific_ncr_card` to progress through workflow stages
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

## Reference Documentation
For detailed user guides:
- `${CLAUDE_SKILL_DIR}/../../docs/brukermanual/khms-introduksjon.md`
- `${CLAUDE_SKILL_DIR}/../../docs/brukermanual/khms-qdms.md`
- `${CLAUDE_SKILL_DIR}/../../docs/brukermanual/khms-rapportering.md`
- `${CLAUDE_SKILL_DIR}/../../docs/brukermanual/khms-rapporteringskort.md`
- `${CLAUDE_SKILL_DIR}/../../docs/brukermanual/khms-bpm.md`
- `${CLAUDE_SKILL_DIR}/../../docs/brukermanual/khms-risikostyring.md`
