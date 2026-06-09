# /bo:checklist Manual QA Log

> **Status:** Skeleton — to be filled in by manual testers running the
> `/bo:checklist` command from `feat/bo-checklist-command` branch in their
> Claude client.
>
> Each scenario below describes the steps to run and the expected behavior.
> Tester replaces `<placeholder>` text with actual observations and PASS/FAIL
> markers.

**Plugin source:** feat/bo-checklist-command @ `<commit-sha-when-tested>`
**Tested by:** `<tester name>`
**Test date:** `<YYYY-MM-DD>`
**Claude client:** `<Claude Code | Claude Desktop | Claude.ai web | other>`

---

## Scenario 1: Greenfield vernerunde (HSE walk)

### How to run

1. Install/update the bo plugin from the `feat/bo-checklist-command` branch.
2. Open a new Claude conversation.
3. Type `/bo:checklist`. Claude should respond with a purpose/domain question.
4. Reply with: `En vernerunde for kontorlokalene våre. Verneombud fyller den ut på mobil hver måned.`
5. Walk through phases 1–5. Answer Claude's questions naturally.
6. At end of session, copy the generated `.checklist.json` and validate against schema:
   ```bash
   echo '<paste JSON here>' > /tmp/vr-test.checklist.json
   npx -y -p ajv-cli@^5 ajv validate --strict=false \
     -s assets/checklist/checklist-schema-v1.json \
     -d /tmp/vr-test.checklist.json
   ```

### Expected behavior

| Phase | Expected | Observed | PASS/FAIL |
|---|---|---|---|
| 1 | Asks 1–3 follow-ups (mobile/PC, certs, frequency). Picks up internkontrollforskriften context, does NOT push ISO 9001. | `<observation>` | `<P/F>` |
| 2 | Open-ended capture questions. Does not pre-assign field types. | `<observation>` | `<P/F>` |
| 3 | Raises ≥1 challenge (free-text→choice, missing "Ikke vurdert", required calibration, or evidence/attachment). | `<observation>` | `<P/F>` |
| 4 | Builds sections + field types. Live artifact appears and updates ≥3 times. | `<observation>` | `<P/F>` |
| 5 | Schema check + compliance check + project-types fetched via MCP + both files generated. | `<observation>` | `<P/F>` |

### Output validation

- [ ] `.checklist.json` schema-valid (after `--strict=false`)
- [ ] File is a bare `{ "fields": [...] }` — no name/code/category/project-types inside
- [ ] Import guide section 1 has the paste-ready metadata table
- [ ] `choice` fields have a non-empty `values` array with an "Ikke vurdert"-style escape where sensible
- [ ] `order` values unique; `id`s sequential `Q1..Qn`

### Issues observed

`<list any deviations or rough edges; empty if perfect>`

### Tuning notes

`<things to adjust in commands/checklist.md based on this run>`

---

## Scenario 2: All-types coverage (internal audit)

### How to run

1. Type `/bo:checklist` in Claude.
2. Reply: `En internrevisjon mot ISO 9001. Revisor velger ansvarlige personer, krysser av hvilke kapitler som revideres, og laster opp bevis.`
3. Walk through the session, steering toward a form that uses people, multi-select, and uploads.

### Expected behavior

| Behavior | Expected | Observed | PASS/FAIL |
|---|---|---|---|
| peoplepicker | Proposes `peoplepicker` for revisor/ansvarlig instead of free text. | `<observation>` | `<P/F>` |
| multichoice | Uses `multichoice` for "hvilke kapitler" (multi-select). | `<observation>` | `<P/F>` |
| attachment | Uses standalone `attachment` field for evidence upload. | `<observation>` | `<P/F>` |
| number bounds | Any count field is `number` with sensible `min`/`max`. | `<observation>` | `<P/F>` |
| ISO 9001 9.2 | References internal-audit requirements (findings, evidence, conclusion, follow-up owner). | `<observation>` | `<P/F>` |

### Output validation

- [ ] `.checklist.json` schema-valid
- [ ] At least one each of `multichoice`, `attachment`, `peoplepicker` present
- [ ] No "allow multiple" flag emitted on attachment/peoplepicker/multichoice

### Issues observed

`<list>`

### Tuning notes

`<list>`

---

## Scenario 3: Governing-document link detection

### How to run

1. Type `/bo:checklist` in Claude.
2. During the session, give Claude a field that references a document via a link like:
   `https://contoso.sharepoint.com/sites/QHSE/GoverningDocumentLibrary/QSE-PRO-00012 Internrevisjon.pdf`
3. Also give an external link like `https://www.arbeidstilsynet.no/...`.

### Expected behavior

| Behavior | Expected | Observed | PASS/FAIL |
|---|---|---|---|
| Detection | Recognizes the GoverningDocumentLibrary URL as a governing document. | `<observation>` | `<P/F>` |
| Confirmation | Asks the user to confirm the document is still current / not outdated. | `<observation>` | `<P/F>` |
| Shape | Emits governing doc in `fileUrl` (url empty); external in `url` (fileUrl empty). | `<observation>` | `<P/F>` |

### Issues observed

`<list>`

### Tuning notes

`<list>`

---

## Scenario 4: Migration from an existing form

### How to run

1. Save a short paper-form-style checklist as `/tmp/form.txt` (or use a photo/Word/PDF/Excel).
2. In Claude, type `/bo:checklist` AND attach the file.
3. Walk through the migration flow.

### Expected behavior

| Step | Expected | Observed | PASS/FAIL |
|---|---|---|---|
| Detection | Detects migration mode from the attached file. | `<observation>` | `<P/F>` |
| Summary | Summarizes sections/questions, asks clarifying type questions. | `<observation>` | `<P/F>` |
| Skip phase 2 | Goes directly to phase 3 (challenge). | `<observation>` | `<P/F>` |
| Type upgrades | Challenges free-text fields that should be choice/number/peoplepicker. | `<observation>` | `<P/F>` |
| Source trail | Import guide section 7 lists source→field mapping. | `<observation>` | `<P/F>` |

### Output validation

- [ ] `.checklist.json` schema-valid
- [ ] Import guide section 7 (Source trail) populated

### Issues observed

`<list>`

### Tuning notes

`<list>`

---

## Overall PASS/FAIL summary

- Scenario 1: `<P/F>`
- Scenario 2: `<P/F>`
- Scenario 3: `<P/F>`
- Scenario 4: `<P/F>`

**Ready to merge to master:** `<yes/no — only if all 4 are PASS>`
