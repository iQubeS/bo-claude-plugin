# /bo:qcp Manual QA Log

> **Status:** Skeleton — to be filled in by manual testers running the
> `/bo:qcp` command from `feat/bo-qcp-command` branch in their Claude client.
>
> Each scenario below describes the steps to run and the expected behavior.
> Tester replaces `<placeholder>` text with actual observations and PASS/FAIL
> markers.

**Plugin source:** feat/bo-qcp-command @ `<commit-sha-when-tested>`
**Tested by:** `<tester name>`
**Test date:** `<YYYY-MM-DD>`
**Claude client:** `<Claude Code | Claude Desktop | Claude.ai web | other>`

---

## Scenario 1: Greenfield HR onboarding

### How to run

1. Install/update the bo plugin from the `feat/bo-qcp-command` branch.
2. Open a new Claude conversation.
3. Type `/bo:qcp`. Claude should respond with a domain-first question.
4. Reply with: `HR-onboarding for nye fast-ansatte i en mellomstor IT-bedrift.`
5. Walk through phases 1–5. Answer Claude's questions naturally.
6. At end of session, copy the generated `.qcp.json` and validate against schema:
   ```bash
   echo '<paste JSON here>' > /tmp/hr-test.qcp.json
   npx -y -p ajv-cli@^5 ajv validate --strict=false \
     -s assets/qcp/qcp-schema-v1.json \
     -d /tmp/hr-test.qcp.json
   ```

### Expected behavior

| Phase | Expected | Observed | PASS/FAIL |
|---|---|---|---|
| 1 | Asks 1–3 follow-ups (certs / GDPR / sector). Does NOT bring up ISO 9001 unprompted (HR domain). | `<observation>` | `<P/F>` |
| 2 | Open-ended as-is questions. Does not pre-structure. | `<observation>` | `<P/F>` |
| 3 | Raises ≥1 challenge (cargo-cult or missing GDPR step). | `<observation>` | `<P/F>` |
| 4 | Builds structure. Live artifact appears and updates ≥3 times. | `<observation>` | `<P/F>` |
| 5 | Schema check + GDPR compliance check + both files generated. | `<observation>` | `<P/F>` |

### Output validation

- [ ] `.qcp.json` schema-valid (after `--strict=false`)
- [ ] Rationale doc has all 7 sections
- [ ] Title slug matches expectation
- [ ] No ISO 9001 references in output (HR domain — should be GDPR-focused)

### Issues observed

`<list any deviations or rough edges; empty if perfect>`

### Tuning notes

`<things to adjust in commands/qcp.md based on this run>`

---

## Scenario 2: Migration from BPMN file

### How to run

1. Save this minimal BPMN as `/tmp/test-procurement.bpmn`:

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
                     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                     targetNamespace="http://test/procurement">
     <bpmn:process id="Process_Procurement" isExecutable="false">
       <bpmn:startEvent id="StartEvent_1" name="Need identified" />
       <bpmn:task id="Task_1" name="Verify supplier company" />
       <bpmn:task id="Task_2" name="Anti-corruption screening" />
       <bpmn:task id="Task_3" name="Sign frame agreement" />
       <bpmn:task id="Task_4" name="Manual director signature" />
       <bpmn:endEvent id="EndEvent_1" name="Supplier active" />
       <bpmn:sequenceFlow sourceRef="StartEvent_1" targetRef="Task_1" />
       <bpmn:sequenceFlow sourceRef="Task_1" targetRef="Task_2" />
       <bpmn:sequenceFlow sourceRef="Task_2" targetRef="Task_3" />
       <bpmn:sequenceFlow sourceRef="Task_3" targetRef="Task_4" />
       <bpmn:sequenceFlow sourceRef="Task_4" targetRef="EndEvent_1" />
     </bpmn:process>
   </bpmn:definitions>
   ```

2. In Claude, type `/bo:qcp` AND attach `/tmp/test-procurement.bpmn`.
3. Walk through the migration flow.

### Expected behavior

| Step | Expected | Observed | PASS/FAIL |
|---|---|---|---|
| Detection | Claude detects migration mode from attached file. | `<observation>` | `<P/F>` |
| Summary | Summarizes 4 tasks from BPMN, asks clarifying Q's. | `<observation>` | `<P/F>` |
| Skip phase 2 | Goes directly to phase 3 (challenge). | `<observation>` | `<P/F>` |
| Challenge | Challenges "Manual director signature" as automation candidate. | `<observation>` | `<P/F>` |
| Domain | Picks up procurement → ISO 9001 8.4 references. | `<observation>` | `<P/F>` |
| Add step | Adds at least 1 step NOT in BPMN (e.g. periodic re-eval per ISO 9001 8.4.2). | `<observation>` | `<P/F>` |
| Source trail | Rationale section 7 lists BPMN source mapping. | `<observation>` | `<P/F>` |

### Output validation

- [ ] `.qcp.json` schema-valid
- [ ] Rationale section 7 (Source trail) populated
- [ ] At least 1 step added beyond source (with ISO citation)

### Issues observed

`<list>`

### Tuning notes

`<list>`

---

## Scenario 3: Cargo-cult challenge

### How to run

1. Type `/bo:qcp` in Claude.
2. When Claude asks for the domain, paste:

   ```
   Vi har en intern ukentlig rapportering. Hver fredag sender HR-avdelingen en
   rapport til ledergruppen. Den inneholder antall sykefraværsdager, antall
   nye ansatte, og antall avgang. Rapporten har samme format som vi har
   brukt i 8 år. Ingen i ledergruppen leser den lenger fordi tallene også står
   i månedsrapporten. Men vi sender den fortsatt fordi vi alltid har gjort det.

   Vi vil ha en QCP for denne prosessen.
   ```

   This is a textbook cargo-cult: process exists, no one uses output,
   perpetuated by inertia.

3. Observe Claude's response and decide what to do (insist on building it
   anyway, or accept abandonment recommendation).

### Expected behavior

| Behavior | Expected | Observed | PASS/FAIL |
|---|---|---|---|
| Recognition | Claude recognizes user's own admission of cargo-cult. | `<observation>` | `<P/F>` |
| Direct question | Asks whether to design or recommend abandon. | `<observation>` | `<P/F>` |
| If insist | If user insists, captures concern in rationale §6. | `<observation>` | `<P/F>` |
| Anti-cargo-cult | Does NOT silently institutionalize the process. | `<observation>` | `<P/F>` |

### Issues observed

`<list>`

### Tuning notes

`<list>`

---

## Overall PASS/FAIL summary

- Scenario 1: `<P/F>`
- Scenario 2: `<P/F>`
- Scenario 3: `<P/F>`

**Ready to merge to master:** `<yes/no — only if all 3 are PASS>`
