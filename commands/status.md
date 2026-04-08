---
description: Get a quick overview of BO platform status — pipeline summary, active projects, open NCRs, and recent activity.
allowed-tools:
  - mcp__claude_ai_Business_Online_Customer__retrieve_companies
  - mcp__claude_ai_Business_Online_Leads__retrieve_leads_dashboard
  - mcp__claude_ai_Business_Online_Projects__retrieve_projects_dashboard
  - mcp__claude_ai_Business_Online_Nonconformance__retrieve_all_ncrs
---

# BO Status

Get a quick overview of the Business Online platform.

Run these MCP calls and present a combined dashboard:

1. **Pipeline**: Call `retrieve_leads_dashboard` → Show total leads, stage distribution, total value
2. **Projects**: Call `retrieve_projects_dashboard` → Show active/on-hold/completed counts
3. **NCRs**: Call `retrieve_all_ncrs` with status=open → Show count of open NCRs by category
4. **Recent Activity**: Call `retrieve_companies` to verify connectivity

If any of the calls fail, show results for the services that responded and note which ones are unavailable.

Format as a clean dashboard with emoji indicators:
- 🟢 Healthy metrics
- 🟡 Needs attention
- 🔴 Action required

Present in Norwegian if the user's context suggests it.

### Example Output

```
📊 BO Status Dashboard
━━━━━━━━━━━━━━━━━━━━━

🎯 Pipeline
   12 aktive leads | Totalverdi: 4.2M NOK
   🟢 Prospekt: 3  |  Kvalifisert: 4  |  Tilbud: 3  |  Forhandling: 2

📋 Prosjekter
   🟢 Aktive: 8  |  🟡 On hold: 2  |  ✅ Fullført: 15

🛡️ Avvik (NCR)
   🔴 5 åpne avvik
   Kvalitet: 2  |  HMS: 1  |  Kundeklage: 2

🔗 Tilkobling: 🟢 Alle tjenester OK
```
