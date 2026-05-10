#!/usr/bin/env bash
# Verify the schema copy in bo-claude-plugin matches bo-qcp-admin@v0.2.0.
# Run before every release of bo-claude-plugin.
#
# bo-qcp-admin is a PRIVATE repo, so we use authenticated gh api access
# instead of curl against raw.githubusercontent.com.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOCAL="$SCRIPT_DIR/../assets/qcp/qcp-schema-v1.json"
UPSTREAM_REPO="iQubeS/bo-qcp-admin"
UPSTREAM_REF="v0.2.0"
UPSTREAM_PATH="src/utils/qcp-schema/qcp-schema-v1.json"

echo "Comparing local schema against $UPSTREAM_REPO@$UPSTREAM_REF..."

UPSTREAM_CONTENT=$(gh api "repos/$UPSTREAM_REPO/contents/$UPSTREAM_PATH?ref=$UPSTREAM_REF" --jq '.content' | base64 -d)

if diff -q <(echo "$UPSTREAM_CONTENT") "$LOCAL" >/dev/null 2>&1; then
  echo "✓ Schema is in sync with $UPSTREAM_REPO@$UPSTREAM_REF"
  exit 0
else
  echo "✗ Schema DRIFT detected. Differences:"
  diff <(echo "$UPSTREAM_CONTENT") "$LOCAL"
  exit 1
fi
