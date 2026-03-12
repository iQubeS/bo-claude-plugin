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
- A Business Online account with API access
- `BO_MCP_TOKEN` from your BO administrator

### Install from directory
```bash
claude --plugin-dir /path/to/bo-claude-plugin
```

### Install from GitHub (when published)
```bash
# In Claude Code:
/plugin install github:vidarvisjon/bo-claude-plugin
```

## Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your BO MCP token:
   ```
   BO_MCP_TOKEN=your-actual-token-here
   ```

3. The plugin will automatically connect to BO's MCP servers when loaded.

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
├── .mcp.json               # MCP server connections (BO + M365)
├── skills/
│   ├── bo-crm/SKILL.md     # CRM module
│   ├── bo-project/SKILL.md # Project module
│   ├── bo-hr/SKILL.md      # HR module
│   ├── bo-khms/SKILL.md    # QHSE module
│   └── bo-guide/SKILL.md   # Platform guide
├── agents/
│   └── bo-assistant.md     # BO specialist agent
├── commands/
│   └── status.md           # /bo:status command
├── CLAUDE.md               # Plugin instructions for Claude
├── .env.example            # Environment template
└── README.md
```

## MCP Servers

The plugin connects to 4 BO MCP servers (45 tools total):

| Server | Tools | Scope |
|--------|-------|-------|
| Customer | 15 | Companies, contacts, QCPs, timeline |
| Leads | 13 | Leads, MEDDIC, pipeline, QCPs, timeline |
| Projects | 13 | Projects, departments, types, QCPs, timeline |
| NCR | 4 | NCR cards (list, get, create) |

## Security

⚠️ **Never commit API tokens or secrets to this repository.**

- Use `.env` for local tokens (gitignored)
- `BO_MCP_TOKEN` authenticates against your BO tenant
- All data is tenant-isolated
- The plugin confirms before creating or modifying records

## License

Proprietary — Business Online AS
