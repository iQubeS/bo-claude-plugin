# Reading a Norwegian risk-assessment spreadsheet

Reference for `/bo:risk` migration mode: how to recognise what is in a customer's
workbook, what crosses into the RA template format, and what does not.

**This file exists because no example workbook ships with the plugin.** Customer risk
registers are not ours to redistribute, so the knowledge lives here as a written
reference instead of as a fixture. That is arguably the better trade: one example teaches
one company's habits, a lexicon generalises.

Nothing here is authoritative about a *tenant*. Every vocabulary term must still be
checked against that tenant's own `Copy vocabulary` manifest — this document says what a
Norwegian phrase probably *means*, never what the destination will accept.

---

## 1. Reading the workbook

### Classify every sheet before parsing any of them

Real registers are rarely one clean table. Expect some mixture of:

| Sheet type | How to spot it | What to do with it |
|---|---|---|
| **Register** | Wide table, one row per risk, score columns | The source. There may be several. |
| **Scale / matrise / skala** | Small table of 1..N with descriptive text | **The most valuable sheet in the file.** It is what makes calibration possible instead of guesswork. Read it first. |
| **Legend / forklaring / veiledning** | Colour key, instructions, revision history | Read for the scale definitions; ignore the colours (§5). |
| **Per-department or per-project copies** | Same columns, different sheet name | Ask which is current. Duplicated rows across sheets are common and should be merged, not imported twice. |
| **Stale / hidden / "gammel"** | Hidden sheet, name with a date or "v2" | Ask before using. Usually skip. |

Say what you found and ask, before parsing hundreds of rows:

> "Arbeidsboken har fem ark. Jeg leser «Risikoregister» som selve registeret og «Skala»
> som skalaen deres. «Register 2023» ser ut som en eldre versjon — skal den utelates?"

### Header row

The header is often not row 1. Look for the first row where three or more cells match
the lexicon in §2. Above it usually sit a title, a logo row, a revision block, and
sometimes a merged banner.

### Merged cells

The single most common structural feature. An `Aktivitet` cell merged down five rows
means those five risks belong to that activity. In most parsers only the top-left cell
carries the value and the rest read empty — **carry the last non-empty value forward**
rather than treating blank as "no activity".

The same pattern appears on `Farekilde` and occasionally on `Årsak`.

### Volume

A register of 200+ rows is normal. Do not interrogate it row by row. Parse mechanically,
then challenge **by activity** (§7), and offer to split into several templates if the
workbook spans genuinely different kinds of work.

---

## 2. Column lexicon

Header wording varies; meaning does not. Match on meaning, confirm the mapping with the
user before parsing.

### Columns that cross into the format

| Norwegian header variants | Field | Notes |
|---|---|---|
| Aktivitet, Arbeidsoperasjon, Operasjon, Arbeidsoppgave, Fase, Delprosess, Trinn | `activities[].name` | Grouping key. Merged cells, see above. |
| Beskrivelse av aktivitet, Omfang | `activities[].description` | Often absent. |
| Uønsket hendelse, Hendelse, Farlig forhold, Risiko, Hva kan gå galt, Beskrivelse av risiko | `risks[].event` | **The only required field.** |
| Årsak, Mulig årsak, Utløsende årsak, Bakenforliggende årsak | `risks[].cause` | |
| Konsekvens, Mulig konsekvens, Virkning, Effekt | `risks[].consequence` | If the sheet has one column *per* consequence dimension, those are score columns, not this. |
| Farekilde, Fare, Fareforhold, Risikokilde, Kategori fare | `risks[].riskSource` | Must resolve against the manifest — see §4. |
| Utsatt for, Hvem/hva rammes, Berørt, Eksponert, Rammer | `risks[].exposureTarget` | Norwegian resolves here if the tenant supplied `nameNb`. |
| Verneutstyr, PVU, Personlig verneutstyr, Påkrevd verneutstyr | `risks[].minimumPpe` | Belongs to the **event**, not the job: a chemical release and the noise beside it need different protection. |
| S, K, Sannsynlighet, Konsekvensgrad, Alvorlighet, Frekvens | `inherentScores[]` | See §3 and §5. |

### Columns that do not cross

| Norwegian header variants | Why not | What to do instead |
|---|---|---|
| Nr, ID, Løpenummer, Ref | The format carries no identifiers; array order *is* the ordering, and the tool derives its own numbering. | Drop. Mention the count so nobody thinks rows went missing. |
| Risikotall, Risikoverdi, RPN, R, S×K, Produkt | Derived from the score pair by the tool. | Drop. Use it only as a cross-check that you read S and K the right way round. |
| Tiltak, Barriere, Eksisterende tiltak, Risikoreduserende tiltak, Foreslåtte tiltak, Kompenserende tiltak | Barriers are deliberately not importable: a template's value is the hazard identification, and barriers are what the importing company decides to do about it. | **Rescue, do not discard.** Carry the text into the rationale document as an appendix table so it can be re-entered as barriers in the tool. Never fold it into `cause` or `consequence`. |
| Restrisiko, Risiko etter tiltak, S etter, K etter, Akseptabel restrisiko | A residual needs a recorded barrier to justify it, and barriers are not imported, so every imported residual would arrive unjustified. The format cannot express one at all. | Drop, and read §6 — their presence changes what the *inherent* scores mean. |
| Ansvarlig, Ansvar, Utført av, Frist, Dato (DD.MM.YYYY), Status, Oppfølging | A template is generic; these belong to a project instance. | Drop. Worth naming out loud — managers expect them to survive. |
| Kommentar, Merknad | No field. | Usually drop; occasionally the text is really a `cause` in the wrong column. Read before dropping. |
| Fargekoder, akseptkriterium, "uakseptabelt" | This is the acceptance limit. | Refuse. See §5. |

