#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
NODE_DIR="$ROOT/.tools/node-v22.16.0-darwin-arm64"
NODE_VERSION="v22.16.0"
ARCH="$(uname -m)"

if [[ "$ARCH" == "arm64" ]]; then
  NODE_PKG="node-${NODE_VERSION}-darwin-arm64"
else
  NODE_PKG="node-${NODE_VERSION}-darwin-x64"
fi

if [[ ! -x "$NODE_DIR/bin/npm" ]]; then
  echo "Installing Node.js ${NODE_VERSION} to .tools/ …"
  mkdir -p "$ROOT/.tools"
  curl -fsSL "https://nodejs.org/dist/${NODE_VERSION}/${NODE_PKG}.tar.gz" \
    -o "$ROOT/.tools/node.tar.gz"
  tar -xzf "$ROOT/.tools/node.tar.gz" -C "$ROOT/.tools"
  rm "$ROOT/.tools/node.tar.gz"
fi

export PATH="$NODE_DIR/bin:$PATH"

cd "$ROOT"
echo "Node: $(node -v)"
echo "npm:  $(npm -v)"
npm install

echo ""
echo "Setup complete. Run the dashboard with:"
echo "  ./scripts/dev.sh"
