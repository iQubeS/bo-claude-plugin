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
/bo:bo-crm              # CRM operations guide
/bo:bo-project          # Project management guide
/bo:bo-hr               # HR module guide
/bo:bo-khms             # QHSE/NCR guide
/bo:bo-guide            # Full platform overview
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
│   ├── bo-crm/SKILL.md      # CRM module (28 tools)
│   ├── bo-project/SKILL.md  # Project module (13 tools)
│   ├── bo-hr/SKILL.md       # HR module (guidance only)
│   ├── bo-khms/SKILL.md     # QHSE module (4 tools)
│   └── bo-guide/SKILL.md    # Platform guide
├── agents/
│   └── bo-assistant.md      # BO specialist agent (45 tools)
├── commands/
│   └── status.md            # /bo:status dashboard command
├── docs/
│   └── brukermanual/        # Norwegian user manual (63 files)
├── .claude/
│   └── rules/               # Module-specific Claude rules
├── CLAUDE.md                 # Plugin instructions for Claude
├── CHANGELOG.md              # Version history
├── LICENSE                   # Proprietary license
├── settings.json             # Default agent configuration
└── README.md
```

## MCP Servers

The plugin uses 4 BO MCP servers (45 tools) configured as remote MCPs on the Claude tenant:

| Server | Tools | Scope |
|--------|-------|-------|
| Customer | 15 | Companies, contacts, QCPs, timeline |
| Leads | 13 | Leads, MEDDIC, pipeline, QCPs, timeline |
| Projects | 13 | Projects, departments, types, QCPs, timeline |
| NCR | 4 | NCR cards (list, get, create, update) |

## Security

- All data is tenant-scoped via remote MCP servers
- Each skill has explicit `allowed-tools` restricting access to only its relevant MCP tools
- The plugin confirms before creating or modifying records
- No tokens or secrets are stored in this repository

## License

Proprietary — Business Online AS
