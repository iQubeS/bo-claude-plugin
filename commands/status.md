---
description: Get a quick overview of BO platform status — pipeline summary, active projects, open NCRs, and recent activity.
---

# BO Status

Get a quick overview of the Business Online platform.

Run these MCP calls and present a combined dashboard:

1. **Pipeline**: Call `retrieve_leads_dashboard` → Show total leads, stage distribution, total value
2. **Projects**: Call `retrieve_projects_dashboard` → Show active/on-hold/completed counts
3. **NCRs**: Call `retrieve_all_ncrs` with status=open → Show count of open NCRs by category
4. **Recent Activity**: Call `retrieve_companies` to verify connectivity

Format as a clean dashboard with emoji indicators:
- 🟢 Healthy metrics
- 🟡 Needs attention
- 🔴 Action required

Present in Norwegian if the user's context suggests it.
