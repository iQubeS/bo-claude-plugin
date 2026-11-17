# Vocabulary lexicon — reading source material into the three writable lists

Companion to `commands/vocabulary.md`. This is the domain knowledge: which list a
Norwegian word belongs to, what a well-formed entry in each list looks like, how keys are
minted, and what a legal register or a control catalogue carries that the format cannot.

The shapes below are generalised from real tenant exports. **No real company's entries are
reproduced here.**

---

## 1. Which list does a word belong to?

The three writable lists answer three different questions. Sort every source term by the
question it answers before anything else.

| The source says | It answers | List |
|---|---|---|
| Farekilde, fareklasse, risikokilde, risikokategori, "type fare", "hva kan gå galt (kategori)" | *What kind of hazard is this?* | `riskSources` |
| Tiltak, barriere, kontroll, sikringstiltak, risikoreduserende tiltak, "eksisterende tiltak", "forebyggende/skadebegrensende" | *What control reduces it?* | `barrierLibrary` |
| Lov, forskrift, krav, myndighetskrav, lovkrav, kontraktskrav, tillatelse, konsesjon, sertifisering, "samsvarsregister", "lovregister" | *What must we comply with?* | `complianceObligations` |

Words that look like vocabulary and belong to **none** of the three — tell the user, do
not file them anywhere:

| The source says | What it actually is | Where it lives |
|---|---|---|
| Hvem rammes, eksponert, skadelidende (Personell, Miljø, Utstyr…) | An exposure target | Export-only list; maintained by hand in BO |
| Hyppighet, eksponeringsfrekvens (Daglig, Per jobb…) | A frequency level | Export-only |
| Effektkategori, konsekvenstype (Helse, Miljø, Økonomi…) | An effect category | Not a vocabulary at all; matrix configuration |
| Uønsket hendelse, "Person faller fra stillas" | An *event*, belongs on a risk | `/bo:risk`, not here |
| Sannsynlighet, konsekvens, risikoverdi | A score | `/bo:risk`, and never the value |
| "Er på plass", "Verifisert av", "Sist kontrollert" | Execution evidence on a control | Recorded on the project, never in a library |

---

## 2. Risk sources — the portfolio grouping

A risk source is the **category** a risk is filed under so the portfolio can be read by
hazard: "every electrical risk across all projects". It is not an event and not a cause.

**Granularity.** A tenant that works well has somewhere between a dozen and forty. Fewer
than that and "Other" swallows half the register; more and two people file the same risk
under different words. Signals a proposed source is at the wrong grain:

