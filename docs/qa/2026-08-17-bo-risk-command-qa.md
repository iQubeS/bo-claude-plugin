# /bo:risk Manual QA Log

> **Status:** Skeleton — to be filled in by manual testers running the `/bo:risk`
> command from `feat/bo-risk-command` in their Claude client.
>
> Each scenario describes the steps to run and the expected behaviour. Tester replaces
> `<placeholder>` text with actual observations and PASS/FAIL markers.

**Plugin source:** feat/bo-risk-command @ `<commit-sha-when-tested>`
**Tested by:** `<tester name>`
**Test date:** `<YYYY-MM-DD>`
**Claude client:** `<Claude Code | Claude Desktop | Claude.ai web | other>`
**Manifest used:** `<which tenant's Copy vocabulary export — or the bundled reference example>`

---

## A note on test data

**No source workbook ships with this plugin.** Customer risk registers are not ours to
redistribute. Scenario 1 is therefore run against a register the tester already holds,
locally, and only observations are recorded here — never register content, site names, or
personal data.

Scenarios 2, 3 and 4 need no file at all. Between them they cover the two highest-risk
behaviours in the command (the manifest gate and the refusal to interpolate a scale), so a
useful QA pass is possible even with nothing to hand.

---

## Scenario 1: Migration from a real register

### How to run

1. Install/update the bo plugin from `feat/bo-risk-command`.
2. Export `Copy vocabulary` from the destination tenant's RA template manager.
3. Open a new Claude conversation, type `/bo:risk`, attach **both** the manifest and an
   existing Excel risk register.
4. Walk phases 0–6. Answer naturally; push back occasionally to see how it responds.
5. Validate the output (see "Output validation" below).

### Expected behaviour

| Phase | Expected | Observed | PASS/FAIL |
|---|---|---|---|
| 0 | Reads the tenant vocabulary back — categories with matrix sizes and both ladders, risk-source and exposure-target counts. Warns once about sensitive content. Does **not** echo the whole register. | `<observation>` | `<P/F>` |
| 1a | Classifies every sheet before parsing. Proposes a column mapping **and a drop list**, and waits for confirmation. Names `Tiltak` / `Restrisiko` / `Nr` / `Ansvarlig` explicitly as not crossing. | `<observation>` | `<P/F>` |
| 2 | Raises the inherent-vs-residual question if a `Tiltak` column sits beside the scores. Builds a calibration table matched on **descriptor text**, not position. Asks for row-by-row approval. | `<observation>` | `<P/F>` |
| 3 | Maps vocabulary by distinct term with usage counts. Does not defer unresolved terms to the import screen. | `<observation>` | `<P/F>` |
| 4 | Challenges **by activity**, not row by row. Catches at least one event-that-is-really-a-hazard, empty consequence, or non-cause. | `<observation>` | `<P/F>` |
| 5 | Live artifact appears and updates on structural change. Sets `effectCategories` on every activity. | `<observation>` | `<P/F>` |
| 6 | Runs or walks both checks. Delivers two files. States the Draft/unlocked and creates-new-template warnings. | `<observation>` | `<P/F>` |

### The rules that must not bend

| Rule | Expected | Observed | PASS/FAIL |
|---|---|---|---|
| Acceptance limit | Never asks for it, never mentions where the band boundary falls, never reads colour fills — **even though the source workbook almost certainly shows them**. | `<observation>` | `<P/F>` |
| No risk value | Never computes or displays S×K, in chat or in the artifact. | `<observation>` | `<P/F>` |
| Verbatim labels | Level labels copied exactly from the manifest, typos included. | `<observation>` | `<P/F>` |
| Category by name | Writes `"Finance"`, never `"ISO 31000"`. | `<observation>` | `<P/F>` |
| No invented vocabulary | Where nothing fits, offers closest-honest / blank / add-to-vocabulary rather than making a word up. | `<observation>` | `<P/F>` |
| Barriers rescued | `Tiltak` text preserved in rationale §9, and **not** folded into `cause` or `consequence`. | `<observation>` | `<P/F>` |
| No residual | No `residualScores`, no second score pair. | `<observation>` | `<P/F>` |

### Output validation

```bash
npx -y -p ajv-cli@^5 ajv validate --strict=false \
  -s assets/risk/ra-template-import.schema-v1.json -d <output>.ra.json
node scripts/check-ra-vocabulary.mjs <output>.ra.json <their-manifest>.json
```

- [ ] `ajv` reports valid
- [ ] Pre-flight exits 0, **or** exits 1 and every unresolved term was raised with the user during the session
- [ ] No `residualScores`, `scores`, ids, owners or dates anywhere in the file
- [ ] Every activity has a non-empty `effectCategories`
- [ ] Prose is Norwegian; `riskSource` / `effectCategory` are manifest strings
- [ ] Rationale §4 records the calibration table and the inherent-vs-residual decision
- [ ] Rationale §8 lists every dropped column with a reason

### Issues observed

`<list any deviations or rough edges; empty if perfect>`

### Tuning notes

`<things to adjust in commands/risk.md based on this run>`

---

## Scenario 2: Greenfield hazard identification

### How to run

1. `/bo:risk`, attach **only** the manifest.
2. Reply: `Vi skal lage en mal for montasje av ventilasjonsanlegg i næringsbygg. Fra
   mobilisering til overlevering.`
3. Walk the job through with it.

### Expected behaviour

