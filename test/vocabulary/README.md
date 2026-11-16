# Vocabulary-maintenance test fixtures

Manual-testing assets for the `/bo:vocabulary` command. **Not part of the plugin
runtime** — the plugin only loads `commands/`, `skills/`, `agents/`, and
`.claude-plugin/`. These files exist so you can check that the JSON the command produces
both conforms to the provisional schema *and* lands in a tenant as the creates and updates
it describes.

There are two checks, and they catch different things:

| Check | Catches | Should pass | Should fail |
|---|---|---|---|
| `ajv` against the schema | Structural faults — an unknown section, a field from another kind, a bad key, a missing barrier `description`, an enum the format does not have. Any one refuses the **whole file** at import. | `all-features` | `known-bad` |
| `check-ra-vocabularies.mjs` | The same structural rules with better messages, plus — given the tenant export — what the preview will show: create or update per row, every field an update changes, renames, deactivations, names already used under another key, and a destination still running on package seeds. | `all-features` | `known-bad`, anything against `seed-export` |

> **No tenant export ships here.** A real `ra-vocabularies.json` carries a company's
> governing-document codes and control wording and is not ours to redistribute. The
> synthetic export in `assets/vocabulary/examples/` stands in for one; its words exist
> on no real tenant.

## Running both checks

From the repo root:

```bash
# Structural
npx -y -p ajv-cli@^5 ajv validate --strict=false \
  -s assets/vocabulary/ra-vocabularies.schema-v1.json \
  -d test/vocabulary/all-features.vocabularies.json

# Semantic, against the synthetic export
node scripts/check-ra-vocabularies.mjs \
  test/vocabulary/all-features.vocabularies.json \
  assets/vocabulary/examples/ra-vocabularies-export.example.json
```

When preparing a file for a real tenant, swap the export for that tenant's own
`Export all vocabularies` file. Without an export the checker verifies structure only.

## `all-features.vocabularies.json` — everything the format allows

Exercises every writable field and every kind of operation against the synthetic export.
Expected: `ajv` valid, pre-flight **exit 0** with 4 creates, 8 updates, 3 identical rows
and 7 advisory warnings.

| Row | What it covers |
|---|---|
| `vibration`, `legacy-dust` (risk sources) | Creates. `legacy-dust` is created inactive, which draws a warning: nobody can pick it. |
| `noise` | Update that reactivates an inactive row and adds `nameNb`. Both changes are listed; the preview leaves updates unselected. |
| `electrical` | `nameNb: null` — an explicit clear of an optional field, reported as `-> cleared`. |
| `hot-work`, `crushing-and-trapping` | Identical rows apart from `sortOrder`. One differs from the destination and draws the "not applied" warning; neither needs a write. |
| `safe-job-analysis` (barrier) | Create with every maintenance field, including a 180-day interval and a document reference. |
| `permit-to-work` | Clears `documentReference` and `verificationIntervalDays` with explicit nulls while repeating the required `name` and `description` verbatim. |
| `physical-guarding` | Adds `suggestedFunction` only. |
| `remote-operation` | Renames the entry. The key stays; the rename is a warning so nobody mistakes it for a second entry. |
| `fire-watch`, `hearing-protection` | Reactivation and deactivation, each a warning. |
| `hot-work-certificate` (obligation) | Create with `obligationType: "Permit"`. |
| `working-environment-act` | Identical to the destination: no write. |
| `customer-hse-requirements` | Clears `jurisdiction`. |
| `exposureTargets` section | Export-only context carried in an import file. Reported as "Not imported", never written. |

## `known-bad.vocabularies.json` — everything the pre-flight should catch

Expected: `ajv` invalid, pre-flight **exit 1** with 13 structural problems and 1 warning.

| Planted defect | Why it matters |
|---|---|
| Section `effectCategories` | Not one of the seven sections. Effect categories cannot be maintained through this route at all. |
| Key `"Varmt arbeid"` | Keys are lower-case hyphenated ASCII, never a translated name. |
| `hot-work` twice | One key, one row. |
| `name: ""` | An empty string is refused; omit to preserve, null to clear. |
| `active: null` | Null is refused on `active`; omit it to preserve. |
| `harmsPeople` on a risk source | A field from another kind is refused, not ignored. |
| `colour` | Unknown field. |
| Barrier without `description` | Required on every barrier row, update or not. |
| `suggestedType: "Administrative"` | The enum says `Organisational`. No fallback choice is made. |
| `verificationIntervalDays: 0` and `1.5` | Positive whole days or null. Never corrected. |
| `suggestedFunction: "Preventive"` | The enum says `Preventing`. |
| `obligationType: "Law"` | The enum says `Legal`. |
| `falling-load` named "Falling or shifting load" | Only surfaces once the file is otherwise clean: that name exists under `falling-or-shifting-load`, so the preview would leave it unselected. |

## `seed-export.json` — a destination that cannot be written yet

A minimal export whose `riskSources` and `barrierLibrary` are `source: "seed"`, meaning
the tenant still runs on package defaults for those lists. Run any import file against it:

```bash
node scripts/check-ra-vocabularies.mjs \
  assets/vocabulary/examples/ra-vocabularies-import.example.json \
  test/vocabulary/seed-export.json
```

Expected: **exit 1** with two problems against the destination. The import refuses to
write seeded lists until an administrator has run the population step in BO; an empty
`complianceObligations` list is writable without it, which is why that section is
`stored` with no entries here.

## Keeping these in sync

The schema and the checker are derived from the bo-ra handoff document, not from bo-ra's
source, which was still in peer review when they were written (2026-11-16). When bo-ra
publishes `docs/ra-vocabularies.schema.json`, vendor it over
`assets/vocabulary/ra-vocabularies.schema-v1.json`, add the pin to
`scripts/check-schema-sync.sh`, and re-run both checks here. If the runtime parser
(`src/services/vocabularyTransfer.ts`) and the checker disagree, the parser is right.
