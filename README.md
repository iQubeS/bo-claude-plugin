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
/bo:process             # Design, migrate or continue a process diagram → .diagram.json
/bo:bo-crm              # CRM operations guide
/bo:bo-project          # Project management guide
/bo:bo-hr               # HR module guide
/bo:bo-khms             # QHSE/NCR guide
/bo:bo-guide            # Full platform overview
```

### Design commands

Four guided consultants turn a conversation into an import-ready file:

- **`/bo:qcp`** — a business-process consultant. It interviews you about a process, challenges cargo-cult steps, references domain-relevant standards (ISO, GDPR, ITIL…), and produces a `.qcp.json` (plus a process-rationale doc) ready to upload via **Import QCP** in QCPAdmin (Next).
- **`/bo:checklist`** — a forms/data-collection consultant. It interviews you about a checklist or form, challenges weak questions and wrong field types, and produces a `.checklist.json` (plus an import-guide with the name/code/category/project-type metadata) ready to import into the **Template Manager**.
- **`/bo:risk`** — a risk-assessment consultant. Most sessions start with a customer's Excel register: it reads the workbook, calibrates their scale against your tenant's, translates their vocabulary, challenges weak hazard entries, and produces a `.ra.json` (plus a rationale doc) ready to import into the **QHSE risk-assessment template manager**.
- **`/bo:process`** — a process-diagram consultant. It draws out one process as a swimlane diagram (roles as lanes, stages as phases, steps, decisions, hand-offs), from a conversation, from an existing procedure document, BPMN export, drawing or meeting notes, or as a continuation of a diagram exported from **BO Atlas**. Produces a `.diagram.json` (plus a rationale doc) ready to import on the **Diagram tab in Atlas Studio**.

All four support **greenfield** design (consultative interview) and **migration** from existing documents — BPMN/Word/PDF/screenshots for QCP; Word/PDF/Excel/photos of paper forms for checklists; Excel/CSV/Word/PDF registers for risk; procedures, BPMN, drawings and meeting notes for process diagrams — and render a live preview as you build. `/bo:process` additionally supports **continuation**: start from a file Atlas exported, change it, and import it back without losing what Atlas holds on the steps.

#### `/bo:risk` needs one extra input

Almost everything in a risk assessment is keyed to your tenant: effect categories, the
consequence and probability ladders (which **differ per category**), risk sources and
exposure targets. So the command asks for a **vocabulary manifest** — the `Copy vocabulary`
export from your RA template manager — before it will author any of them. Without it the
failure is silent: a word that nearly matches resolves to nothing and the risk imports
with an empty column.

**Barriers import too**, as of 2026-08-18 — but as references into your own
`barrierLibrary`, never as free text. Your register's `Tiltak` sentence is used to *choose*
the library entry and is then discarded, because the library's own wording is what lands on
the risk, so one control is one sentence and the actions view can group it across risks and
projects. Every imported barrier arrives **planned**, which means a freshly imported
template shows its risks as *residual not established* until somebody records that a
control is actually in place. That is the system working, not a defect.

Two things it deliberately will not do. It never reads the acceptance limit or the
risk-band colours, even when your spreadsheet shows them, because an author who can see
where the line falls scores the screen rather than the hazard. And it never claims a
control is in place — `status`, `verifiedDate`, `verifiedBy` and `documentReference` on a
barrier fail the whole file by design. Residual scores remain impossible for the same
reason: a residual needs a control recorded as established, and imported ones never are.

Before importing, you can check a file resolves cleanly:

```bash
node scripts/check-ra-vocabulary.mjs my-template.ra.json my-manifest.json
```

#### `/bo:process` and BO Atlas

The diagram file is the exchange format of BO Atlas itself: it carries **the drawing and
only the drawing** (lanes, phases, steps, connectors, notes). Triggers, links, work files,
RACI, ISO mappings and the process definition are authored in Atlas afterwards, and an
import never touches them. Import goes into whichever process is open on the Diagram tab,
is reviewed before it applies (removals first), and is never saved by itself.

Two rules carry continuation mode. Step ids from an export are how Atlas knows a step is
the same one, so the command keeps every one of them; a lost id means a deleted and
recreated step, and its triggers and links are gone. And coordinates are all-or-nothing:
the command never writes them for a new diagram, and strips the exported set the moment a
step is added or moved, because Atlas would otherwise honour a stale position.

Before importing, you can check a file, and in continuation mode see what the Atlas
review dialog will say:

```bash
node scripts/check-process-diagram.mjs my-process.diagram.json
node scripts/check-process-diagram.mjs my-process.diagram.json the-export.diagram.json
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
│   ├── risk.md              # /bo:risk — risk assessment template designer
│   └── process.md           # /bo:process — process diagram designer (BO Atlas)
├── assets/
│   ├── qcp/                 # QCP schema, examples, artifact & rationale templates
│   ├── checklist/           # Checklist schema, examples, artifact & import-guide templates
│   ├── risk/                # RA schemas (vendored + manifest), examples, artifact,
│   │                        #   rationale template, Norwegian column lexicon
│   └── process/             # Atlas diagram schema (vendored), example, modelling lexicon,
│                            #   artifact & rationale templates
├── scripts/
│   ├── check-schema-sync.sh      # Vendored schemas still match upstream?
│   ├── check-ra-vocabulary.mjs   # Will this .ra.json import without reconciliation?
│   └── check-process-diagram.mjs # Will this .diagram.json import as the diagram it describes?
├── test/
│   ├── checklist/           # Schema-coverage fixture for /bo:checklist
│   ├── risk/                # Coverage + known-bad fixtures for /bo:risk
│   └── process/             # Coverage, known-bad and continuation fixtures for /bo:process
├── docs/
│   ├── brukermanual/        # Norwegian user manual (63 files)
│   └── qa/                  # Manual QA logs for the design commands
├── .claude/
│   └── rules/               # Module-specific Claude rules
├── CLAUDE.md                 # Plugin instructions for Claude
├── CHANGELOG.md              # Version history
├── LICENSE                   # Proprietary license
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
