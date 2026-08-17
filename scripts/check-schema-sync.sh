#!/usr/bin/env bash
# Verify every vendored schema still matches the upstream revision it was pinned to.
# Run before every release of bo-claude-plugin.
#
# Both upstream repos are PRIVATE, so this uses authenticated `gh api` rather than
# curl against raw.githubusercontent.com.
#
# Comparison is by git blob SHA, not by diffing decoded text. The blob hash is an exact
# statement about bytes, and it sidesteps the trailing-newline and line-ending noise
# that a text diff through a shell variable introduces.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# label | local path (repo-relative) | upstream repo | pinned ref | upstream path
SCHEMAS=(
  "qcp|assets/qcp/qcp-schema-v1.json|iQubeS/bo-qcp-admin|v0.2.0|src/utils/qcp-schema/qcp-schema-v1.json"
  "ra|assets/risk/ra-template-import.schema-v1.json|iQubeS/bo-ra|3f1140ab66c3dcc14320f420f6bb1119a6b95167|docs/ra-template-import.schema.json"
)

# Not checked here, because there is nothing upstream to check against:
#
#   assets/risk/ra-vocabulary-manifest.schema-v1.json
#
# bo-ra publishes no schema for the vocabulary manifest, so ours is derived by hand from
# the VocabularyManifest interface in src/services/templateJson.ts. If the RA schema
# below reports drift, re-read that file: the manifest schema and
# scripts/check-ra-vocabulary.mjs may both need updating, and neither will tell you so.
#
# bo-ra carries no tags or releases yet, which is why its pin is a commit. Swap it for a
# tag as soon as one exists — a tag says "this is a version", a commit only says
# "this is what was there that day".

failures=0

for entry in "${SCHEMAS[@]}"; do
  IFS='|' read -r label local_path repo ref upstream_path <<< "$entry"
  local_file="$ROOT/$local_path"

  printf '%-4s %s\n' "$label" "$repo@${ref:0:8} :: $upstream_path"

  if [[ ! -f "$local_file" ]]; then
    printf '     MISSING  %s is not in this repo\n\n' "$local_path"
    failures=$((failures + 1))
    continue
  fi

  upstream_sha="$(gh api "repos/$repo/contents/$upstream_path?ref=$ref" --jq '.sha')"
  local_sha="$(git -C "$ROOT" hash-object "$local_file")"

  if [[ "$upstream_sha" == "$local_sha" ]]; then
    printf '     ok       in sync (blob %s)\n\n' "${local_sha:0:8}"
  else
    printf '     DRIFT    local %s != upstream %s\n' "${local_sha:0:8}" "${upstream_sha:0:8}"
    gh api "repos/$repo/contents/$upstream_path?ref=$ref" --jq '.content' \
      | base64 -d \
      | diff -u - "$local_file" \
      | sed 's/^/       /' || true
    printf '\n'
    failures=$((failures + 1))
  fi
done

if [[ "$failures" -eq 0 ]]; then
  echo "All vendored schemas are in sync."
  exit 0
fi

echo "$failures schema(s) out of sync."
echo "Re-vendor the file, then re-read the upstream parser before trusting the fixtures"
echo "in test/risk/ — the resolver is the contract, the schema only describes it."
exit 1
