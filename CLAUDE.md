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
MCP servers are configured on the Claude tenant — no local token setup needed. Just install the plugin.

## Security
- All data is tenant-scoped via remote MCP servers
- Confirm before creating/modifying records
