---
description: Work with Business Online Project module — project management, departments, timelines, QCPs, and dashboards. Auto-invoked for project tracking, resource allocation, and project status reporting.
argument-hint: "[project name or ID to look up]"
allowed-tools:
  - Read
  - Grep
  - Glob
  # Projects server (13 tools)
  - mcp__claude_ai_Business_Online_Projects__create_project
  - mcp__claude_ai_Business_Online_Projects__create_project_timeline_event
  - mcp__claude_ai_Business_Online_Projects__get_all_departments
  - mcp__claude_ai_Business_Online_Projects__get_all_project_types
  - mcp__claude_ai_Business_Online_Projects__retrieve_all_project_qcps
  - mcp__claude_ai_Business_Online_Projects__retrieve_all_projects
  - mcp__claude_ai_Business_Online_Projects__retrieve_project
  - mcp__claude_ai_Business_Online_Projects__retrieve_project_qcp
  - mcp__claude_ai_Business_Online_Projects__retrieve_project_timeline_event
  - mcp__claude_ai_Business_Online_Projects__retrieve_project_timeline_events
  - mcp__claude_ai_Business_Online_Projects__retrieve_projects_dashboard
  - mcp__claude_ai_Business_Online_Projects__update_project
  - mcp__claude_ai_Business_Online_Projects__update_project_timeline_event
---

# Business Online Projects

Manage projects through the BO Project module. Projects are organized by departments and types, with timeline events for progress tracking and QCPs for quality gates.

If the user provided an argument (`$ARGUMENTS`), treat it as a search query: look up projects matching that name and present the results.

## Capabilities

### Projects
- **List/search projects**: `retrieve_all_projects` (search by name, filter by status)
- **Get project details**: `retrieve_project` (full project with budget, status, team)
- **Create project**: `create_project` (name, projectTypeId, departmentId, dates, budget)
- **Update project**: `update_project` (status changes, budget updates, reassignment)
- **Dashboard**: `retrieve_projects_dashboard` (overview: active, on-hold, completed)

### Organization
- **Departments**: `get_all_departments` (organizational units)
- **Project types**: `get_all_project_types` (categories with department mapping)

### Timeline & QCPs
- **Timeline events**: CRUD operations for project milestones, updates, meetings
- **QCPs**: Quality control checkpoints — retrieve and monitor completion

## Patterns

### Project Status Report
1. `retrieve_projects_dashboard` for high-level overview
2. Filter active projects, check for overdue milestones
3. Drill into specific projects with `retrieve_project`
4. Review recent timeline events for progress updates

### New Project Setup
1. `get_all_departments` + `get_all_project_types` to find correct categorization
2. `create_project` with all required fields
3. Create initial timeline event documenting project kickoff

## Notes
- Projects link to departments which map to organizational structure
- Budget fields support the tenant's currency
- Status transitions follow configured workflows
- QCPs are defined per project type and enforced at stage gates

## When MCP Calls Fail

If a Projects tool call fails:
- **Timeout or connection error**: Tell the user the Projects service is unavailable. Suggest waiting a moment and retrying.
- **Not found (404)**: The project ID may be wrong — ask the user to verify it, or search by name with `retrieve_all_projects`.
- **Validation error**: Show the error message. Common issues: missing departmentId or projectTypeId when creating projects — use `get_all_departments` and `get_all_project_types` to find valid values.

## Reference Documentation
For detailed user guides:
- `${CLAUDE_SKILL_DIR}/../../docs/brukermanual/prosjekt/introduksjon.md`
- `${CLAUDE_SKILL_DIR}/../../docs/brukermanual/prosjekt/prosjekter.md`
- `${CLAUDE_SKILL_DIR}/../../docs/brukermanual/prosjekt/prosjekt-arbeidsrom.md`
- `${CLAUDE_SKILL_DIR}/../../docs/brukermanual/prosjekt/prosjekt-arbeidsrom/prosjektplan.md`
- `${CLAUDE_SKILL_DIR}/../../docs/brukermanual/prosjekt/portefolje.md`
