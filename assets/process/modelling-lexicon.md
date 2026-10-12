# Modelling lexicon for `/bo:process`

How to turn what a customer says, writes or draws into the five things the BO Atlas
diagram file can hold: lanes, phases, steps, connectors and annotations. §1 to §4 are the
vocabulary of the drawing; §5 to §9 are how to read source material and what to challenge;
§10 is how to read an Atlas export. This is a written reference on purpose: no customer
procedure, BPMN export or meeting notes ship with the plugin.

---

## 1. Shapes, and when a step earns one

`rect` is the default. Most steps are a `rect`. Every other shape is a claim about the step
that a reader should be able to rely on, so use it only when the claim is true.

| Shape | Use when | Norwegian cues in the source | Not for |
|---|---|---|---|
| `oval` | The process starts or ends here. One at the start, one at every end. | *utløses av*, *starter når*, *mottatt*, *avsluttet*, *lukket*, *ferdig* | A milestone in the middle |
| `rect` | Work is done. | any verb | a decision, a document |
| `diamond` | A choice with two or more outcomes, each a labelled exit. | *dersom*, *hvis*, *ved*, *avhengig av*, *vurder om*, *godkjent?* | A step that *contains* a judgement but has one outcome (*Vurder tilbudet* that always proceeds is a `rect`) |
| `document` | The step produces something on paper or as a file. | *utarbeid*, *skriv*, *fyll ut*, *send bestilling*, *rapport*, *skjema*, *protokoll*, *tilbud* | The document itself as a step; the *producing* is the step |
| `data` | Data is read or written in a system, without a person judging. | *registrer i*, *slå opp*, *hent fra ERP/BO/regnskap* | Any step a person mostly thinks through |
| `subprocess` | The work is covered by its own process or procedure. | *iht. prosedyre*, *se rutine for*, *etter gjeldende prosess*, *håndteres som avvik* | A big step that just needs splitting |
| `manual` | A physical, hands-on operation worth marking as such. | *kontroller fysisk*, *inspiser*, *monter*, *pakk* | Every step done by a person (that is all of them) |
| `prep` | Setting something up before the real work. | *klargjør*, *rigg*, *forbered*, *bestill utstyr* | A plain first step |
| `delay` | Waiting on someone outside the lane, usually outside the company. | *avvent*, *vent på*, *frist*, *innen 14 dager* | A step that merely takes time |
| `store` | Filing or archiving as the point of the step. | *arkiver*, *lagre i saksmappe*, *journalfør* | Saving a file as a side effect |

Keep to three or four shapes in one diagram. A diagram using all ten is a legend, not a
process.

## 2. Connectors, and what each one says

A connector is also a dependency in the Atlas process: it says the target step connects to
the source step, and that is what reaches QCPAdmin. So every line has a cost, and the test
for drawing one is whether a reader would be misled without it.

| `style` | Meaning | Draw it when |
|---|---|---|
| `solid` (default) | Sequence flow: the work moves on. | One step follows another, including backward (rework). |
| `dashed` | Information flow: something is sent, reported or looked up; the work does not move. | A copy goes to a lane that does nothing with it; a step looks something up; a result is reported back. |
| `dotted` | Association: a loose relationship worth showing. | A mandate, a reference, an input that is not a hand-off. Rare. |

| `arrow` | Use |
|---|---|
| `end` (default) | Almost always. |
| `both` | A lookup or an exchange where both sides act (*oppslag*, *avklaring*). |
| `none` | An association with no direction. |

`label`: required on every exit from a `diamond` (*ja* / *nei*, or the condition in two or
three words), and on every backward line (*avvik*, *mangler opplysninger*, *avvist*). Elsewhere
only when the reader needs it; a label on every line is noise.

A line from a step to itself is meaningless and the pre-flight warns about it. Two lines
between the same two steps in the same direction are one line.

## 3. Annotations: the things that are not steps

| `kind` | Use |
|---|---|
| `note` | A rule, a limit, a reminder, a reference to a governing document. *Rammeavtalen går foran.* *Beløpsgrense 50 000 kr.* |
| `offpage` | A pointer to another process or diagram. Pair it with a `subprocess` step, or use it alone at the edge where the work leaves this process. |
| `connector` | An on-page marker (an *A* in a circle) for a line that would otherwise cross the whole diagram. Use sparingly; a backward solid line with a label usually reads better. |

