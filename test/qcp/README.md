# QCP template test fixtures

Manual-testing assets for the `/bo:qcp` command. **Not part of the plugin runtime**: the
plugin only loads `commands/`, `skills/`, `agents/`, and `.claude-plugin/`. These files exist
so you can check that a `<Title>.txt` the command produces will open in BO QCPAdmin as the
QCP it describes.

The format is the QCP body QCPAdmin itself stores: one JSON document per QCP, named
`<Title>.txt`, in the QCP document library, with `qcpTitle`, `processPhases[]` and
`processDetails[]` exactly as the editor's state object (`QCPModal.qcp[0]`). QCPAdmin loads
it with `JSON.parse(text).processPhases` and nothing in between, so the file *is* the editor
state. The shape is described by `assets/qcp/qcp-template.schema.json`, derived from the
three editor interfaces vendored under `assets/qcp/upstream/` and pinned to
`iQubeS/bo-qcp-admin@v0.2.0` in `scripts/check-schema-sync.sh`.

It is **not** the `.qcp.json` exchange file that the Import dialog in QCPAdmin (Next)
validates. That dialog stores the exchange shape unchanged, and the editor cannot open what
it stored; the plugin targets the stored shape directly for that reason.

There are two checks, and they catch different things:

| Check | Catches | Should pass | Should fail |
|---|---|---|---|
| `ajv` against the schema | Structural faults: a missing key, a wrong type, an unknown `Action`, an `ActionIcon` that does not match, a Choice trigger with no value, a timeline entry with a flag but no address, anything a `.qcp.json` has. | `Salgsprosess alle felter`, the three bundled examples | `Kjent feil` |
| `check-qcp-template.mjs` | What the schema cannot express and the editor relies on: `processPhasesLength`, unique ids and `LPID`/`LPDID`, 1-based phase order and 0-based checkpoint order, `relevantDocs_forms_links` equal to the editor's own derivation, dependencies that point at real ids and are mirrored in `statusInformations.dependencies`, a file name equal to `qcpTitle`. Advisories: plain-text descriptions, the legacy boolean `addToTimeline`, duplicate triggers. | `Salgsprosess alle felter`, the three bundled examples | `Kjent feil` |

`Kjent feil` fails both on purpose; every fault it carries is listed in the mutation that
made it (see the block at the end of this file), so a check that stops reporting one of
them has regressed.

> **No customer QCPs ship here.** A real `<Title>.txt` from a tenant carries that tenant's
> site URLs, addresses and process. Migration and continuation are exercised during manual
> QA against a file the tester already holds, with only observations recorded under
> `docs/qa/`. The knowledge about what such files look like is written down in the schema
> descriptions and in `commands/qcp.md`, never shipped as an example.

## Running both checks

From the repo root:

```bash
# Structural
npx -y -p ajv-cli@^5 -p ajv-formats ajv validate --strict=false -c ajv-formats \
  -s assets/qcp/qcp-template.schema.json \
  -d "test/qcp/Salgsprosess alle felter.txt"

# Editor invariants
node scripts/check-qcp-template.mjs "test/qcp/Salgsprosess alle felter.txt"
```

`ajv-formats` is needed because `notify` is declared `format: email`. The file names carry
spaces because a QCP name does; quote them.

## `Salgsprosess alle felter.txt`: everything the format allows

An invented two-phase sales process. Expected: `ajv` valid, pre-flight **exit 0** with no
warnings. It carries:

- all three trigger actions (`Started`/`Play`, `Completed`/`CheckMark`,
  `Deviation`/`ReportHacked`), Choice triggers with a spaced value (`25 %`), a DateTime
  trigger with an `Extender` of `3` and one with `""`;
- an external link and a governing-document link on one checkpoint, so
  `relevantDocs_forms_links` carries both kinds;
- a work file (`checklistDocuments`, `Source: "GDL"`);
- a trigger form (`triggerForm`) and the `formlink` it derives, placed first in
  `relevantDocs_forms_links`;
- dependencies within a phase and across phases, each mirrored in
  `statusInformations.dependencies`;
- a timeline post, a post with notification, a notification alone, and a checkpoint with
  `addToTimeline: []`;
- `na: true` and `commentMandatory: true`;
- HTML descriptions with a paragraph and a list.

## `Kjent feil.txt`: structurally and reference invalid on purpose

Derived from the file above by this mutation (kept here so the expected failures are
auditable):

```js
f.qcpTitle = "Kjent feil";                                 // name matches the file; fails nothing
f.processPhasesLength = 3;                                 // two phases
f.LPDID = 3;                                               // highest detail id is 4
p1.sortOrder = 3;                                          // phases 1 and 3, no 2
p0.processDetails[1].sortOrderDetails = 2;                 // details 0 and 2, no 1
p0.processDetails[0].triggers[0].ActionIcon = "CheckMark"; // Started with the Completed icon
p0.processDetails[0].triggers[1].Status = "";              // Choice with no value
p1.processDetails[0].triggers[1].Extender = "tre";         // DateTime with text days
p1.processDetails[0].triggers[1].Status = "Proposal sent"; // DateTime with a value
p1.processDetails[1].relevantDocs_forms_links.reverse();   // relevantlink before formlink
p1.processDetails[1].dependantFields[0].PhaseDetailID = 99;// no such checkpoint
p1.processDetails[0].statusInformations.dependencies.pop();// mirror shorter than dependantFields
p1.processDetails[0].addToTimeline[0].notify = "";         // sendNotification true, no address
p0.processDetails[1].addToTimeline = false;                // legacy boolean (warning only)
p0.processDetails[1].description = "Ren tekst uten HTML";  // plain text (warning only)
p0.processDetails[0].status = "Completed";                 // runtime state in a template
```

Expected: `ajv` invalid; pre-flight **exit 1** with 14 errors and 2 warnings.

## The bundled examples

`assets/qcp/examples/*.txt` are the calibration examples the command reads for tone and
structure (`HR-onboarding`, `Utviklingsprosjekt`, `Leverandørkvalifisering`). They pass both
checks and double as fixtures; governing-document links in them point into a fictitious
`/sites/Admin/Styrende dokumenter/` library.
