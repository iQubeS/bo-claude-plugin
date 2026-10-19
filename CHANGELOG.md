# Changelog

All notable changes to the BO Plugin for Claude are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.6.0] — 2026-10-19

### Added
- **`/bo:process` contract, step one of the command.** The BO Atlas diagram exchange
  format (`.diagram.json`, kind `bo-atlas-diagram`, schema 1.0) is now vendored as
  `assets/process/diagram-exchange-v1.schema.json`, pinned to `bo-atlas@3b91f6f` in
  `scripts/check-schema-sync.sh`. bo-atlas carries no tags, so the pin is a commit, as for
  bo-ra. The worked example `innkjop.diagram.json` is copied beside it.
- `scripts/check-process-diagram.mjs`: the pre-flight for a diagram file. Mirrors the six
  reference checks Atlas refuses on (unknown connector endpoint, unknown annotation target,
  unknown phase or lane on a step, duplicate id, a kept position outside the lane it names
  from bo-atlas PR #103, and a phase id in a `1.0` file from PR #106) and adds the
  advisories Atlas does not give: a partial coordinate set that will be ignored wholesale,
  a decision with one exit or unlabelled exits, a step nothing connects to, an empty lane
  or phase, a self-loop. With the Atlas export as a second argument it prints what the
  Atlas review dialog will say, removals first and renamed phases as renames, warns when
  the file dropped a phase id the export wrote or renamed a phase that has none (Atlas
  then drops what is attached to the phase itself, an ISO clause mapped to it; the steps
  keep their ids), and refuses a file that kept a complete coordinate set while adding or
  moving something, because a new step would land wherever a number was invented for it.
- **Schema 1.1.** The vendored schema is the one at `bo-atlas@3b91f6f`: `schema_version`
  is `1.0` or `1.1`, and `1.1` adds an optional `phases[].id`, written by an Atlas export
  for every phase that has a stable id. The command carries it exactly in continuation
  mode and never invents one; a greenfield or migration file stays on `1.0`.
- `test/process/`: six fixtures and a README. `all-shapes` covers every shape, connector
  style, arrow and annotation kind; `known-bad` is structurally valid and reference-invalid
  on purpose; `export`, `continuation` and `continuation-stale-layout` exercise continuation
  mode including the round-trip-is-identity case and the stale-position trap.
- **`/bo:process` slash command**: guided process-diagram consultation producing a
  `.diagram.json` for the Diagram tab in BO Atlas Studio, plus a `-rationale.md`. Three
  ways in: greenfield interview; migration from a procedure document, BPMN export, drawing
  or meeting notes; and continuation of a file Atlas exported. Six-phase arc with a
  by-phase challenge pass (steps that are decisions, decisions with one exit, ping-pong
  hand-offs, missing rework paths, phases that are verbs). Nine standing rules, the two
  that matter most being: never write coordinates, and keep every id from an export.
- `assets/process/modelling-lexicon.md`: shape and connector semantics with Norwegian cue
  words, how to read quality-system procedures (section patterns, step-table header
  variants), a deterministic BPMN element mapping, how to read meeting notes and
  transcripts (hedges, disagreements, exceptions told as rules), defect patterns to
  challenge, and how to read an Atlas export. A written reference, never an example file.
- `assets/process/artifact-template.tsx`: live SVG swimlane preview that arranges the
  diagram with the same column width, header height, paddings and shape sizes as the
  Atlas auto-layout, draws all ten shapes and all three line styles, and lists what must
  be authored in Atlas afterwards instead of pretending to draw it.
- `assets/process/rationale-template.md`: lanes and phases with reasons, decisions and
  rework paths, challenges, what the file cannot carry, the source trail, and in
  continuation mode the diff Atlas will report.
- `CLAUDE.md`, `README.md` and `plugin.json` describe the command.

### Changed
- **`/bo:qcp` now writes the file QCPAdmin actually opens.** The output is `<Title>.txt`
  in the editor's own stored shape (`qcpTitle`, `processPhases[].processDetails[]`, ids,
  `LPID`/`LPDID`, derived `relevantDocs_forms_links`, mirrored dependencies, HTML
  descriptions, English trigger actions with their Fluent icons), uploaded into the QCP
  document library over the empty file QCPAdmin creates for a new QCP. The `.qcp.json`
  exchange format is gone: the Import dialog in QCPAdmin (Next) stores that shape as-is,
  and the editor loads `JSON.parse(text).processPhases`, so a plugin file imported that way
  was accepted and then could not be opened. The binding (list, column, type values) is not
  part of the file and now lives in a new section 0 of the rationale doc, with the upload
  steps. A `.txt` taken out of the library is accepted as input and continued with its ids
  kept. The vendored `qcp-schema-v1.json` is replaced by `qcp-template.schema.json`
  (written here from the editor source) plus the three editor interfaces vendored under
  `assets/qcp/upstream/`, pinned by blob to `bo-qcp-admin@v0.2.0` in
  `scripts/check-schema-sync.sh`. The bundled examples are the same three processes in the
  new shape, named as the QCP is.