`attached_to` the step the note belongs with, `lane` where it should sit. A note with
neither floats; give it a lane at least.

**Never** store a note as a step. A step reaches QCPAdmin as a checkpoint in the customer's
process; a note never does.

## 4. Lanes and phases

### Lanes are roles that act

- Three to six. Seven is the edge of readable; more is two processes.
- A role, never a person. *Prosjektleder*, not *Kari*. The rationale may record who holds
  the role today.
- A lane must perform at least one step. A role that only receives information is the
  target of a dashed line, not a lane.
- Order top to bottom in reading order: the role that starts the process on top, or the
  customer on top if the customer starts it.
- Ids are readable and stable: `lane-innkjoper`, `lane-kunde`. In continuation mode the
  export's ids are kept exactly.

### Phases are stages of the work, and they become QCP phases

- Three to seven, left to right, named as nouns: *Behov*, *Bestilling*, *Mottak*, not
  *Bestill* or *Motta varen*.
- A phase boundary is where a reader would say "and now the next part begins", usually a
  hand-off or a decision.
- Phases are keyed by title in Atlas. A rename is a delete plus a create, and a phase-scoped
  ISO mapping does not follow. Choose titles that will last.
- Every phase needs at least one step. An empty phase is a column with nothing in it.

---

## 5. Reading a Norwegian procedure document

### 5.1 The usual shapes of a procedure

| Document pattern | Where the diagram comes from |
|---|---|
| **Formål / Omfang / Ansvar / Beskrivelse / Referanser** (the quality-system standard) | *Ansvar* lists the roles (lanes). *Beskrivelse* is the flow, often numbered. *Omfang* gives start and end. *Referanser* gives `offpage` notes and `subprocess` candidates. |
| **Numbered steps** (1, 1.1, 1.2 ...) with a role in bold or in parentheses | Top-level numbers are phase candidates; sub-numbers are steps. The role is the lane. |
| **A step table**: *Nr / Aktivitet / Ansvarlig / Beskrivelse / Dokument* | One row per step. *Ansvarlig* is the lane, *Dokument* makes the step `document` or adds a note. See 5.2 for header variants. |
| **RACI table** beside the text | *R* is the lane the step sits in. *A*, *C*, *I* are not in the file; record them in the rationale for authoring in Atlas afterwards. |
| **A flowchart image** embedded in the document | Read it as a drawing (§8). It often disagrees with the text; ask which is current. |
| **Prose only**, paragraphs | Walk it sentence by sentence for verbs with a subject. Expect to ask more questions. |

### 5.2 Header variants in step tables

| Concept | Headers seen |
|---|---|
| Step | *Aktivitet*, *Steg*, *Trinn*, *Oppgave*, *Handling*, *Beskrivelse av aktivitet* |
| Role | *Ansvarlig*, *Ansvar*, *Utføres av*, *Rolle*, *Hvem*, *Utførende* |
| Phase | *Fase*, *Trinn* (when used for groups), *Del*, *Etappe*, section headings |
| Description | *Beskrivelse*, *Hvordan*, *Kommentar*, *Merknad* |
| Document | *Dokument*, *Skjema*, *Referanse*, *Vedlegg*, *Registrering*, *Dokumentasjon* |
| Decision | *Kriterier*, *Vilkår*, *Dersom*, a column that says *Ja / Nei* |
| Next step | *Neste*, *Går til*, *Videre til* (rare, but a gift: it is the connectors) |

### 5.3 Cue words

| Looking for | Cues |
|---|---|
| A decision | *dersom*, *hvis*, *ved* (as in *ved avvik*), *avhengig av*, *om nødvendig*, *etter behov*, *vurder om*, *kan*, *skal ... eller ...* |
| A hand-off | *sendes til*, *overleveres*, *meldes til*, *videresendes*, *legges fram for*, *godkjennes av*, *returneres til* |
| A document | *skjema*, *rapport*, *protokoll*, *bestilling*, *tilbud*, *kontrakt*, *følgeseddel*, *sjekkliste*, *referat* |
| A wait | *avventer*, *innen*, *frist*, *senest*, *etter at ... foreligger* |
| A sub-process | *iht.*, *i henhold til prosedyre*, *se rutine*, *behandles som*, *følger prosessen for* |
| Rework | *returneres*, *sendes tilbake*, *rettes*, *ny vurdering*, *avvist* |
| Start | *utløses av*, *starter når*, *ved mottak av*, *når ... foreligger* |
| End | *arkiveres*, *avsluttes*, *lukkes*, *prosessen er ferdig når* |

