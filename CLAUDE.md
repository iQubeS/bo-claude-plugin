# CLAUDE.md

This file provides guidance to Claude when working in this project.

## What This Is

This is a **plugin for Claude** that connects to Business Online (BO/iQS Online) — a business platform for CRM, projects, HR, and quality management (QHSE), built on Microsoft 365. With this plugin installed, Claude can read and work with your BO data directly through natural conversation.

There is nothing to build, install, or configure locally. The connection to BO runs in the cloud.

## What the User Can Ask Claude to Do

- Look up customers, contacts, and sales leads
- Review the sales pipeline and qualify leads (MEDDIC)
- Check project status, budgets, and milestones
- Create and follow up on NCR reports (avvik/quality deviations)
- Get a dashboard overview across all modules (`/bo:status`)
- Design new QCP (Quality Control Plan) templates with `/bo:qcp` — guided business-process consultation that produces a `.qcp.json` ready for upload into QCPAdmin (Next). Supports both greenfield design and migration from existing process docs (BPMN, Word, PDF, screenshots).
- Design new checklist/form templates with `/bo:checklist` — guided forms consultation that produces a `.checklist.json` ready for import into the Template Manager, plus an import-guide with the name/code/category/project-type metadata. Supports greenfield design and migration from existing forms (Word, PDF, Excel, photos of paper forms).
- Ask questions about how Business Online works (HR, onboarding, processes)

## How the Plugin Is Organized

- `skills/` — Five guides that tell Claude how to work with each BO module:
  - `bo-crm/` — Customers, contacts, leads, pipeline, MEDDIC qualification
  - `bo-project/` — Projects, departments, types, dashboards
  - `bo-hr/` — HR and personnel guidance (read-only — **no live data access yet**)
  - `bo-khms/` — QHSE: NCR/avvik reporting, quality management
  - `bo-guide/` — General platform overview and architecture
- `agents/bo-assistant.md` — A BO specialist persona that knows all modules
- `commands/status.md` — The `/bo:status` dashboard command
- `commands/qcp.md` — The `/bo:qcp` QCP-template design command (assets in `assets/qcp/`)
- `commands/checklist.md` — The `/bo:checklist` checklist-template design command (assets in `assets/checklist/`)
- `docs/brukermanual/` — 63 Norwegian user manual files organized by module. Skills reference these for detailed guidance.

## Data Connections

Claude connects to BO through 4 cloud services (48 tools total):

| Service | What it covers | Tools |
|---------|---------------|-------|
| CRM | Companies, contacts, quality checkpoints, activity log | 15 |
| Leads | Sales leads, pipeline overview, quality checkpoints, activity log | 14 |
| Projects | Projects, departments, types, quality checkpoints, activity log | 15 |
| NCR | Non-conformance reports — list, view, create, update | 4 |

All connections are pre-configured on the Claude tenant. No API keys or tokens are needed locally.

## User Configuration

The plugin asks users for two optional settings when enabled:

- **`BO_COMPANY_NAME`** — The user's company name. When set, use it in dashboards and reports instead of generic text.
- **`BO_LANGUAGE`** — Preferred language (`no` = norsk, `en` = english). Defaults to `no`. Respect this setting for all responses.

These are available as `${BO_COMPANY_NAME}` and `${BO_LANGUAGE}` in skills and commands.

## Important Rules for Claude

- **Language**: Follow `BO_LANGUAGE` setting. If not set, respond in Norwegian when the user writes in Norwegian.
- **Always confirm before changing data**: Never create, update, or delete records without asking the user first.
- **HR has no live data**: The bo-hr skill only provides guidance and documentation. Do not attempt to call HR APIs — they don't exist yet.
- **IDs are GUIDs**: All record identifiers (companies, contacts, leads, projects, NCRs) are GUIDs.
- **Doc references use `${CLAUDE_SKILL_DIR}`**: Skills point to user manual files via relative paths from the skill directory. Keep this pattern when editing skills.

## When Something Goes Wrong

If an MCP tool call fails or times out:
1. Tell the user which service is unavailable (Customer, Leads, Projects, or NCR)
2. Suggest what they can try: wait a moment and retry, or check with their BO administrator
3. Continue helping with the modules that are still working — one service being down does not affect the others
4. For HR questions, remember there are no MCP tools — use the documentation in `docs/brukermanual/` instead

## Updating the User Manual

The user manual files in `docs/brukermanual/` are sourced from https://docs.business-online.no. To refresh, use the fetch script (not included in this repo — ask a BO developer for the latest version).
