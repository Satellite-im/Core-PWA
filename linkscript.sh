#!/bin/bash
if [ ! -d ../iridium ]; then
  git clone https://github.com/Satellite-im/iridium.git ../iridium
  cp .env ../iridium/.env
fi
cd ../iridium
export SYNC_NODE_ADDR=/ip4/138.197.229.159/tcp/4003/ws,/ip4/138.197.229.159/tcp/4002
corepack enable
corepack prepare pnpm@latest --activate
pnpm i --unsafe-perm
pnpm build:ipfs
pnpm build:browser
pnpm link --global
cd ../core-pwa
grep -v "@satellite-im/iridium" package.json > tmppackage && mv tmppackage package.json
pnpm link @satellite-im/iridium --global
