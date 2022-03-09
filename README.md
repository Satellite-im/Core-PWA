<img src="https://i.imgur.com/PdJwuII.png" height="65px" />

# Satellite Core-PWA

#### Dev Site (Most up-to-date): [dev.Satellite.one](https://dev.satellite.one)

#### Release Site: [Satellite.one](https://satellite.one)

# Running

## Environment

It's important to setup your environment before running `Core-PWA`. This will require you
to add some keys. See the `.env.example` file to get started.

Start by copying the `.env.example` to a `.env` file. This stores secure information and is not pushed to production.

```
cp .env.example .env
```

Currently, the only environment variable you need is a [Textile](https://www.textile.io) API key.

## Install Submodules

Run `git submodule update --init --recursive` to pull down the submodules. This will pull down the `android`, `electron`, and `cypress` submodules.

## Running Locally

To start running locally complete the Environment setup and then run `yarn dev`.

## Running the e2e/integration/cypress tests

Move back a folder and clone the [cypress](https://github.com/Satellite-im/cypress) repo. It's just called "cypress" for now. In that cypress folder, run yarn.

Then, move to the Core_PWA folder, run a command like this to link in that new folder

```
 ln -s ../cypress cypress
```

If you are on an M1 mac, you will need to install the M1 Chromium. Instructions on that comming soon! Otherwise, just run this:

```
 npx cypress run --browser chrome
```

# Contributing

Please lint your code before submitting. `yarn lint`. Lints must pass before submitting a PR.
Please document all new methods and files.

# Contributors

![GitHub Contributors Image](https://contrib.rocks/image?repo=Satellite-im/Core-PWA)
