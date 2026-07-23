# Changelog

All notable changes to the BO Plugin for Claude are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Changed
- `/bo:status` now computes exact dashboard numbers: the new `*_overview`
  endpoints return paginated rows (not aggregates), so the command pages
  leads/NCRs with `limit=100` and sums client-side, and reads per-activity
  project counts from `totalCount` using `limit=1` filtered calls. NCR
  open-count is computed client-side (`status != "Closed"`) since
  `retrieve_ncrs` has no server-side status filter.
- Re-paired all MCP tool references after the BO MCP servers were redeployed
  with new URLs (2026-07-23). Server renames: `Business_Online_Customer` →
  `Business_Online_CRM`, `Business_Online_Nonconformance` →
  `Business_Online_NCR`. Tool renames across servers:
  - CRM: `retrieve_companies` → `retrieve_all_companies`, `retrieve_contacts` →
    `retrieve_all_contacts`, `retrieve_contact_info` → `retrieve_contact`,
    `update_company` → `update_company_by_id`
  - Leads: `retrieve_all_leads` → `retrieve_leads`, `retrieve_leads_dashboard` →
    `retrieve_leads_overview`, `get_all_lead_types` → `get_lead_types`,
    `retrieve_all_lead_qcps` → `retrieve_lead_qcps`
  - Projects: `retrieve_all_projects` → `retrieve_projects`,
    `retrieve_projects_dashboard` → `retrieve_projects_overview`,
    `get_all_departments` → `get_departments`, `get_all_project_types` →
    `get_project_types`, `retrieve_all_project_qcps` → `retrieve_project_qcps`
  - NCR: `create_ncr_card` → `create_ncr`, `retrieve_all_ncrs` →
    `retrieve_ncrs`, `retrieve_specific_ncr_card` → `retrieve_ncr`,
    `update_specific_ncr_card` → `update_ncr`
  Updated files: `agents/bo-assistant.md`, `skills/bo-crm`, `skills/bo-project`,
  `skills/bo-khms`, `skills/bo-guide`, `commands/status.md`,
  `commands/checklist.md`, `CLAUDE.md`, `README.md`.

### Added
- Four new company-scoped lookup tools now allowed: Leads
  `retrieve_lead_by_company` / `retrieve_leads_by_company` and Projects
  `retrieve_project_by_company` / `retrieve_projects_by_company`.
  Total tool count is now 48 (was 45): CRM 15, Leads 14, Projects 15, NCR 4.

### Removed
- `collect_meddic_data` (Leads) no longer exists on the server and has no
  replacement — lead details carry no MEDDIC structure. MEDDIC qualification
  is now applied conversationally from `retrieve_lead` + timeline events;
  `skills/bo-crm` documents the new approach.

## [0.3.0] — 2026-06-09

### Added
- `/bo:checklist` slash command — guided forms/data-collection consultation
  that produces a `.checklist.json` template (schema v1) ready for import into
  the Business Online Template Manager, plus an `import-guide.md` companion
  carrying the four manual-entry fields (name, code, category, applicable
  project types) and the design rationale. Two modes: greenfield (consultative
  interview) and migration (read existing forms from Word/PDF/Excel/photos).
- `assets/checklist/` directory holding the schema (authored from the canonical
  checklist example, source of truth — no upstream sync), two calibration
  examples (vernerunde HMS and ISO 9001 internrevisjon), the React+Tailwind
  live-preview artifact template, and the import-guide document template.

### Notes
- The `.checklist.json` file contains only the `fields` array. Name, code,
  category, and applicable project types are entered in Template Manager at
  import — the command suggests them and hands the user a paste-ready block,
  but never writes them into the file.
- Nine field types are supported: date, singletext, multiline, choice,
  multichoice, number, yesno, attachment, peoplepicker. The command fetches
  live project types via the Projects MCP (`get_all_project_types`) and
  detects SharePoint GoverningDocumentLibrary links as governing documents.

## [0.2.0] — 2026-05-10

### Added
- `/bo:qcp` slash command — guided business-process consultation that produces
  a `.qcp.json` template (schema v1.0) and a `process-rationale.md` companion
  document. Two modes: greenfield (consultative interview) and migration
  (read existing process docs from BPMN/Word/PDF/screenshots).
- `assets/qcp/` directory holding the schema (pinned to bo-qcp-admin@v0.2.0),
  three calibration examples (HR, project-execution, procurement), the
  React+Tailwind live-preview artifact template, and the rationale document
  template.
- `scripts/check-schema-sync.sh` — verifies the schema copy is in sync with
  upstream bo-qcp-admin@v0.2.0.

### Notes
- Output files conform to the canonical QCP schema published in
  `iQubeS/bo-qcp-admin@v0.2.0`. Upload via the Import button in QCPAdmin (Next).
- The command runs Claude as a process consultant — it challenges legacy
  thinking, references domain-relevant standards (ISO, GDPR, ITIL, etc.),
  and explicitly avoids over-applying frameworks where they don't fit
  (e.g. NOT bringing in ISO 9001 for HR-onboarding).

## [0.1.1] - 2026-04-09

### Fixed
- plugin.json validation: `repository` must be string, not object
- userConfig entries require `type` and `title` fields

## [0.1.0] - 2026-04-08

### Added
- Initial plugin release with 5 skills: bo-crm, bo-project, bo-hr, bo-khms, bo-guide
- BO specialist agent (bo-assistant) with access to all 4 MCP servers (45 tools)
- `/bo:status` dashboard command aggregating pipeline, projects, and NCRs
- 63 Norwegian user manual files organized by module from docs.business-online.no
- Plugin manifest and marketplace configuration for distribution
- User configuration (BO_COMPANY_NAME, BO_LANGUAGE) for tenant personalization
- `.claude/rules/` with data safety and Norwegian context rules

### MCP Servers
- Customer (15 tools): Companies, contacts, QCPs, timeline events
- Leads (13 tools): Leads, MEDDIC qualification, pipeline, QCPs, timeline events
- Projects (13 tools): Projects, departments, types, QCPs, timeline events
- NCR (4 tools): Non-conformance report CRUD

### Notes
- HR module is guidance-only (no MCP tools yet)
- MCP servers are remote/tenant-configured — no local setup needed
