# Changelog

All notable changes to the BO Plugin for Claude are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/).

## [0.3.1] — 2026-06-18

### Fixed
- `/bo:checklist` link export now sets both `url` and `fileUrl` to the same
  canonical URL on every link. This compensates for a validation rule in the
  importing Template Manager that requires both fields to be non-empty —
  previously external links left `fileUrl` empty (and governing documents left
  `url` empty), which failed import. External vs governing document is still
  recovered from the URL pattern (the `GoverningDocumentLibrary` path), so no
  information is lost. Updated the schema (both fields now required,
  `minLength: 1`), the command instructions, the two calibration examples, and
  the live-preview artifact's link badges.

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
