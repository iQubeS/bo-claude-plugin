# Changelog

All notable changes to the BO Plugin for Claude are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/).

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
