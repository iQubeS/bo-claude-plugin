# BO Plugin for Claude

> Bring Business Online (BO) into your Claude workflow — CRM, Projects, HR, and QHSE at your fingertips.

## What is this?

A Claude plugin that connects to Business Online's MCP servers, giving Claude direct access to your business data. Ask Claude to check your pipeline, create NCR reports, look up customers, or review project status — all from your editor.

## Features

🎯 **CRM** — Companies, contacts, leads, MEDDIC qualification, pipeline dashboard  
📊 **Projects** — Project tracking, departments, milestones, budgets  
👥 **HR** — Employee management, absence tracking, onboarding guidance  
🛡️ **QHSE** — NCR/avvik management, incident reporting, corrective actions  
🔗 **M365** — Built for SharePoint/Teams/Outlook integration  

## Installation

### Prerequisites
- [Claude Code](https://code.claude.com) v1.0.33+
- BO MCP servers configured on your Claude tenant

### Install from GitHub
```bash
claude plugin install github:iQubeS/bo-claude-plugin
```

MCP servers are configured as remote MCPs on the Claude tenant — no local token setup needed.

### Setting Up Auto-Sync (Webhook)

To keep the plugin automatically updated when changes are pushed to this repo:

1. Go to your Claude plugin settings and find the `bo` plugin
2. Click **"Configure webhook"** — this uses the Claude GitHub App to create a webhook on the repo
3. The first time, you may need to **approve a new GitHub permission** for the Claude GitHub App
4. Once enabled, any push to the default branch will automatically sync plugin changes to your Claude tenant

> **Private repos**: This works with private GitHub repos. The Claude GitHub App must have access to the repo — configure this under GitHub `Settings → Integrations → GitHub Apps → Claude → Configure → Repository access`.

## Usage

```
/bo:status              # Quick platform overview
/bo:qcp                 # Design a QCP (Quality Control Plan) template → .qcp.json
/bo:checklist           # Design a checklist/form template → .checklist.json
/bo:risk                # Design or migrate a risk assessment template → .ra.json
/bo:bo-crm              # CRM operations guide
/bo:bo-project          # Project management guide
/bo:bo-hr               # HR module guide
/bo:bo-khms             # QHSE/NCR guide
/bo:bo-guide            # Full platform overview
```

### Design commands

Three guided consultants turn a conversation into an import-ready template:

- **`/bo:qcp`** — a business-process consultant. It interviews you about a process, challenges cargo-cult steps, references domain-relevant standards (ISO, GDPR, ITIL…), and produces a `.qcp.json` (plus a process-rationale doc) ready to upload via **Import QCP** in QCPAdmin (Next).
- **`/bo:checklist`** — a forms/data-collection consultant. It interviews you about a checklist or form, challenges weak questions and wrong field types, and produces a `.checklist.json` (plus an import-guide with the name/code/category/project-type metadata) ready to import into the **Template Manager**.
- **`/bo:risk`** — a risk-assessment consultant. Most sessions start with a customer's Excel register: it reads the workbook, calibrates their scale against your tenant's, translates their vocabulary, challenges weak hazard entries, and produces a `.ra.json` (plus a rationale doc) ready to import into the **QHSE risk-assessment template manager**.

All three support **greenfield** design (consultative interview) and **migration** from existing documents — BPMN/Word/PDF/screenshots for QCP; Word/PDF/Excel/photos of paper forms for checklists; Excel/CSV/Word/PDF registers for risk — and render a live preview of the template as you build it.

#### `/bo:risk` needs one extra input

Almost everything in a risk assessment is keyed to your tenant: effect categories, the
consequence and probability ladders (which **differ per category**), risk sources and
exposure targets. So the command asks for a **vocabulary manifest** — the `Copy vocabulary`
export from your RA template manager — before it will author any of them. Without it the
failure is silent: a word that nearly matches resolves to nothing and the risk imports
with an empty column.

Two things it deliberately will not do. It never reads the acceptance limit or the
risk-band colours, even when your spreadsheet shows them, because an author who can see
where the line falls scores the screen rather than the hazard. And it never imports
barriers or residual scores — a residual needs a recorded barrier to justify it, and
barriers are what *your* company decides. Barrier text from a source `Tiltak` column is
preserved in the rationale document for re-entry in the tool rather than discarded.

Before importing, you can check a file resolves cleanly:

```bash
node scripts/check-ra-vocabulary.mjs my-template.ra.json my-manifest.json
```

Or just ask Claude naturally:
- "Vis meg salgspipelinen"
- "Opprett et avvik for kvalitetsproblemet på prosjekt X"
- "Hva er status på aktive prosjekter?"
- "Slå opp Acme Corp og vis siste aktivitet"

## Architecture

```
bo-claude-plugin/
├── .claude-plugin/
│   ├── plugin.json          # Plugin manifest
│   └── marketplace.json     # Marketplace distribution config
├── skills/
│   ├── bo-crm/SKILL.md      # CRM module (29 tools)
│   ├── bo-project/SKILL.md  # Project module (15 tools)
│   ├── bo-hr/SKILL.md       # HR module (guidance only)
│   ├── bo-khms/SKILL.md     # QHSE module (4 tools)
│   └── bo-guide/SKILL.md    # Platform guide
├── agents/
│   └── bo-assistant.md      # BO specialist agent (48 tools)
├── commands/
│   ├── status.md            # /bo:status dashboard command
│   ├── qcp.md               # /bo:qcp — QCP template designer
│   ├── checklist.md         # /bo:checklist — checklist template designer
│   └── risk.md              # /bo:risk — risk assessment template designer
├── assets/
│   ├── qcp/                 # QCP schema, examples, artifact & rationale templates
│   ├── checklist/           # Checklist schema, examples, artifact & import-guide templates
│   └── risk/                # RA schemas (vendored + manifest), examples, artifact,
│                            #   rationale template, Norwegian column lexicon
├── scripts/
│   ├── check-schema-sync.sh      # Vendored schemas still match upstream?
│   └── check-ra-vocabulary.mjs   # Will this .ra.json import without reconciliation?
├── test/
│   ├── checklist/           # Schema-coverage fixture for /bo:checklist
│   └── risk/                # Coverage + known-bad fixtures for /bo:risk
├── docs/
│   ├── brukermanual/        # Norwegian user manual (63 files)
│   └── qa/                  # Manual QA logs for the design commands
├── .claude/
│   └── rules/               # Module-specific Claude rules
├── CLAUDE.md                 # Plugin instructions for Claude
├── CHANGELOG.md              # Version history
├── LICENSE                   # Proprietary license
├── settings.json             # Default agent configuration
└── README.md
```

## MCP Servers

The plugin uses 4 BO MCP servers (48 tools) configured as remote MCPs on the Claude tenant:

| Server | Tools | Scope |
|--------|-------|-------|
| CRM | 15 | Companies, contacts, QCPs, timeline |
| Leads | 14 | Leads, pipeline overview, QCPs, timeline |
| Projects | 15 | Projects, departments, types, QCPs, timeline |
| NCR | 4 | NCR cards (list, get, create, update) |

## Security

- All data is tenant-scoped via remote MCP servers
- Each skill has explicit `allowed-tools` restricting access to only its relevant MCP tools
- The plugin confirms before creating or modifying records
- No tokens or secrets are stored in this repository

## License

Proprietary — Business Online AS
