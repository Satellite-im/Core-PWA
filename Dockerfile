FROM cypress/browsers:node16.13.0-chrome95-ff94
RUN cd .. && git clone https://github.com/Satellite-im/iridium.git
RUN cd ../iridium
RUN /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
RUN echo '# Set PATH, MANPATH, etc., for Homebrew.' >> /github/home/.profile
RUN echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >> /github/home/.profile
RUN eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
RUN brew install corepack
RUN corepack enable
RUN touch .env
RUN echo HOSTNAME=${{ secrets.HOSTNAME }} >> .env
RUN echo CERTBOT_EMAIL="support@satellite.im" >> .env
RUN echo SYNC_NODE_SEED="sync node a seed" >> .env
RUN echo SYNC_NODE_ADDR=${{ secrets.SYNC_NODE_ADDR }} >> .env
RUN echo SERVERDATAVOLUME=${{ secrets.SERVERDATAVOLUME }} >> .env
RUN echo NODE_ENV="development" >> .env
RUN echo SAFER_URL=${{ secrets.SAFER_URL }} >> .env
RUN cat .env
RUN pnpm i
RUN pnpm build

RUN yarn install

ENTRYPOINT ["yarn"]
