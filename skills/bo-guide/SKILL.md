---
description: Business Online platform overview, architecture, and user guide. Use when users ask about BO capabilities, how modules connect, M365 integration, or need general platform guidance.
argument-hint: "[module name or platform question]"
allowed-tools:
  - Read
  - Grep
  - Glob
---

# Business Online — Platform Guide

## What is Business Online?

Business Online (BO / iQS Online) is a cloud-based business platform built on Microsoft 365. It provides integrated modules for CRM, Project Management, HR/Personnel, and QHSE — all accessible through SharePoint and tightly integrated with the M365 ecosystem.

## Platform Architecture

```
┌─────────────────────────────────────────────────┐
│                   End Users                      │
│          (SharePoint, Teams, Mobile)             │
├─────────────────────────────────────────────────┤
│              SPFx Web Parts                      │
│    CRM | Projects | HR | QHSE | DMS             │
├─────────────────────────────────────────────────┤
│              BO API Layer                        │
│    REST APIs + MCP Servers (45 tools)            │
├─────────────────────────────────────────────────┤
│           Azure Infrastructure                   │
│    Container Apps | Functions | Logic Apps        │
│    Region: Norway East                           │
├─────────────────────────────────────────────────┤
│          Microsoft 365 Tenant                    │
│    Entra ID | SharePoint | Teams | Outlook       │
└─────────────────────────────────────────────────┘
```

## Modules

### 🎯 CRM (Customer Relationship Management)
- **Companies**: Customer, prospect, partner, and supplier management
- **Contacts**: People linked to companies with roles and communication history
- **Leads/Pipeline**: Sales opportunities with stage tracking and MEDDIC qualification
- **Timeline**: Activity log for all customer interactions
- **QCPs**: Quality Control Points for sales process compliance
- Use skill: `/bo:bo-crm`

### 📊 Projects
- **Project tracking**: Budget, timeline, status, team assignment
- **Departments**: Organizational structure for project ownership
- **Project types**: Categorization with department mapping
- **Milestones**: Timeline events for progress tracking
- **QCPs**: Quality gates per project type
- Use skill: `/bo:bo-project`

### 👥 HR / Personnel
- **Employee management**: Registry, employment details, roles
- **Absence tracking**: Leave requests, sick leave, vacation
- **Onboarding/Offboarding**: Checklist-driven with M365 provisioning
- **Competence**: Skills, certifications, training records
- **Documents**: Employment contracts, certificates
- Use skill: `/bo:bo-hr`

### 🛡️ QHSE (KHMS)
- **NCR/Avvik**: Non-conformance reporting and tracking
- **Incident management**: HSE incidents, near-misses
- **Audits**: Internal audit findings and follow-up
- **Corrective actions**: Assigned, tracked, verified
- **Compliance**: ISO 9001/14001/45001 support
- Use skill: `/bo:bo-khms`

## M365 Integration

BO is designed as a **SharePoint-native** application:

| M365 Service | Integration |
|-------------|-------------|
| **SharePoint** | SPFx web parts render all BO UI, document libraries for storage |
| **Entra ID** | Authentication, user provisioning, RBAC |
| **Teams** | Notifications, team channels linked to projects/departments |
| **Outlook** | Calendar sync (absences), email tracking in timelines |
| **Power Automate** | Workflow automation between BO and M365 |
| **Power BI** | Reporting dashboards connected to BO data |

## MCP Integration

BO exposes 45 tools across 4 MCP servers:
- **Customer**: 15 tools (companies, contacts, QCPs, timeline)
- **Leads**: 13 tools (leads, MEDDIC, pipeline, QCPs, timeline)
- **Projects**: 13 tools (projects, departments, types, QCPs, timeline)
- **NCR**: 4 tools (NCR cards CRUD)

MCP servers run on Azure Container Apps (Norway East). Authentication is handled automatically via the Claude tenant configuration — no token setup required.

## Multi-Tenant Architecture
- Each customer gets an isolated tenant
- Data is never shared between tenants
- SPFx web parts deploy to each tenant's app catalog
- Azure infrastructure is shared but data is tenant-scoped
- Token-based auth ensures tenant isolation

## Target Customers
- Norwegian companies, 10-200 employees
- Industries: Oil & gas, maritime, construction, consulting, manufacturing
- Need integrated CRM + Project + HR in their existing M365 environment
- Value: No separate system — everything lives in SharePoint/Teams

## Reference Documentation
For platform-level guides (not covered by module-specific skills):
- `${CLAUDE_SKILL_DIR}/../../docs/brukermanual/business-online.md`
- `${CLAUDE_SKILL_DIR}/../../docs/brukermanual/oversikt.md`
- `${CLAUDE_SKILL_DIR}/../../docs/brukermanual/tilgang.md`
- `${CLAUDE_SKILL_DIR}/../../docs/brukermanual/administrasjon/innledning.md`
- `${CLAUDE_SKILL_DIR}/../../docs/brukermanual/komponenter/qcp-kvalitetskontrollplan.md`
- `${CLAUDE_SKILL_DIR}/../../docs/brukermanual/komponenter/tidslinje.md`
- `${CLAUDE_SKILL_DIR}/../../docs/brukermanual/ekstrafunksjoner/introduksjon.md`
