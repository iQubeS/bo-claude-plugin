# Business Online Plugin

This plugin integrates Business Online (BO/iQS Online) with Claude Code, providing direct access to CRM, Project, HR, and QHSE modules via MCP servers.

## Quick Start
- `/bo:status` — Platform overview dashboard
- `/bo:bo-crm` — CRM operations (companies, contacts, leads)
- `/bo:bo-project` — Project management
- `/bo:bo-hr` — HR/Personnel guidance
- `/bo:bo-khms` — QHSE/NCR management
- `/bo:bo-guide` — Platform overview and architecture

## Setup
1. Set `BO_MCP_TOKEN` environment variable (get from your BO admin)
2. MCP servers connect automatically when the plugin is enabled

## Security
- Never commit tokens or API keys
- All data is tenant-scoped
- Confirm before creating/modifying records
