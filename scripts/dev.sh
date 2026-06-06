#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ARCH="$(uname -m)"

if [[ "$ARCH" == "arm64" ]]; then
  NODE_DIR="$ROOT/.tools/node-v22.16.0-darwin-arm64"
else
  NODE_DIR="$ROOT/.tools/node-v22.16.0-darwin-x64"
fi

if [[ ! -x "$NODE_DIR/bin/npm" ]]; then
  echo "Node.js not found. Run ./scripts/setup.sh first."
  exit 1
fi

export PATH="$NODE_DIR/bin:$PATH"
cd "$ROOT"

if [[ ! -d node_modules ]]; then
  npm install
fi

# Stop stale dev servers so only one .next cache is active
for port in 3000 3001; do
  if lsof -ti :"$port" >/dev/null 2>&1; then
    echo "Stopping process on port ${port}..."
    lsof -ti :"$port" | xargs kill 2>/dev/null || true
  fi
done
sleep 1

rm -rf .next node_modules/.cache
echo "Starting dev server at http://localhost:3000"
exec npm run dev
