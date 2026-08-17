# Risk-assessment test fixtures

Manual-testing assets for the `/bo:risk` command. **Not part of the plugin runtime** —
the plugin only loads `commands/`, `skills/`, `agents/`, and `.claude-plugin/`. These
files exist so you can check that the JSON the command produces both conforms to the
schema *and* resolves against a real tenant's vocabulary.

There are two checks, and they catch different things:

| Check | Catches | Should pass | Should fail |
|---|---|---|---|
| `ajv` against the schema | Structural faults — a misspelled key, a missing `event`, a `residualScores` block. Any one refuses the **whole file** at import. | both | neither |
| `check-ra-vocabulary.mjs` | Semantic faults — words this tenant does not know, levels its axes do not have. These import "successfully" and leave blanks behind. | `all-features` | `known-bad` |

The second check is the one worth internalising. A file can be perfectly valid and still
import into an empty column, because unresolved vocabulary is not an error in the
importer — it is a reconciliation conversation, and a blank risk source means the risk
appears under no portfolio grouping at all.

> **No source workbook ships here.** Customer risk registers are not ours to
> redistribute. Migration mode is exercised during manual QA against a register the
> tester already holds, with only observations recorded — see `docs/qa/`. The
> spreadsheet knowledge lives in `assets/risk/column-lexicon.md` instead of in an
> example file.

## Running both checks

From the repo root:

```bash
# Structural
npx -y -p ajv-cli@^5 ajv validate --strict=false \
  -s assets/risk/ra-template-import.schema-v1.json \
  -d test/risk/all-features.ra.json

# Semantic, against the reference-tenant manifest
node scripts/check-ra-vocabulary.mjs \
  test/risk/all-features.ra.json \
  assets/risk/examples/ra-vocabulary-manifest.example.json
```

When authoring for a real tenant, swap the manifest for that tenant's own
`Copy vocabulary` export. The bundled one is the **reference** tenant, and its words are
not guaranteed to exist anywhere else.

## `all-features.ra.json` — everything the format allows

Exercises the full surface of `ra-template-import.schema-v1.json`. Expected: `ajv`
valid, pre-flight **exit 0** with four advisory warnings.

| Activity | What it covers |
|---|---|
| Alle fem kategorier med etikett | One risk per effect category, scored by label. Includes **`"Not Dangerousor hazardous"`** — the Environment ladder's own typo, copied verbatim. Correcting the missing space breaks resolution, which is the lesson. |
| Ordinaler og nøkkelbaserte oppslag | Levels as integers (`5`), as numeric strings (`"3"`), and vocabulary by key (`electrical`, `stored-and-residual-energy`, `personnel`) and by Norwegian `nameNb` (`Miljø`). |
| Minimal og maksimal risiko | A risk carrying only `event` (the sole required field), beside one with every optional field set and two scores on different categories. |
| Aktivitet uten risikoer | An activity with no `risks` at all — valid, and imports as an empty activity. |

Also covered: `$schema` present (allowed and ignored by the importer), the Opportunity
category's separate ladders (`Exceptional`, `Medium`), and all three exposure-target
lookup forms — key, English `name`, Norwegian `nameNb`.

The four expected warnings are advisory, not failures: four ordinal levels, two risks
with no `riskSource`, one with no `exposureTarget`, one with no scores.

## `known-bad.ra.json` — everything the pre-flight should catch

**Structurally valid on purpose.** `ajv` passes it; the pre-flight must not. Expected:
`ajv` valid, pre-flight **exit 1** with 3 unresolved terms, 2 level errors, 4 warnings.

| Planted defect | Why it matters |
|---|---|
| `riskSource: "Fallende gjenstander"` (×2) | Risk sources carry no `nameNb` on the reference tenant, so **no Norwegian risk-source term ever resolves**. Imports blank. |
| `exposureTarget: "Ansatte"` | A plausible Norwegian synonym that is not the registered word (`Personell`). |
| `effectCategory: "HMS"` | Not a category this tenant knows. Its score is dropped; the risk still imports. |
| `consequence: "Severe"` on Health | `Severe` is level 5 on Finance and Reputation and **does not exist on Health at all**. Refused, never clamped. |
| `consequence: 6` on a 5X5 matrix | Out of range. Also refused, never clamped — a file authored against a bigger grid must say so. |
| `effectCategory: "ISO 31000"` | Resolves, but Finance *and* Reputation both declare that standard, so array order decides. Silently means Reputation. |
| Activity with no `effectCategories` | Its risks are not merely unscored but unscorable until someone sets categories by hand. |
| Score on a category the activity doesn't list | The importer writes it anyway, but no column in the UI will show it. |

### The suggester will not translate for you

`known-bad` also demonstrates a limit worth knowing before relying on the importer's
reconciliation screen. Suggestions come from a Dice coefficient over character bigrams,
which measures *spelling* similarity and stays silent below 0.34:

```
Falling or shifting loads  -> Falling or shifting load   0.98   suggested
Crushing / trapping        -> Crushing and trapping      0.84   suggested
Elektrisk                  -> Electrical                 0.47   suggested (Latin roots, by luck)
Fallende gjenstander       -> best candidate scored 0.27        silent
Klemfare                   -> best candidate scored 0.13        silent
```

So for a Norwegian source register the manager is typically handed a list of unresolved
words with **no suggestions attached**. Translating the vocabulary is the command's job
in Phase 3, not something to defer to the import screen.

## Keeping these in sync

If `scripts/check-schema-sync.sh` reports drift in the vendored schema, re-read
`bo-ra:src/services/templateJson.ts` before trusting either fixture — the resolver, not
the schema, is what these assert against. When a new field or category behaviour is added
upstream, add a case here that exercises it.

### Where the upstream material lives

Vendored into this repo, and checked by `check-schema-sync.sh`:

| Here | Upstream (`iQubeS/bo-ra@3f1140ab`) |
|---|---|
| `assets/risk/ra-template-import.schema-v1.json` | `docs/ra-template-import.schema.json` |
| `assets/risk/examples/ra-template.example.json` | `docs/examples/ra-template.example.json` |
| `assets/risk/examples/ra-vocabulary-manifest.example.json` | `docs/examples/ra-vocabulary-manifest.example.json` |

Read but **not** vendored, because its operational content is distilled into
`commands/risk.md` and `assets/risk/column-lexicon.md` and a second copy would only drift:

- `bo-ra:docs/ra-template-authoring.md` — the human-readable authoring guide.
- `bo-ra:src/services/templateJson.ts` — parse, normalise, resolve, reconcile, plan. **The
  actual contract.** `scripts/check-ra-vocabulary.mjs` reimplements four of its pure
  functions and says so in its header.
- `bo-ra:tests/templateJsonExamples.test.ts` — asserts the published example needs zero
  reconciliation, which is where this repo's quality bar comes from.
