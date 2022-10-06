FROM cypress/browsers:node16.13.0-chrome95-ff94

RUN npm install -g pnpm
RUN npm install -g yarn
RUN cd .. && git clone https://github.com/Satellite-im/iridium.git
RUN cd ../iridium
RUN corepack enable

ENTRYPOINT ["yarn"]
