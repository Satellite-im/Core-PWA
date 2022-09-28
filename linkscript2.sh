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

git checkout $DEPLOY_ENV

if [ -z $DEPLOY_ENV ] || [$DEPLOY_ENV == "dev"]; then
  echo "Checking out Dev Environment"
  export SYNC_NODE_ADDR=/dns4/sync-dev-ny.satellite.im/tcp/443/wss,/dns4/sync-dev-lon.satellite.im/tcp/443/wss,/dns4/sync-dev-sgp.satellite.im/tcp/443/wss
  git checkout dev
elif [$DEPLOY_ENV == "qa"]; then
  echo "Checking out QA Environment"
  export SYNC_NODE_ADDR=/dns4/sync-qa-lon.satellite.im/tcp/443/wss,/dns4/sync-qa-ny.satellite.im/tcp/443/wss
elif [$DEPLOY_ENV == "prod"]; then
  echo "Checking out Prod Environment"
  export SYNC_NODE_ADDR=/dns4/sync-ny-1.satellite.im/tcp/443/wss,/dns4/sync-sf-1.satellite.im/tcp/443/wss,/dns4/sync-fra-1.satellite.im/tcp/443/wss,/dns4/sync-sgp-1.satellite.im/tcp/443/wss
fi

corepack enable
corepack prepare pnpm@latest --activate
pnpm i --unsafe-perm
pnpm build:ipfs
pnpm build:browser
yarn link
cd ..
grep -v "@satellite-im/iridium" package.json > tmppackage && mv tmppackage package.json
yarn link @satellite-im/iridium
