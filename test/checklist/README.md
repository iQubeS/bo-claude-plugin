# Checklist test fixtures

Manual-testing assets for the `/bo:checklist` command. **Not part of the
plugin runtime** — the plugin only loads `commands/`, `skills/`, `agents/`,
and `.claude-plugin/`. These files exist so you can validate that the JSON the
command produces conforms to the schema across every field-type and
optional-property combination.

## `all-field-types.checklist.json`

A single checklist exercising the full surface of `checklist-schema-v1.json`:

- **All 9 field types** (section *Felttyper – minimal*, Q1–Q9): `date`,
  `singletext`, `multiline`, `choice`, `multichoice`, `number`, `yesno`,
  `attachment`, `peoplepicker` — each in its minimal valid form.
- **Every optional property and combination** (section *Valgfrie egenskaper*,
  Q10–Q20):
  - `placeholder` and `defaultValue` (the latter as a string on `singletext`,
    `number` `"0"`, `date`, `yesno`, `choice`)
  - `multiline` with `rows` + `allowAttachment`
  - `number` with `min` only, `max` only, and `min`+`max`+`defaultValue`
  - `choice` with `replicate` + `allowAttachment` + `defaultValue`
  - `multichoice` with `replicate`
  - `attachment` and `peoplepicker` with `placeholder` + `replicate`
  - both `required: true` and `required: false`
- **Links** (section *Lenker*, Q21–Q23):
  - external link (`url` set, `fileUrl` empty)
  - governing document (`fileUrl` set, `url` empty)
  - a field carrying multiple links (one external + one governing)

## Validate against the schema

From the repo root:

```bash
npx -y -p ajv-cli@^5 ajv validate --strict=false \
  -s assets/checklist/checklist-schema-v1.json \
  -d test/checklist/all-field-types.checklist.json
```

Expected output: `all-field-types.checklist.json valid`.

> Keep this fixture in sync with the schema. If a new field type or property is
> added to `checklist-schema-v1.json`, add a field here that exercises it.
