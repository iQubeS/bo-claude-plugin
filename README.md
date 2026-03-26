# BO Plugin for Claude Code

> Bring Business Online (BO/iQS Online) into your Claude Code workflow — CRM, Projects, HR, and QHSE at your fingertips.

## What is this?

A Claude Code plugin that connects to Business Online's MCP servers, giving Claude direct access to your business data. Ask Claude to check your pipeline, create NCR reports, look up customers, or review project status — all from your editor.

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
- "Show me the sales pipeline"
- "Create an NCR for the quality issue on project X"
- "What's the status of our active projects?"
- "Look up Acme Corp and their recent activity"

## Architecture

```
bo-claude-plugin/
├── .claude-plugin/
│   └── plugin.json         # Plugin manifest
├── skills/
│   ├── bo-crm/SKILL.md     # CRM module
│   ├── bo-project/SKILL.md # Project module
│   ├── bo-hr/SKILL.md      # HR module (guidance only)
│   ├── bo-khms/SKILL.md    # QHSE module
│   └── bo-guide/SKILL.md   # Platform guide
├── agents/
│   └── bo-assistant.md     # BO specialist agent
├── commands/
│   └── status.md           # /bo:status command
├── CLAUDE.md               # Plugin instructions for Claude
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
- The plugin confirms before creating or modifying records
- No tokens or secrets are stored in this repository

## License

Proprietary — Business Online AS
