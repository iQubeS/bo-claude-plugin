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
| `check-process-diagram.mjs` | Reference faults Atlas also refuses (a connector to a step that is not there, a step in a lane the file does not list, a duplicate id, a kept position outside the lane the step names), and advisories Atlas does not give (a decision with one exit, an orphan step, a half-set of coordinates). With the export as a second argument: the diff Atlas will show, and the kept-coordinates-plus-structural-change rule. | `all-shapes`, `export`, `continuation` (with `export`) | `known-bad`, `continuation-stale-layout` (alone and with `export`) |

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
`ajv` valid, pre-flight **exit 1** with 11 errors and 7 warnings.

| Planted defect | Atlas behaviour |
|---|---|
| Duplicate step id `s3` | refused |
| Duplicate phase title *Vurdering* | refused; a phase is referenced by title |
| A phase id in a file that says `1.0`, on both *Vurdering* phases | refused, twice; the id arrived with schema 1.1. Also a warning that only an export writes phase ids |
| The same phase id `p-vurdering` on both | refused once more as a duplicate |
| Step `s4` names phase *Bokføring* and lane `lane-x`, neither listed | refused, twice |
| Connector to `s99` | refused |
| Annotation attached to `s98`, in lane `lane-q` | refused, twice; plus a duplicate annotation id |
| A `position` on one step only | imports, but the position is ignored wholesale (warning) |
| Connector from `s3` to itself | imports as a step depending on itself (warning) |
| A decision with one exit; two steps nothing connects to; a lane with no steps | imports (warnings) |

## `export.diagram.json`, `continuation.diagram.json`, `continuation-stale-layout.diagram.json`

A trio for **continuation mode**, the case where the user started from a file Atlas
exported.

`export.diagram.json` is written the way an Atlas on schema 1.1 writes one: `schema_version`
`"1.1"`, UUID step ids (the stable ids), one `unlinked:` synthetic id for a step that had
none, a UUID `id` on every phase, `exported_at`, and a complete set of coordinates. On its
own the pre-flight passes it with one warning saying the ids look exported and asking for
the export as a second argument. Against itself it reports nothing changed and `layout
kept`, which is the round-trip-is-identity promise.

`continuation.diagram.json` is what `/bo:process` should produce from that export after a
session that:

- renamed *Opprett bruker* (the `unlinked:` step, whose id must survive untouched),
- added *Utpek fadder* with a plain id `s-fadder`,
- removed *Opplæringsplan*,
- moved *Sikkerhetsopplæring gjennomført* to a new lane *Fadder*,
- renamed the phase *Første måned* to *Første tre måneder*, keeping its id, so Atlas sees a
  rename and not a removed plus an added phase,
- kept `"1.1"` and every phase id,
- and **stripped every coordinate**, because something structural changed.

Expected against the export: **exit 0**, with the dialog preview naming the removal first,
then `added 1, renamed 1, moved 1, phases +0 -0, 1 renamed, lanes +1, lines +3 -2, layout
none`. One moved, not three: the two steps in the renamed phase stayed put, and Atlas
agrees since bo-atlas PR #108. Drop the id from the renamed phase and the same file warns
that the phase looks renamed without an id to say so, the phases line becomes `+1 -1`,
and those two steps do count as moved, because without the id Atlas sees a new phase.

`continuation-stale-layout.diagram.json` is the same edit with the coordinates left in.
Expected **exit 1** both on its own and against the export. On its own it trips the fifth
reference check: *Sikkerhetsopplæring gjennomført* names lane `lane-fadder` (band 466 to
586) but keeps `y: 48` from its old lane, which Atlas refuses since bo-atlas PR #103.
Against the export it also trips the continuation rule: a complete set plus a structural
change, because the new step *Utpek fadder* sits at a position somebody invented, which
Atlas would honour. This fixture is the reason the command strips coordinates on any
structural change rather than recomputing bands.
