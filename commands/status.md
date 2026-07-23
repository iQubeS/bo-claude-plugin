---
description: Get a quick overview of BO platform status — pipeline summary, active projects, open NCRs, and recent activity.
allowed-tools:
  - mcp__claude_ai_Business_Online_CRM__retrieve_all_companies
  - mcp__claude_ai_Business_Online_Leads__retrieve_leads_overview
  - mcp__claude_ai_Business_Online_Projects__retrieve_projects_overview
  - mcp__claude_ai_Business_Online_NCR__retrieve_ncrs
---

# BO Status

Get a quick overview of the Business Online platform.

Run these MCP calls and present a combined dashboard. The overview endpoints return
paginated rows (max 100 per page) plus a `totalCount` — the aggregation happens on your
side, so follow the recipes below to get exact numbers instead of first-page approximations:

1. **Pipeline**: Call `retrieve_leads_overview` with `status=Active, limit=100`, then keep
   paging with `offset` until you have all rows (`totalCount` tells you when you're done;
   stop after 5 pages and note the cutoff if the pipeline is unusually large). From the
   full row set compute: total active leads, distribution across the six `lcmStatus`
   stages (Registered → Negotiating proposal), and the sum of `contractValue`.
2. **Projects**: Call `retrieve_projects_overview` once per activity status you report —
   `activity=Started`, `Continuous`, `Pending`, `Not started`, `Completed` — each with
   `limit=1`, and read `totalCount` from each response. Five tiny calls give exact counts
   without paging 200+ project rows.
3. **NCRs**: Call `retrieve_ncrs` with `limit=100` and page until done (`totalCount`).
   There is no server-side status filter, so count client-side: everything with
   `status != "Closed"` is open. Group the open ones by `typeRegistration`.
4. **Connectivity check**: Call `retrieve_all_companies` with `limit=1` — a response with
   a `totalCount` confirms the CRM service is up.

If any of the calls fail, show results for the services that responded and note which ones
are unavailable.

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
   130 aktive leads | Totalverdi: 2.1M NOK
   🟢 Registrert: 10  |  Tildelt: 8  |  Evaluering: 15
      Møte avtalt: 35  |  Tilbud sendt: 40  |  Forhandling: 22

📋 Prosjekter
   🟢 Pågår: 8  |  Løpende: 12  |  🟡 Venter: 2  |  ✅ Fullført: 95

🛡️ Avvik (NCR)
   🔴 5 åpne avvik
   Avvik: 2  |  Kundetilbakemelding: 2  |  Leverandøravvik: 1

🔗 Tilkobling: 🟢 Alle tjenester OK
```