### 5.4 What a procedure says that the file cannot carry

Record these in the rationale §8 for authoring in Atlas afterwards; do not try to force
them into a title or a note.

- Who is *consulted* or *informed* (RACI beyond R).
- Governing documents and links on a step.
- Forms a step fills in (that is `/bo:checklist`).
- Status changes a step causes in BO (triggers).
- Deadlines and durations.
- KPIs, measurements, review cadence.
- ISO clause references.
- Revision history, approvals, document numbers.

---

## 6. Reading BPMN

Map deterministically. Report what did not map rather than inventing a place for it.

| BPMN element | Becomes |
|---|---|
| `participant` / pool | A lane, if it contains tasks. An empty (black-box) pool becomes an `offpage` annotation where message flows touch it. |
| `lane` | A lane. Nested lanes are flattened to the innermost. |
| `startEvent` | An `oval` step titled from its name or *Start*. |
| `endEvent` | An `oval` step. One per end event. |
| `task`, `userTask`, `manualTask` | A `rect` step (`manual` for `manualTask` only if the user wants it marked). |
| `serviceTask`, `scriptTask`, `businessRuleTask` | A `data` step. Note that the file cannot say it is automatic. |
| `sendTask`, `receiveTask` | A `rect` step with a dashed connector for the message. |
| `subProcess`, `callActivity` | A `subprocess` step plus an `offpage` note naming the called process. The inside of an embedded sub-process is **not** expanded; say so. |
| `exclusiveGateway` (XOR) | A `diamond`, titled from the gateway name or the question implied by the outgoing flow names. Each outgoing `sequenceFlow` name is the exit label. A gateway with no name and unlabelled flows is a question for the user. |
| `parallelGateway`, `inclusiveGateway` | **No equivalent.** Draw the branches as connectors from the preceding step to each branch and note in the rationale that the parallelism is not expressed. A joining gateway becomes connectors into the following step. |
| `eventBasedGateway`, intermediate events, boundary events, timers | **No equivalent.** A timer usually becomes a `delay` step; everything else is a note and a rationale entry. |
| `sequenceFlow` | A `solid` connector. `conditionExpression` or name becomes the label. |
| `messageFlow` | A `dashed` connector when both ends are steps in the file; otherwise an `offpage` note. |
| `association` + `textAnnotation` | A `note` annotation attached to the step. |
| `dataObject`, `dataStore` | The *producing* step becomes `document` or `store`; the object itself is not a step. A data object with no producer becomes a note. |
| `group` | Nothing. Possibly a phase candidate if the groups partition the flow left to right. |
| Phases | BPMN has none. Derive from milestones, group names, or the pool's left-to-right structure, and confirm with the user. |

Diagram interchange (`bpmndi:*` coordinates) is ignored. Atlas lays the diagram out.

---

## 7. Reading meeting notes, workshop output and transcripts

A transcript is not a procedure. People describe what they do, disagree about it, hedge,
and describe the exception as if it were the rule. The reading has three passes.

### 7.1 Pass one: actors

List every role or person who is said to *do* something. Collapse people to roles
(*Kari fra innkjøp* is *Innkjøper*). A participant who only asks questions is not a lane.

### 7.2 Pass two: steps, with their evidence

For each verb-with-object that a role performs, record the step, the role, and who said it.
Mark:

- **Hedges**: *jeg tror*, *vanligvis*, *som regel*, *det kommer an på*, *noen ganger*.
  Each is a question for phase 3, not a fact.
- **Disagreements**: two participants describing the same point differently. Record both
  versions; never pick one. The user decides.
- **Exceptions told as rules**: a story about one time something went wrong. Usually a
  rework path or a decision, not a mainline step.
- **Wishes**: *vi burde*, *egentlig skulle*. Not the as-is; offer them in phase 3 as
  recommendations.

### 7.3 Pass three: order and hand-offs

Transcripts rarely give order explicitly. Use *først*, *så*, *deretter*, *før*, *etter at*,
*når ... er ferdig*, and otherwise ask. Hand-offs are often said in passing (*så sender jeg
det videre til Ola*); each one is a lane boundary crossed.

