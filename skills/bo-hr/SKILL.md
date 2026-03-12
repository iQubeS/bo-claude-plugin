---
description: Business Online HR/Personnel module guidance — employee management, onboarding, absence tracking, and organizational structure. Use when working with HR data, employee records, or personnel processes.
---

# Business Online HR (Personnel)

The BO HR module manages employee lifecycle, organizational structure, absence tracking, and personnel documents. It integrates with M365 for identity and Teams/Outlook for communication.

## Module Overview

### Core Features
- **Employee registry**: Personal info, employment details, roles, departments
- **Organizational chart**: Department hierarchy, reporting lines
- **Absence management**: Leave requests, sick leave, vacation tracking
- **Onboarding/Offboarding**: Checklist-driven processes with M365 provisioning
- **Document management**: Employment contracts, certificates, training records
- **Competence tracking**: Skills, certifications, expiry dates

### M365 Integration Points
- **Entra ID**: Employee identity provisioning and deprovisioning
- **SharePoint**: HR document libraries per employee
- **Teams**: Automated team membership based on department
- **Outlook**: Calendar integration for absences

## Architecture
- Data stored in BO platform (Azure, norwayeast region)
- SPFx web parts render in SharePoint for end-user access
- Azure Functions handle background processing (notifications, provisioning)
- Logic Apps orchestrate cross-system workflows (M365 ↔ BO)

## Integration Patterns

### Employee Onboarding Flow
1. HR creates employee record in BO
2. Logic App triggers Entra ID user provisioning
3. SharePoint site/library created for employee documents
4. Teams channels updated with new member
5. Onboarding checklist activated with assigned tasks

### Absence Request Flow
1. Employee submits absence request via SPFx web part
2. Manager receives approval notification (Teams/Email)
3. Approved absences sync to Outlook calendar
4. Dashboard reflects updated capacity

## Notes
- HR data is sensitive — always respect data classification and GDPR
- Employee IDs are GUIDs in BO, linked to Entra ID object IDs
- Multi-tenant: each customer tenant has isolated HR data
- SPFx web parts are deployed to tenant app catalog
