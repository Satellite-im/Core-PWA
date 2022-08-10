#!/bin/bash
git clone https://github.com/Satellite-im/iridium.git
cp .env iridium/.env
cd iridium
export SYNC_NODE_ADDR=/dns4/sync-ny.satellite.im/tcp/4003/ws,/dns4/sync-ny.satellite.im/tcp/4002
corepack enable
corepack prepare pnpm@6.34.0 --activate
pnpm i --unsafe-perm
pnpm build:ipfs
pnpm build:browser
yarn link
cd ..
grep -v "@satellite-im/iridium" package.json > tmppackage && mv tmppackage package.json
yarn link @satellite-im/iridium