### 7.4 What to say back

Summarise as roles, steps and open questions, with counts, and name the disagreements:

> "Fra notatene leser jeg 4 roller og 13 steg. To ting var dere ikke enige om: om leder
> godkjenner før eller etter bestillingen sendes, og om lager eller innkjøper melder avvik.
> Fire steg ble beskrevet med forbehold. Skal vi ta de uenighetene først?"

Transcripts name people and sometimes customers. Roles replace people in the diagram; say
so, and do not carry names into the rationale unless asked.

---

## 8. Reading an image of a drawing

Flowcharts on whiteboards, in PowerPoint, exported from Visio.

- Lane headers are usually the leftmost column or the top row; say which you assumed.
- Boxes are steps; diamonds are decisions; the shapes in the image map onto the ten in §1
  loosely, so default to `rect` and ask before marking a step `manual` or `prep`.
- Arrow direction is the connector direction. An arrow with text is a labelled connector.
- Say plainly what was illegible, and ask. Do not invent a title for a box you cannot read.
- Phases are often absent. Propose them from the columns or the hand-offs and confirm.
- A drawing and its accompanying text often disagree. Ask which is current.

---

## 9. Defect patterns to challenge

Seen in nearly every procedure and transcript. Each is a question in phase 3, not a verdict.

| Pattern | Looks like | Ask |
|---|---|---|
| **Step that is a decision** | *Vurder tilbudet*, *Kontroller leveransen*, with two outcomes implied | "Hva skjer hvis det ikke er i orden? Skal dette tegnes som et valg?" |
| **Decision with one exit** | A diamond, one line out | "Hva skjer på *nei*?" The answer is usually a rework loop. |
| **Ping-pong** | Innkjøper → Leder → Innkjøper → Leder | "Er det to ulike vurderinger hos leder, eller kan de slås sammen?" |
| **Lane with one step** | A role that appears once | "Gjør denne rollen noe mer, eller får de bare beskjed?" |
| **No rework path** | Every line points forward | "Hvor går arbeidet når det går galt?" |
| **Giant step** | *Motta, kontroller og registrer varen og meld avvik* | Three steps, or a `subprocess`. |
| **Document as step** | *Følgeseddel* as a box | The step is *Kontroller mot følgeseddel*; the document is a note or the shape. |
| **Phase that is a verb** | *Godkjenn* as a column | The phase is *Godkjenning*; *Godkjenn bestilling* is the step. |
| **Missing end** | A branch that stops | "Hva er prosessen ferdig med her?" |
| **Person as role** | *Kari* | The role. |
| **System as lane** | *ERP* as a swimlane with steps | Usually a `data` step in the lane of the person using it. |
| **"Alle"** | *Ansvarlig: alle* | "Hvem gjør det faktisk?" |
| **Site-specific residue** | A customer name, a date, a project number | Strip; a process is generic. |
| **The exception as the rule** | A story about the time the supplier failed | A rework path, labelled. |

---

## 10. Reading an Atlas export (continuation)

What the export tells you, and what to do with it.

| In the export | Meaning | Rule |
|---|---|---|
| Step `id` shaped like a UUID | A real stable id. The step has, or may have, triggers, links and work files in Atlas that the file does not show. | Keep it exactly. |
| Step `id` starting `unlinked:` | A step that had no stable id in Atlas; the export gave it a synthetic one so it can be referenced. Atlas adopts it back onto the same step. | Keep it exactly, including the `|`. |
| `position` on every step and annotation, `height` on every lane, `x` and `width` on every phase | A hand-arranged (`manual`) diagram, or an `auto` one that Atlas laid out for the export. | Keep the whole set only if nothing structural changes. Otherwise strip all of it. |
| `description` present | The step has one; absent means it has none. | Keep as is unless the user changes it. Clearing is `""`, not absence. |
| `exported_at` | When it was exported. | Drop it from the file you produce. |
| `process.category_id` | Which pyramide category the process sits in. | Keep it; it is harmless context. |
| A lane with no steps | Atlas allowed it. | Ask whether it is still wanted. |

What the export does **not** tell you, and must not be guessed at: whether a step has
triggers, links or work files; the RACI; ISO mappings; the process definition. All of it
survives a continuation that keeps the ids, and all of it is lost for a step that is
removed. Say that before the user removes one.
