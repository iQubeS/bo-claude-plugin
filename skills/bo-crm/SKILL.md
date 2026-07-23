---
description: Work with Business Online CRM — companies, contacts, leads, pipeline, MEDDIC qualification, and timeline events. Auto-invoked when working with customer data, sales pipeline, or lead management.
argument-hint: "[company name, contact name, or lead to look up]"
allowed-tools:
  - Read
  - Grep
  - Glob
  # CRM server (15 tools)
  - mcp__claude_ai_Business_Online_CRM__create_company
  - mcp__claude_ai_Business_Online_CRM__create_company_timeline_event
  - mcp__claude_ai_Business_Online_CRM__create_contact
  - mcp__claude_ai_Business_Online_CRM__get_all_company_types
  - mcp__claude_ai_Business_Online_CRM__retrieve_all_companies
  - mcp__claude_ai_Business_Online_CRM__retrieve_all_company_qcps
  - mcp__claude_ai_Business_Online_CRM__retrieve_all_contacts
  - mcp__claude_ai_Business_Online_CRM__retrieve_company_by_id
  - mcp__claude_ai_Business_Online_CRM__retrieve_company_qcp
  - mcp__claude_ai_Business_Online_CRM__retrieve_company_timeline_event
  - mcp__claude_ai_Business_Online_CRM__retrieve_company_timeline_events
  - mcp__claude_ai_Business_Online_CRM__retrieve_contact
  - mcp__claude_ai_Business_Online_CRM__update_company_by_id
  - mcp__claude_ai_Business_Online_CRM__update_company_timeline_event
  - mcp__claude_ai_Business_Online_CRM__update_contact
  # Leads server (14 tools)
  - mcp__claude_ai_Business_Online_Leads__create_lead
  - mcp__claude_ai_Business_Online_Leads__create_lead_timeline_event
  - mcp__claude_ai_Business_Online_Leads__get_lead_types
  - mcp__claude_ai_Business_Online_Leads__retrieve_lead
  - mcp__claude_ai_Business_Online_Leads__retrieve_lead_by_company
  - mcp__claude_ai_Business_Online_Leads__retrieve_lead_qcp
  - mcp__claude_ai_Business_Online_Leads__retrieve_lead_qcps
  - mcp__claude_ai_Business_Online_Leads__retrieve_lead_timeline_event
  - mcp__claude_ai_Business_Online_Leads__retrieve_lead_timeline_events
  - mcp__claude_ai_Business_Online_Leads__retrieve_leads
  - mcp__claude_ai_Business_Online_Leads__retrieve_leads_by_company
  - mcp__claude_ai_Business_Online_Leads__retrieve_leads_overview
  - mcp__claude_ai_Business_Online_Leads__update_lead
  - mcp__claude_ai_Business_Online_Leads__update_lead_timeline_event
---

# Business Online CRM

Business Online (BO) is a cloud CRM/Project/HR/QHSE platform built on Microsoft 365. This skill covers the CRM module.

If the user provided an argument (`$ARGUMENTS`), treat it as a search query: look up companies, contacts, or leads matching that name and present the results.

## Capabilities

You have access to these BO CRM operations via MCP:

### Companies
- **List/search companies**: `retrieve_all_companies` (search, filter by type/active/approvedSupplier)
- **Get company details**: `retrieve_company_by_id` (includes all fields, relationships)
- **Create company**: `create_company` (requires name + companyTypeId)
- **Update company**: `update_company_by_id` (partial updates; website is create-only)
- **Company types**: `get_all_company_types` (prospect, customer, partner, etc.)

### Contacts
- **List/search contacts**: `retrieve_all_contacts` (search by name)
- **Get contact details**: `retrieve_contact` (requires companyId + contactId)
- **Create contact**: `create_contact` (firstName, lastName, email, phone, companyId)
- **Update contact**: `update_contact` (partial updates)

### Leads / Pipeline
- **List leads**: `retrieve_leads` (search, filter by type/status)
- **Leads for a company**: `retrieve_leads_by_company` / `retrieve_lead_by_company`
- **Get lead details**: `retrieve_lead` (full lead with LCM status, probability, value)
- **Create lead**: `create_lead` (requires name, companyId, leadTypeId)
- **Update lead**: `update_lead` (stage changes, value updates, close)
- **Dashboard**: `retrieve_leads_overview` (pipeline overview, filter by status/LCM stage/responsible)
- **Lead types**: `get_lead_types`

### MEDDIC Qualification
There is no dedicated MEDDIC tool. Apply the framework conversationally: gather what's known
from `retrieve_lead` and the lead's timeline events, assess each dimension, and log the
qualification as a timeline event:
  - **M**etrics: Quantifiable business impact
  - **E**conomic Buyer: Decision maker identification
  - **D**ecision Criteria: Evaluation factors
  - **D**ecision Process: Steps and timeline
  - **I**dentify Pain: Core business challenges
  - **C**hampion: Internal advocate

### Timeline Events
- Create, read, update timeline events on companies and leads
- Use for logging calls, meetings, emails, notes

### Quality Control Points (QCPs)
- Retrieve QCPs for companies and leads
- QCPs define mandatory checkpoints in sales processes

## Patterns

### Pipeline Review
1. Call `retrieve_leads_overview` for overview
2. Drill into specific leads with `retrieve_lead`
3. Review timeline events and assess MEDDIC qualification gaps
4. Log actions as timeline events

### New Customer Onboarding
1. `create_company` with type = customer
2. `create_contact` for key stakeholders
3. `create_lead` if there's an active opportunity
4. Create timeline event documenting first interaction

## Important Notes
- All data is tenant-scoped — you only see data for the authenticated tenant
- Company and contact IDs are GUIDs
- Lead values are in the tenant's currency (typically NOK)
- Timeline events support rich text in description field

## When MCP Calls Fail

If a CRM or Leads tool call fails:
- **Timeout or connection error**: Tell the user which server (CRM or Leads) is unavailable. Suggest waiting a moment and retrying.
- **Not found (404)**: The ID may be wrong — ask the user to verify the company/contact/lead ID.
- **Validation error**: Show the error message and explain which fields need correction.
- If only one server is down, you can still use the other — CRM and Leads are independent services.

## Reference Documentation
For detailed user guides and screenshots, see:
- `${CLAUDE_SKILL_DIR}/../../docs/brukermanual/crm/introduksjon.md`
- `${CLAUDE_SKILL_DIR}/../../docs/brukermanual/crm/bedrifter.md`
- `${CLAUDE_SKILL_DIR}/../../docs/brukermanual/crm/kontakter.md`
- `${CLAUDE_SKILL_DIR}/../../docs/brukermanual/crm/muligheter.md`
- `${CLAUDE_SKILL_DIR}/../../docs/brukermanual/crm/kontrakter.md`