---

## 3. Consequence dimensions to effect categories

A register scores either one generic consequence or several dimensions side by side.
Multiple dimension columns become multiple `inherentScores[]` entries on the same risk.

| Norwegian dimension | Usual effect category | Also seen as |
|---|---|---|
| Menneske, Person, Liv og helse, HMS, Personskade | Health | M, P, H |
| Ytre miljø, Miljø, Natur, Utslipp | Environment | Ø, YM, E |
| Materielle verdier, Materiell, Økonomi, Kostnad, Produksjonstap, Driftstap | Finance | Ma, M, Ø, K |
| Omdømme, Renommé, Tillit, Media | Reputation | O, R |
| Mulighet, Gevinst, Oppside | Opportunity | rare in an RA |

> **The single-letter headers are ambiguous and collide.** `M` is Menneske in one
> workbook and Materiell in the next; `Ø` is Ytre miljø here and Økonomi there. Never
> resolve a single letter from the letter alone — read the scale sheet, or ask.

**Do not confuse the two axes.** `effectCategory` is what *kind of harm* is being scored;
`exposureTarget` is *what or who* is harmed. Damage to a machine is usually
`effectCategory: Finance` with `exposureTarget: Equipment`.

When the register has a single unlabelled consequence column, infer the category from the
consequence text and confirm it — do not default everything to Health.

---

## 4. Vocabulary: Norwegian source term to manifest concept

**The importer's suggester cannot translate.** Its suggestions come from a Dice
coefficient over character bigrams, which measures spelling similarity: `Crushing /
trapping` → `Crushing and trapping` scores 0.84 and is offered, but `Klemfare` scores
0.13 against the same entry and nothing is offered at all. For a Norwegian register the
manager is typically shown a list of unresolved words with no help attached.

So translation is the command's job, in Phase 3, and it must be done deliberately.

### Method

1. Read the tenant's manifest — it is the only list of acceptable words.
2. For each distinct source term, find the manifest entry whose **meaning** matches.
3. Write the manifest's `name` or `key`, never the Norwegian source term.
4. If nothing in the manifest genuinely fits: use the closest honest word, leave it
   blank, or ask the manager to add it to the company vocabulary first. Do not invent.
5. Verify with `scripts/check-ra-vocabulary.mjs` before delivering.

### Hazard concepts commonly found in Norwegian registers

Match these *concepts* against whatever the tenant's manifest actually holds. This is a
translation aid, not a list of writable values — a tenant with six risk sources will not
have most of these.

| Norwegian | Concept |
|---|---|
| Fallende gjenstander, fallende last, lastforskyvning | Falling or shifting load |
| Klemfare, klem- og knusningsfare, inneklemming | Crushing and trapping |
| Fall til lavere nivå, arbeid i høyden, fallulykke | Fall from height |
| Elektrisitet, strømgjennomgang, spenning, lysbue | Electrical |
| Lagret energi, trykk, hydraulikk, pneumatikk, fjærspenning | Stored and residual energy |
| Kjemikalier, farlige stoffer, kjemisk eksponering, gass | Chemical exposure |
| Støv, asbest, kvartsstøv, sveiserøyk | Airborne contaminants |
| Brann, eksplosjon, varmt arbeid, antennelse | Fire and explosion |
| Ergonomi, manuell håndtering, tunge løft, gjentakende arbeid | Ergonomics and manual handling |
| Støy, vibrasjon, hånd- og armvibrasjon | Noise / Vibration |
| Løfteoperasjoner, kran, løfteutstyr, anhuking | Lifting operations |
| Kjøretøy, trafikk, anleggsmaskiner, truck, samhandling maskin/person | Vehicles and traffic |
| Gravearbeid, utgraving, ras, grøft | Excavation and ground collapse |
| Trange rom, lukket rom, oksygenmangel | Confined space |
| Biologisk, smitte, legionella | Biological |
| Stråling, ioniserende, laser, UV | Radiation |
| Vær, vind, is, glatt underlag, mørke | Weather and environment |
| Vold og trusler, psykososialt, alenearbeid | Psychosocial |
| Dokumentasjon, overlevering, sporbarhet, feil revisjon | Documentation and handover |
| Uvedkommende, sabotasje, adgangskontroll | Security |

### Exposure targets