- `scripts/check-qcp-template.mjs`: the pre-flight for a QCP `.txt`. Checks what the
  schema cannot express and the editor relies on, with `test/qcp/` fixtures (`Salgsprosess
  alle felter`, every shape; `Kjent feil`, fourteen known faults) and a README.
- The live artifact template and `scripts/check-process-diagram.mjs` (which now recognises
  a `.txt` handed to it by mistake) follow the new shape.

## [0.5.0] — 2026-08-18

### Added
- **Barrier support in `/bo:risk`.** `risks[].barriers` is now authored: an array of
  `{ name, type?, description? }` where `name` is a reference into the manifest's new
  `barrierLibrary`. Vendored schema and both examples re-pinned to `bo-ra@0927a0c9`.
- `assets/risk/ra-vocabulary-manifest.schema-v1.json` gains `barrierLibrary`
  (`{key, name, description?, suggestedType?}`). Optional, so a manifest exported before
  barrier support still validates.
- `test/risk/refused-barrier-fields.ra.json` — a third fixture, and the only one that is
  **structurally invalid on purpose**. It plants `status`, `verifiedDate`, `verifiedBy`,
  `documentReference` and a bad `type` enum, because "these fail the whole file,
  deliberately" is a promise to whoever writes a file against this format, and a promise
  is worth a test.
- `scripts/check-ra-vocabulary.mjs` resolves barrier names against the library, refuses the
  four evidence fields with an R28 explanation rather than a generic "unknown property",
  validates the `type` enum, and advises on: barriers beyond the two-to-four working range,
  a `description` that restates one the library already holds, a `type` identical to
  `suggestedType`, a proposal with no type or description, five or more proposed entries,
  risks with no barriers, and a manifest with no `barrierLibrary` at all.

### Changed
- **`Tiltak` now crosses.** Yesterday it was rescued into a rationale appendix because
  barriers could not be imported; today it maps to `barriers[]`. But the source's sentence
  is used only to *choose* a library entry and is then discarded — the library's own
  wording lands on the risk (R24), so one control is one sentence and the actions view can
  group it. `column-lexicon.md` §4b and rationale §9 are rewritten around that.
- Rationale §9 changes from "barrier text carried over, not imported" to a source-text →
  library-entry audit trail, plus what evidence was stripped from the source cell.

### Notes
- **Backward compatible, and verified as such.** `barriers` is optional and the format
  version is still `1`. Checked in four directions: an old file validates against the new
  schema; an old file still pre-flights clean against the new manifest; an old manifest
  still validates against the updated manifest schema; and a barrier-bearing file against a
  pre-barrier manifest fails loudly rather than silently.
- **Every imported barrier arrives planned**, so every risk carrying one reads as *residual
  not established* until somebody records the control is in place. That is R5 working, and
  the handover flags it as the single most likely thing to be reported back as a bug — so
  the command, the rationale template and the live preview all say it up front.
- **An unresolved barrier is not created at all**, unlike a risk source, whose risk still
  imports with an empty column. The pre-flight calls that out specifically, because the
  two failure modes look alike and are not.
- Residual scores are still impossible, and barriers do not change that: they arrive
  planned, so a residual leaning on one would rest on nothing recorded (R5).
## [0.4.0] — 2026-08-17

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
