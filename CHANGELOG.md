# Changelog

All notable changes to the BO Plugin for Claude are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- `/bo:risk` slash command — guided risk-assessment consultation that produces a
  `.ra.json` template (ra-template-import v1) ready for import into the Business Online
  QHSE risk-assessment template manager, plus a `-rationale.md` companion recording the
  scale calibration, the vocabulary mapping, and everything the source could not carry.
  Two modes: migration (read an existing Excel register — the common case) and greenfield
  (consultative hazard identification). Needs **no MCP tools**: the format carries its own
  name and description, and the tenant vocabulary arrives as a file, so the command works
  when the BO servers do not.
- `assets/risk/` — the format schema vendored byte-identical from
  `iQubeS/bo-ra@3f1140ab` (`docs/ra-template-import.schema.json`, blob `d98bdba6`), a
  hand-authored schema for the vocabulary manifest (no upstream equivalent exists), the
  two upstream calibration examples, the React+Tailwind live-preview artifact template,
  the rationale document template, and `column-lexicon.md`.
- `scripts/check-ra-vocabulary.mjs` — pre-flight check answering "will this import without
  hand reconciliation?". Reimplements `normalise` / `similarity` / `resolveExact` /
  `suggestMatch` / `resolveLevel` from `bo-ra:src/services/templateJson.ts` so unresolved
  vocabulary and out-of-range levels surface before the file leaves the session, rather
  than on the importer's reconciliation screen. Asserts the same property bo-ra's own
  `templateJsonExamples.test.ts` asserts of its published example: zero reconciliation.
- `test/risk/` — `all-features.ra.json` (every schema branch, expected exit 0) and
  `known-bad.ra.json` (structurally valid, semantically broken, expected exit 1), plus a
  README documenting the expected output of both checks.
- `docs/qa/2026-08-17-bo-risk-command-qa.md` — four manual QA scenarios. Scenario 3
  (no manifest) is a hard gate on merging.
- Four new company-scoped lookup tools now allowed: Leads
  `retrieve_lead_by_company` / `retrieve_leads_by_company` and Projects
  `retrieve_project_by_company` / `retrieve_projects_by_company`.
  Total tool count is now 48 (was 45): CRM 15, Leads 14, Projects 15, NCR 4.

### Changed
- `scripts/check-schema-sync.sh` now covers **both** vendored schemas (qcp and ra) via a
  table rather than hardcoded paths, and compares **git blob SHAs** instead of diffing
  decoded text. The old approach piped upstream content through `echo`, which appended a
  trailing newline the source file may not have — a latent false positive.

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

### Fixed
- **Plugin validation failure: `'settings.json'.agent must be a non-empty string`.** The
  root `settings.json` held `{"agent": {"model": "sonnet", "effort": "high"}}`, but a
  plugin's `settings.json` supports only `agent` and `subagentStatusLine`, and `agent` is
  the *name* of an agent to run as the main session agent — a string, never an object. The
  file was rejected outright, so its `effort: high` had no effect. Removed it and moved the
  intent to where the loader reads it: `agents/bo-assistant.md` already declared
  `model: sonnet`, and now also declares `effort: high`. Setting `agent: "bo-assistant"`
  instead would have been wrong — it would make the BO agent the main session agent for
  everyone with the plugin enabled. Pre-existing since 49f47b5; unrelated to `/bo:risk`.

### Removed
- `collect_meddic_data` (Leads) no longer exists on the server and has no
  replacement — lead details carry no MEDDIC structure. MEDDIC qualification
  is now applied conversationally from `retrieve_lead` + timeline events;
  `skills/bo-crm` documents the new approach.

### Notes
- **No source workbook ships with the plugin.** Customer risk registers are not ours to
  redistribute, so the spreadsheet knowledge lives in `assets/risk/column-lexicon.md` as a
  written reference — sheet classification, Norwegian header variants, the drop list with
  reasons, source-scale shapes, and a Norwegian-to-concept translation table. Migration
  mode is exercised during manual QA against a register the tester already holds.
- **The RA output file is deliberately bilingual.** Vocabulary must match the manifest, so
  `riskSource` and `effectCategory` are English; prose belongs to the company, so `event`,
  `cause`, `consequence` and `minimumPpe` stay Norwegian. §2 of the rationale template
  exists so nobody "fixes" this and breaks resolution.
- **Barriers and residual scores are out of scope by design**, not by omission: a residual
  needs a recorded barrier to justify it, and barriers are what the importing company
  decides rather than something a template should carry. Source `Tiltak` text is rescued
  into rationale §9 for re-entry in the tool rather than discarded.
- **The acceptance limit is deliberately never read**, even though a customer's workbook
  almost always displays it as a coloured matrix. An author who can see where the line
  falls scores the screen instead of the hazard. Neither the command nor the live preview
  uses red/amber/green, and neither computes S×K.
- `bo-ra` carries no tags or releases, so the RA schema is pinned to a commit. Swap for a
  tag when one exists — `scripts/check-schema-sync.sh` has the pin in one place.
- Three findings from reading the upstream resolver shaped the command: level labels must
  be copied **verbatim including typos** (`"Not Dangerousor hazardous"` on Environment);
  an effect category must be written by **name, never by standard** (Finance and
  Reputation both declare ISO 31000, and array order silently decides); and the importer's
  suggester is **blind to translation** — `Klemfare` scores 0.13 against `Crushing and
  trapping`, below the 0.34 threshold, so a Norwegian register yields a list of unresolved
  words with no suggestions attached.

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