| Norwegian | Concept |
|---|---|
| Personell, ansatte, medarbeidere, mannskap, operatør | Personnel |
| Tredjepart, publikum, naboer, besøkende, kunde på stedet | Third party |
| Ytre miljø, miljø, natur, grunn, vassdrag | Environment |
| Utstyr, materiell, anlegg, maskin, bygning | Equipment |
| Tjenesteleveranse, leveranse, kontrakt, framdrift | Service delivery |

Exposure targets frequently carry `nameNb` in the manifest, so the Norwegian word may
resolve directly. Risk sources on the reference tenant carry none, so they never do.
Check the manifest rather than assuming either way.

---

## 5. Scales, and the line you must not read

### Recognise the shape first

| Shape | Signal | Consequence for calibration |
|---|---|---|
| 1–5 both axes | Values 1..5, scale sheet with five rows | Still not a straight copy — match on descriptor, not on number. |
| 1–4, 1–3 | Values top out below 5 | **Matrix mismatch.** Flag it explicitly. |
| Letters (A–E, S/M/L) | Non-numeric score cells | Needs a full mapping table. |
| Words (Liten/Middels/Stor) | Text in score cells | Map the words to labels via descriptors. |
| Colour only | Score cells are filled, empty of text | The score exists only as a colour. Ask; do not read the fill. |

### Calibrate on meaning, never on position

A source `4` is not a destination `4`. Their scale sheet says what their `4` *means*; the
manifest's `descriptor` says what each destination rung means. Match those two texts, then
write the destination **label**.

A 1–4 source into a 5-level ladder has no faithful arithmetic conversion, and upstream is
explicit that this mapping is a professional judgement belonging to a person. Build the
table, have the user approve it row by row, then apply it mechanically.

An out-of-range level is refused at import, never clamped — a `6` on a 5X5 matrix drops
that score rather than quietly becoming a `5`.

### The acceptance limit is in their file, and must stay out of yours

Their workbook almost certainly shows where the line falls: a red band on the matrix, an
"uakseptabelt" threshold, a conditional format that turns a cell green.

The destination format withholds that line deliberately. An author who can see where it
sits is tempted to score just underneath it, which corrupts the register to keep a screen
green; an author who cannot see it scores the hazard.

**So read the scale descriptors and ignore the colours.** Do not reconstruct the
threshold, do not mention where it appears to fall, and do not let it influence a single
score. This is the one rule that a helpful reading of the source will break by accident.

---

## 6. Are their scores actually inherent?

The format carries **inherent** scores only — the hazard before any controls.

Most registers do not work that way. If an "Eksisterende tiltak" column sits beside the
score, the score almost certainly reflects the risk *as currently controlled*, which is a
residual wearing the wrong label. Importing it as inherent quietly corrupts every
comparison made afterwards.

Signals that the scores are really residual:

- A `Tiltak` or `Eksisterende tiltak` column to the left of the score columns.
- Both a "før tiltak" and an "etter tiltak" score pair — then the *first* pair is your
  inherent score and the second is refused.
- Consequence text that already assumes protection ("ingen skade ved bruk av verneutstyr").
- Scores implausibly low for the described event.

Raise it; do not resolve it silently. Three defensible answers:

1. Re-score the hazard as pre-control, together, activity by activity.
2. Import as-is, recording in the rationale document that the scores are optimistic.
3. Omit scores entirely and let assessors score in the tool.

---

## 7. Content defects to expect

Legacy registers fail in predictable ways. Challenge by activity, not row by row.

| Pattern | Example | Fix |
|---|---|---|
| Event is a hazard category, not an event | "Fallende gjenstander", "Arbeid i høyden" | That is a `riskSource` or an activity. Ask what actually happens: "Verktøy faller fra stillasplattform ned på gangvei". |
| Consequence says nothing | "Personskade", "Skade" | To whom, how badly? "Hodeskade på forbipasserende under stillaset". |
| Cause is a judgement, not a cause | "Uaktsomhet", "Manglende fokus", "Brudd på rutine" | Why does it happen *here*? "Sparkelist mangler i to felt". |
| One row covering several events | "Fall, klem og kutt ved montasje" | Split. One risk is one unwanted event. |
| Duplicates across sheets | Same event on two department tabs | Merge, and say how many rows collapsed. |
| Gaps in the job sequence | Transport and commissioning present, mobilisation and demobilisation missing | The gaps between activities are where assessments are weakest. Walk the job start to finish. |
| PPE recorded once for the whole assessment | A single "Verneutstyr: hjelm, vernesko" header row | PPE belongs per event. Distribute it, and ask where it genuinely differs. |

---

## 8. Before delivering

- Every vocabulary term resolves — verify, do not assume:
  `node scripts/check-ra-vocabulary.mjs <file>.ra.json <manifest>.json`
- Structure validates against `ra-template-import.schema-v1.json`. Any structural fault
  refuses the whole file, so this is not optional.
- Every dropped column is named in the rationale document, with its reason.
- Rescued barrier text is carried across as an appendix.
- The two behaviours that surprise everyone once are stated: the template arrives
  **Draft and unlocked** and cannot be copied into a project until locked, and import
  always **creates** a new template rather than merging into an existing one.
