#!/bin/bash
export PNPM_HOME=./.pnpm-links/
if [ ! -d ./linked-iridium ]; then
  git clone https://github.com/Satellite-im/iridium.git ./linked-iridium
  cp .env ./linked-iridium/.env
  cd ./linked-iridium
else
  cd ./linked-iridium
  git pull -f
fi
export SYNC_NODE_ADDR=/ip4/138.197.229.159/tcp/4003/ws,/ip4/138.197.229.159/tcp/4002
corepack enable
corepack prepare pnpm@latest --activate
pnpm i --unsafe-perm
pnpm build:ipfs
pnpm build:browser
pnpm link --global
cd ..
grep -v "@satellite-im/iridium" package.json > tmppackage && mv tmppackage package.json
pnpm link @satellite-im/iridium --global
