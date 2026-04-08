---
description: Work with Business Online CRM — companies, contacts, leads, pipeline, MEDDIC qualification, and timeline events. Auto-invoked when working with customer data, sales pipeline, or lead management.
argument-hint: "[company name, contact name, or lead to look up]"
allowed-tools:
  - Read
  - Grep
  - Glob
  # Customer server (15 tools)
  - mcp__claude_ai_Business_Online_Customer__create_company
  - mcp__claude_ai_Business_Online_Customer__create_company_timeline_event
  - mcp__claude_ai_Business_Online_Customer__create_contact
  - mcp__claude_ai_Business_Online_Customer__get_all_company_types
  - mcp__claude_ai_Business_Online_Customer__retrieve_all_company_qcps
  - mcp__claude_ai_Business_Online_Customer__retrieve_companies
  - mcp__claude_ai_Business_Online_Customer__retrieve_company_by_id
  - mcp__claude_ai_Business_Online_Customer__retrieve_company_qcp
  - mcp__claude_ai_Business_Online_Customer__retrieve_company_timeline_event
  - mcp__claude_ai_Business_Online_Customer__retrieve_company_timeline_events
  - mcp__claude_ai_Business_Online_Customer__retrieve_contact_info
  - mcp__claude_ai_Business_Online_Customer__retrieve_contacts
  - mcp__claude_ai_Business_Online_Customer__update_company
  - mcp__claude_ai_Business_Online_Customer__update_company_timeline_event
  - mcp__claude_ai_Business_Online_Customer__update_contact
  # Leads server (13 tools)
  - mcp__claude_ai_Business_Online_Leads__collect_meddic_data
  - mcp__claude_ai_Business_Online_Leads__create_lead
  - mcp__claude_ai_Business_Online_Leads__create_lead_timeline_event
  - mcp__claude_ai_Business_Online_Leads__get_all_lead_types
  - mcp__claude_ai_Business_Online_Leads__retrieve_all_lead_qcps
  - mcp__claude_ai_Business_Online_Leads__retrieve_all_leads
  - mcp__claude_ai_Business_Online_Leads__retrieve_lead
  - mcp__claude_ai_Business_Online_Leads__retrieve_lead_qcp
  - mcp__claude_ai_Business_Online_Leads__retrieve_lead_timeline_event
  - mcp__claude_ai_Business_Online_Leads__retrieve_lead_timeline_events
  - mcp__claude_ai_Business_Online_Leads__retrieve_leads_dashboard
  - mcp__claude_ai_Business_Online_Leads__update_lead
  - mcp__claude_ai_Business_Online_Leads__update_lead_timeline_event
---

# Business Online CRM

Business Online (BO) is a cloud CRM/Project/HR/QHSE platform built on Microsoft 365. This skill covers the CRM module.

If the user provided an argument (`$ARGUMENTS`), treat it as a search query: look up companies, contacts, or leads matching that name and present the results.

## Capabilities

You have access to these BO CRM operations via MCP:

### Companies
- **List/search companies**: `retrieve_companies` (optional search parameter)
- **Get company details**: `retrieve_company_by_id` (includes all fields, relationships)
- **Create company**: `create_company` (requires name + companyTypeId)
- **Update company**: `update_company` (partial updates supported)
- **Company types**: `get_all_company_types` (prospect, customer, partner, etc.)

### Contacts
- **List/search contacts**: `retrieve_contacts` (search by name)
- **Get contact details**: `retrieve_contact_info` (full profile with company link)
- **Create contact**: `create_contact` (firstName, lastName, email, phone, companyId)
- **Update contact**: `update_contact` (partial updates)

### Leads / Pipeline
- **List leads**: `retrieve_all_leads` (search, filter by status)
- **Get lead details**: `retrieve_lead` (full lead with all qualifications)
- **Create lead**: `create_lead` (title, companyId, value, probability, etc.)
- **Update lead**: `update_lead` (stage changes, value updates, close)
- **Dashboard**: `retrieve_leads_dashboard` (pipeline overview, stage distribution)
- **Lead types**: `get_all_lead_types`

### MEDDIC Qualification
- **Full MEDDIC analysis**: `collect_meddic_data` — Returns structured qualification:
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
1. Call `retrieve_leads_dashboard` for overview
2. Drill into specific leads with `retrieve_lead`
3. Run `collect_meddic_data` for qualification gaps
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

If a Customer or Leads tool call fails:
- **Timeout or connection error**: Tell the user which server (Customer or Leads) is unavailable. Suggest waiting a moment and retrying.
- **Not found (404)**: The ID may be wrong — ask the user to verify the company/contact/lead ID.
- **Validation error**: Show the error message and explain which fields need correction.
- If only one server is down, you can still use the other — Customer and Leads are independent services.

## Reference Documentation
For detailed user guides and screenshots, see:
- `${CLAUDE_SKILL_DIR}/../../docs/brukermanual/crm/introduksjon.md`
- `${CLAUDE_SKILL_DIR}/../../docs/brukermanual/crm/bedrifter.md`
- `${CLAUDE_SKILL_DIR}/../../docs/brukermanual/crm/kontakter.md`
- `${CLAUDE_SKILL_DIR}/../../docs/brukermanual/crm/muligheter.md`
- `${CLAUDE_SKILL_DIR}/../../docs/brukermanual/crm/kontrakter.md`
