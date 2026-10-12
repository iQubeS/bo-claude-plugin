# Process-diagram test fixtures

Manual-testing assets for the `/bo:process` command. **Not part of the plugin runtime**:
the plugin only loads `commands/`, `skills/`, `agents/`, and `.claude-plugin/`. These files
exist so you can check that a `.diagram.json` the command produces will import into BO
Atlas as the diagram it describes.

The format is the BO Atlas diagram exchange file: `kind: "bo-atlas-diagram"`,
`schema_version: "1.0"`, vendored from `iQubeS/bo-atlas` as
`assets/process/diagram-exchange-v1.schema.json` and pinned by commit in
`scripts/check-schema-sync.sh`. It carries the drawing and only the drawing: lanes, phases,
steps, connectors and annotations. Everything else in an Atlas process (triggers, links,
work files, RACI, ISO mappings, the §4.4.1 definition, the lifecycle) is authored in Atlas
and untouched by an import.

There are two checks, and they catch different things:

| Check | Catches | Should pass | Should fail |
|---|---|---|---|
| `ajv` against the schema | Structural faults: a misspelled key, a missing `shape`, an unknown enum value, a `size` on a step, anything a `.qcp.json` has. Atlas refuses the **whole file**. | all six fixtures | (none; every fixture is structurally valid on purpose) |
| `check-process-diagram.mjs` | Reference faults Atlas also refuses (a connector to a step that is not there, a step in a lane the file does not list, a duplicate id), and advisories Atlas does not give (a decision with one exit, an orphan step, a half-set of coordinates). With the export as a second argument: the diff Atlas will show, and the stale-position trap. | `all-shapes`, `export`, `continuation` (with `export`) | `known-bad`, `continuation-stale-layout` (with `export`) |

The fixtures divide along that split deliberately. `known-bad` is **structurally valid** so
only the pre-flight catches it. There is no structurally invalid fixture because Atlas and
ajv agree exactly on structure and the schema is the single statement of it; the interesting
failures are all the ones the schema cannot express.

> **No customer process documents ship here.** Procedure documents, BPMN exports and
> meeting notes are not ours to redistribute. Migration and discussion modes are exercised
> during manual QA against material the tester already holds, with only observations
> recorded under `docs/qa/`. The document-reading knowledge belongs in a written
> reference beside the command (`assets/process/modelling-lexicon.md`, added with the
> command itself), never in an example file.

## Running both checks

From the repo root:

```bash
# Structural
npx -y -p ajv-cli@^5 -p ajv-formats ajv validate --strict=false -c ajv-formats \
  -s assets/process/diagram-exchange-v1.schema.json \
  -d test/process/all-shapes.diagram.json

# References and advisories, a file written from scratch
node scripts/check-process-diagram.mjs test/process/all-shapes.diagram.json

# Continuation: what will the Atlas review dialog say?
node scripts/check-process-diagram.mjs \
  test/process/continuation.diagram.json \
  test/process/export.diagram.json
```

`ajv-formats` is needed because `exported_at` is declared `format: date-time`.

## `all-shapes.diagram.json`: everything the format allows

A customer-complaint process (*Reklamasjon fra kunde*). Expected: `ajv` valid, pre-flight
**exit 0** with no warnings.

| Covers | How |
|---|---|
| All ten shapes | `oval` start and end, `rect`, `data`, `manual`, `diamond`, `subprocess`, `prep`, `delay`, `document`, `store` |
| All three connector styles and all three arrow kinds | solid sequence flow, dashed information flow with `arrow: both` (a lookup) and `arrow: end` (a report back), dotted association with `arrow: none` (a mandate) |
| A decision with two labelled exits | `ja` / `nei` out of the diamond |
| A rework loop | *Undersøk returnert vare* back to *Registrer reklamasjonen* |
| All three annotation kinds | a `note` attached to a step, a `connector` page marker in a lane with no attachment, an `offpage` reference attached to a step |
| Description semantics | one step with a description, one with `""` (deliberately cleared), most with none (unchanged on import) |
| No coordinates | Atlas lays it out and imports it as `auto` |

## `known-bad.diagram.json`: everything the pre-flight should catch

**Structurally valid on purpose.** `ajv` passes it; the pre-flight must not. Expected:
`ajv` valid, pre-flight **exit 1** with 8 errors and 6 warnings.

| Planted defect | Atlas behaviour |
|---|---|
| Duplicate step id `s3` | refused |
| Duplicate phase title *Vurdering* | refused; phases are keyed by title |
| Step `s4` names phase *Bokføring* and lane `lane-x`, neither listed | refused, twice |
| Connector to `s99` | refused |
| Annotation attached to `s98`, in lane `lane-q` | refused, twice; plus a duplicate annotation id |
| A `position` on one step only | imports, but the position is ignored wholesale (warning) |
| Connector from `s3` to itself | imports as a step depending on itself (warning) |
| A decision with one exit; two steps nothing connects to; a lane with no steps | imports (warnings) |

## `export.diagram.json`, `continuation.diagram.json`, `continuation-stale-layout.diagram.json`

A trio for **continuation mode**, the case where the user started from a file Atlas
exported.

`export.diagram.json` is written the way Atlas writes one: UUID step ids (the stable ids),
one `unlinked:` synthetic id for a step that had none, `exported_at`, and a complete set
of coordinates. On its own the pre-flight passes it with one warning saying the ids look
exported and asking for the export as a second argument. Against itself it reports nothing
changed and `layout kept`, which is the round-trip-is-identity promise.

`continuation.diagram.json` is what `/bo:process` should produce from that export after a
session that:

- renamed *Opprett bruker* (the `unlinked:` step, whose id must survive untouched),
- added *Utpek fadder* with a plain id `s-fadder`,
- removed *Opplæringsplan*,
- moved *Sikkerhetsopplæring gjennomført* to a new lane *Fadder*,
- and **stripped every coordinate**, because something structural changed.

Expected against the export: **exit 0**, with the dialog preview naming the removal first,
then `added 1, renamed 1, moved 1, lanes +1, lines +3 -2, layout none`.

`continuation-stale-layout.diagram.json` is the same edit with the coordinates left in.
Expected against the export: **exit 1**. The error is the stale-position trap: Atlas
honours a complete set, so the moved step is written at its old position outside its new
lane and the new step wherever a number was invented for it. Atlas does not check this
itself; this fixture is the reason the command strips coordinates on any structural change.