- It names an *event* ("Fall fra stillas") rather than a kind of hazard ("Arbeid i
  høyden"). An event belongs on a risk.
- It names a *place* or *activity* ("Verkstedet", "Montasje") rather than what can harm.
- Two proposals would always be filed together ("Støy" and "Støy fra maskiner").

**Shape of an entry.**

| Field | Write |
|---|---|
| `key` | Minted from the English name — see §5. |
| `name` | English, short noun phrase, sentence case: `Working at height`, `Chemical exposure`. The existing lists are English, and `/bo:risk` resolves against this name. |
| `nameNb` | The Norwegian name the company actually uses. **Always supply it on a new entry.** It is what makes a Norwegian hazard term resolve in `/bo:risk` without translation. |
| `active` | Omit; it defaults to true. |
| `sortOrder` | Omit. The import does not reorder. |

**The nameNb backfill.** Most tenants' risk sources were seeded in English with no
`nameNb` at all, which is why `/bo:risk` has to translate every Norwegian hazard term by
hand. A file of sparse rows `{ key, name, nameNb }` for every existing source fixes that
permanently. The `name` is repeated verbatim from the export because it is required on
every row; only `nameNb` changes.

---

## 3. Barrier library — one control, one sentence

A barrier-library entry is the **canonical statement of a control**. Its `description` is
the sentence that lands on every risk that references it, so the actions view can group
one control across risks and projects. That is why the description is required and why a
risk never carries its own wording.

**Anatomy of a good entry**, generalised from tenants that use the library well:

| Field | What goes there | Smell |
|---|---|---|
| `name` | A noun phrase naming the control: `Permit to work`, `Physical guarding`, `Verified competence`. | A sentence; a status ("Permit in place"); a bundle ("Guarding, interlocks and training"). |
| `nameNb` | The Norwegian name as the crew says it: `Arbeidstillatelse`, `Fysisk skjerming`. | Omitted. Supply it on every new entry. |
| `description` | One sentence, present tense, stating what the control *is* and what it achieves: *"Work carried out under a permit to work with the stated precautions in force."* | Past tense ("was installed"); a claim it is in place; several controls in one sentence; site names. |
| `suggestedType` | Where it sits on the hierarchy. See the ladder below. | PPE filed as Technical; a procedure filed as Elimination. |
| `suggestedFunction` | `Preventing` stops the event; `Mitigating` limits the harm once it happens; `Both` does both. | Omitted when the control clearly does one or the other. |
| `performanceRequirement` | The **verifiable** criterion: what must be true, and how often it is checked. *"Issued and signed before the work starts, and closed when the area is handed back."* | A restatement of the description; a wish ("should be good"). |
| `verificationIntervalDays` | How often the requirement is checked, in whole days. Typical values: 90, 180, 365. Null when there is no periodic check. | 0; "quarterly" as text; fractions. |
| `documentReference` | The company's governing-document code for the procedure or policy the control comes from: `HMS-PRO-012`. | A URL; a person; a date. |

**The hierarchy ladder** (`suggestedType`), highest first. Only the first three can later
justify a severity reduction on a risk, which is why the type matters:

| Type | Norwegian | What it means | Example |
|---|---|---|---|
| `Elimination` | Eliminering | The hazard is removed | Remote operation; decommission the equipment |
| `Substitution` | Substitusjon | Something less hazardous replaces it | Lower-hazard substance; meet remotely instead of travelling |
| `Technical` | Teknisk | Engineering controls that work without a person remembering | Guarding; interlock; gas detection; multi-factor authentication |
| `Organisational` | Organisatorisk | Procedures, permits, competence, supervision | Permit to work; toolbox talk; induction; management review |
| `Ppe` | Personlig verneutstyr | Worn by the person | Hearing protection; respiratory protection |

**From a Tiltak column to library entries.** A control catalogue or the `Tiltak` column of
a register is usually several controls per cell, half of them restatements. Work by
distinct control, not by row:

1. Split each cell into candidate controls.
2. Collapse restatements ("bruk hørselvern" and "hørselvern skal benyttes" are one control).
3. Drop evidence and status ("er på plass", "verifisert 2024") — the library holds what the
   control is, never whether it is installed.
4. Match the remainder against the export by meaning. Reuse an existing key wherever the
   meaning is the same, even when the wording differs.
5. Propose a new entry only for a control the library genuinely lacks, with every field in
   the table above filled.

**Propose sparingly.** A library of forty entries is used; a library of four hundred is
ignored and everybody picks the first thing that fits.

---

## 4. Compliance obligations — the legal register

A compliance obligation is a **named requirement the company has decided applies to it**:
an act, a regulation, a permit, a contract clause, a standard it is certified to. Listing
one records that the obligation applies. It is not a claim that the company complies with
it, and the format carries no compliance status, owner or review date.

**`obligationType` decision table:**

| Type | Norwegian | When | Example |
|---|---|---|---|
| `Legal` | Lov/forskrift | Statute or regulation that binds the company by law | Arbeidsmiljøloven; Internkontrollforskriften; GDPR |
| `Permit` | Tillatelse/sertifikat | A licence, permit, certificate or approval the company must hold to do the work | Hot-work certificate; discharge permit; electrical contractor registration |
| `Contractual` | Kontraktskrav | A requirement a customer, insurer or partner imposes by agreement | Customer HSE requirements on site; data processing agreements |
| `Voluntary` | Frivillig | Standards and commitments the company has chosen | ISO 45001 certification; industry codes; the company's own policy |

**`reference` formats.** Write the identifier the source uses, in the form a reader can
look up:

| Source | Form | Example |
|---|---|---|
| Norwegian act (Lovdata) | `LOV-yyyy-mm-dd-n` | `LOV-2005-06-17-62` |
| Norwegian regulation (Lovdata) | `FOR-yyyy-mm-dd-n` | `FOR-1996-12-06-1127` |
| EU regulation | `(EU) yyyy/n` | `(EU) 2016/679` |
| Standard | Designation and year | `ISO 45001:2018` |
| Contract or policy | The company's own document code or a plain reference | `Frame agreement, appendix C` |

**Never invent a Lovdata identifier.** Write a `reference` only when it is in the user's
material or the user confirms it in the session. If neither, omit the field and list the
obligation under "references to confirm" in the rationale. A wrong identifier in a legal
register is worse than a blank one, because it looks authoritative.

Well-known Norwegian HSE instruments, with identifiers the user can confirm against
Lovdata (two of these are also confirmed by a real tenant export):

| Norwegian name | English `name` | Identifier |
|---|---|---|
| Arbeidsmiljøloven | Working Environment Act | LOV-2005-06-17-62 |
| Internkontrollforskriften | Internal Control Regulations | FOR-1996-12-06-1127 |
| Forskrift om organisering, ledelse og medvirkning | Regulations on organisation, management and worker participation | FOR-2011-12-06-1355 |
| Arbeidsplassforskriften | Workplace Regulations | FOR-2011-12-06-1356 |
| Forskrift om utførelse av arbeid | Regulations concerning the performance of work | FOR-2011-12-06-1357 |
| Forskrift om tiltaks- og grenseverdier | Regulations on action and limit values | FOR-2011-12-06-1358 |
| Produsentforskriften | Producer Regulations | FOR-2011-12-06-1359 |
| Byggherreforskriften | Client Regulations (construction) | FOR-2009-08-03-1028 |
| Brann- og eksplosjonsvernloven | Fire and Explosion Prevention Act | LOV-2002-06-14-20 |
| Forskrift om brannforebygging | Fire Prevention Regulations | FOR-2015-12-17-1710 |
| Forurensningsloven | Pollution Control Act | LOV-1981-03-13-6 |
| Avfallsforskriften | Waste Regulations | FOR-2004-06-01-930 |
| Personopplysningsloven | Personal Data Act | LOV-2018-06-15-38 |

**`jurisdiction`** is free text: `Norway`, `EU and EEA`, `Customer contracts`,
`Company-wide`, or the site or country a permit is tied to.

**Reading a Norwegian legal register (lovregister / samsvarsregister).** The usual
columns, and what crosses:

| Column | Crosses as | Note |
|---|---|---|
| Lov / forskrift / krav | `name` (English) + `nameNb` | Translate the title; keep the Norwegian verbatim. |
| Referanse / Lovdata-lenke / Paragraf | `reference` | Paragraph numbers go in `reference` after the identifier if the user wants them. |
| Type (lov, forskrift, kontrakt, standard) | `obligationType` | Map with the table above. |
| Gjelder for / Virkeområde | `jurisdiction` | |
| Relevans / Hvordan berører det oss | — | Does not cross. Goes in the rationale. |
| Ansvarlig / Eier | — | Does not cross. |
| Sist vurdert / Neste gjennomgang | — | Does not cross. Review cadence is a barrier (a `Compliance obligation register` control), not an obligation field. |
| Status / Etterlevd | — | Does not cross. The format records applicability, never compliance. |

---

## 5. Keys — minted once, never changed

The key is the entry's identity. The import matches on `(kind, key)` and nothing else: not
name, not position, not SharePoint id.

**Minting a key for a new entry:**

```
key = name (English).toLowerCase()
        .replace(non [a-z0-9] runs with '-')
        .trim leading/trailing '-'
```

- Short enough to read: `working-at-height`, not
  `working-at-height-on-scaffolds-ladders-and-roofs`. Detail belongs in the name.
- Never from the Norwegian name, and never containing æ, ø, å or spaces.
- Never changed afterwards. On a real tenant `patching-and-hardening` is now named
  "Cloud security posture management" and `endpoint-and-mail-protection` is "Endpoint
  anti-virus protection": names moved, keys stayed, and the risks that reference them kept
  working. A key that encodes today's wording is a key that will lie later.

**Updating an existing entry:** copy the key from the export exactly. Never re-mint it
from the current name — the two have usually drifted.

**Collisions:** a key already in the export, active or inactive, is an *update* of that
row, never a second create. A new row whose `name` already exists under another key draws
a warning and is left unselected in the preview; decide whether it is the same meaning
(reuse the key) or a different one (change the name so the difference is visible).

---

## 6. Reading the export

Before proposing anything, read the tenant's `Export all vocabularies` file back to the
user. What to look for:

| Signal | Meaning | Consequence |
|---|---|---|
| `source: "seed"` on `riskSources` or `barrierLibrary` | The tenant still runs on package defaults for that list | The import will refuse to write it. The administrator must run the population step in BO first, export again, then import. |
| `source: "stored"` with `entries: []` on `complianceObligations` | Empty but real | Writable as it is. |
| `active: false` rows | Retired entries | A proposal with the same key is a reactivation, not a create. Say so. |
| No `nameNb` on any risk source or barrier | English-only lists | Offer the backfill (§2). |
| `sortOrder` missing on some rows | Rows added through the editor or reconciliation | Irrelevant to the import; never "fix" it. |
| Long `performanceRequirement` texts with "Note that …" | The company records caveats in the requirement | Keep the house style when proposing new entries. |

Counts per list, inactive counts, and seed/stored per list all go in the rationale under
"Destination as read".