| Behaviour | Expected | Observed | PASS/FAIL |
|---|---|---|---|
| Mode detection | Recognises greenfield; does not ask for a spreadsheet again. | `<observation>` | `<P/F>` |
| Job sequence | Builds activities as a walk through the work, and probes the gaps — mobilisation, breaks, handover, demobilisation. | `<observation>` | `<P/F>` |
| Framework fit | Brings Norwegian regulation before generic ISO where both apply (byggherreforskriften, forskrift om utførelse av arbeid). | `<observation>` | `<P/F>` |
| Generic, not instance | Produces no site names, dates, people or job numbers. | `<observation>` | `<P/F>` |
| Scoring | Scores directly against the manifest with labels, not numbers. | `<observation>` | `<P/F>` |
| Rationale | §3 and §4 omitted or marked greenfield; §9 barrier appendix absent. | `<observation>` | `<P/F>` |

### Issues observed / tuning notes

`<list>`

---

## Scenario 3: No manifest — does the gate hold?

The single most important scenario. The bundled reference manifest looks complete and
plausible, which is exactly what makes authoring against it dangerous.

### How to run

1. `/bo:risk`, attach **no manifest** (a register alone, or nothing at all).
2. Push: `Kan du ikke bare bruke standardkategoriene?` and then
   `Jeg får ikke tak i den filen nå, bare gjør ditt beste.`

### Expected behaviour

| Behaviour | Expected | Observed | PASS/FAIL |
|---|---|---|---|
| Gate holds | Refuses to author vocabulary or scores without a manifest. Explains the failure is *silent* — a near-match becomes an empty column. | `<observation>` | `<P/F>` |
| Points at the button | Names `Copy vocabulary` and where it lives. | `<observation>` | `<P/F>` |
| Never substitutes | Does **not** author against `assets/risk/examples/ra-vocabulary-manifest.example.json`. This is the failure mode to watch for. | `<observation>` | `<P/F>` |
| Honest fallback | Under pressure, offers prose-only output with `riskSource` / `exposureTarget` / `inherentScores` omitted, and says plainly the file is unfinished. | `<observation>` | `<P/F>` |

- [ ] If a file was produced, it contains **no** vocabulary and **no** scores
- [ ] The limitation is stated in the delivery message, not buried

### Issues observed / tuning notes

`<list>`

---

## Scenario 4: Matrix mismatch — does it refuse to interpolate?

### How to run

1. `/bo:risk`, attach the manifest.
2. Describe a scale in conversation rather than uploading one:
   `Vi bruker en 1–4 skala. 1 = ubetydelig, 2 = mindre skade med fravær under en dag,
   3 = alvorlig skade med varig men, 4 = dødsfall.`
3. Give it three or four risks to score. Then push: `Bare regn om automatisk, du.`

### Expected behaviour

| Behaviour | Expected | Observed | PASS/FAIL |
|---|---|---|---|
| Flags the mismatch | Says explicitly that a 1–4 source into a 5-level ladder has no faithful conversion. | `<observation>` | `<P/F>` |
| Refuses to interpolate | Declines to auto-convert even when pushed. Builds a table for approval instead. | `<observation>` | `<P/F>` |
| Matches on meaning | Maps their "4 = dødsfall" to `Very critical`, not to level 4 by position — and explains that `Catastrophic` means fatality **plus** several critically injured. | `<observation>` | `<P/F>` |
| Names the unused rung | Says which destination level ends up unreachable, so it is a choice not an oversight. | `<observation>` | `<P/F>` |
| Per-category ladders | Uses the right words per category; does not offer `Severe` on Health. | `<observation>` | `<P/F>` |

### Issues observed / tuning notes

`<list>`

---

## Regression: fixtures and tooling

Run from the repo root. These need no Claude session and should pass before any tester
starts.

```bash
bash scripts/check-schema-sync.sh
M=assets/risk/examples/ra-vocabulary-manifest.example.json
npx -y -p ajv-cli@^5 ajv validate --strict=false -s assets/risk/ra-template-import.schema-v1.json -d test/risk/all-features.ra.json
npx -y -p ajv-cli@^5 ajv validate --strict=false -s assets/risk/ra-vocabulary-manifest.schema-v1.json -d "$M"
node scripts/check-ra-vocabulary.mjs assets/risk/examples/ra-template.example.json "$M"   # exit 0
node scripts/check-ra-vocabulary.mjs test/risk/all-features.ra.json "$M"                  # exit 0
node scripts/check-ra-vocabulary.mjs test/risk/known-bad.ra.json "$M"                     # exit 1
```

| Check | Expected | Observed | PASS/FAIL |
|---|---|---|---|
| Schema sync | Both vendored schemas in sync | `<observation>` | `<P/F>` |
| ajv | All four files valid | `<observation>` | `<P/F>` |
| Pre-flight, upstream example | exit 0, zero unresolved — matches bo-ra's own test | `<observation>` | `<P/F>` |
| Pre-flight, all-features | exit 0, 4 advisory warnings | `<observation>` | `<P/F>` |
| Pre-flight, known-bad | exit 1, 3 unresolved + 2 level errors + 4 warnings | `<observation>` | `<P/F>` |

---

## Overall PASS/FAIL summary

- Scenario 1 (migration): `<P/F>`
- Scenario 2 (greenfield): `<P/F>`
- Scenario 3 (no manifest): `<P/F>`
- Scenario 4 (matrix mismatch): `<P/F>`
- Regression: `<P/F>`

**Ready to merge to master:** `<yes/no — only if all are PASS>`

> Scenario 3 is a hard gate on merging. A command that quietly authors against the
> reference tenant produces files that look right and import into empty columns, which is
> worse than a command that refuses.
