# BO Plugin Documentation

This directory contains reference documentation for the Business Online plugin.

## Brukermanual (User Manual)

The `brukermanual/` directory contains 54 markdown files scraped from https://docs.business-online.no/ covering all BO modules:

### CRM (5 files)
- `crm-introduksjon.md` — CRM module overview
- `crm-bedrifter.md` — Companies/customers/suppliers
- `crm-kontakter.md` — Contacts
- `crm-muligheter.md` — Opportunities/leads/pipeline
- `crm-kontrakter.md` — Contracts

### Prosjekt (5 files)
- `prosjekt-introduksjon.md` — Project module overview
- `prosjekt-prosjekter.md` — Project management
- `prosjekt-arbeidsrom.md` — Project workspaces
- `prosjekt-prosjektplan.md` — Project plans
- `prosjekt-portefolje.md` — Portfolio view

### KHMS/QHSE (12 files)
- `khms-introduksjon.md` — QHSE module overview
- `khms-qdms.md` — Quality document management
- `khms-rapportering.md` — Reporting/NCR
- `khms-bpm.md` — Business process management
- `khms-risikostyring.md` — Risk management
- And 7 more detailed guides

### Personell/HR (4 files)
- `personell-introduksjon.md` — HR module overview
- `personell-personell.md` — Employee management
- `personell-arbeidsrom.md` — Employee workspaces
- `personell-ressursplanlegger.md` — Resource planning

### Ekstrafunksjoner (6 files)
Add-on features like Outlook integration, document management, certificates, supplier evaluation, quote builder

### Administrasjon (10 files)
Configuration and admin guides for global attributes, QCP, users, workspaces, etc.

### Komponenter (6 files)
Shared components: QCP, timelines, info cards, files, key contacts, approvals

### Generelt (6 files)
Platform overview, access, intranet, "Min side" (personal page), resources

## Usage in Skills

Skills reference these docs via:
```markdown
${CLAUDE_SKILL_DIR}/../../docs/brukermanual/<filename>.md
```

Claude Code resolves `${CLAUDE_SKILL_DIR}` to the skill's absolute path, making relative references work correctly.

## Updating Documentation

To refresh the user manual:
```bash
python3 /tmp/fetch-bo-docs-clean.py
```

This uses r.jina.ai to extract clean markdown from the GitBook-based docs site.

## Size

Total: ~424 KB across 54 files (average 7.8 KB per file)
