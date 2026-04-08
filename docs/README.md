# BO Plugin Documentation

This directory contains reference documentation for the Business Online plugin.

## Brukermanual (User Manual)

The `brukermanual/` directory contains the complete BO user manual organized by module. See [brukermanual/README.md](brukermanual/README.md) for the full table of contents.

### Structure

Files are organized hierarchically by module:

| Directory | Content |
|-----------|---------|
| `brukermanual/crm/` | CRM — companies, contacts, opportunities, contracts |
| `brukermanual/prosjekt/` | Project management, workspaces, portfolio |
| `brukermanual/khms/` | QHSE — QDMS, reporting, BPM, risk management |
| `brukermanual/personell/` | HR — employees, workspaces, resource planning |
| `brukermanual/ekstrafunksjoner/` | Add-ons — Outlook, document management, certificates |
| `brukermanual/administrasjon/` | Admin — users, global attributes, QCP config |
| `brukermanual/komponenter/` | Shared components — QCP, timeline, info cards |
| `brukermanual/ressurser/` | Resources and work processes |

Each module directory has an `_index.md` category index. General articles (overview, access, intranet, personal page) sit directly under `brukermanual/`.

### Usage in Skills

Skills reference these docs via:
```markdown
${CLAUDE_SKILL_DIR}/../../docs/brukermanual/<module>/<filename>.md
```

`${CLAUDE_SKILL_DIR}` resolves at runtime to the skill's absolute path.
