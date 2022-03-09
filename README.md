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

Run `git submodule update --init --recursive` to pull down the submodules. This will pull down the `android` and `electron` submodules. We want Satellite.im to be as modular as possible so you only get what you want when you clone the project. Other folders like `locales` and `cypress` will be moved out later but we need a way to avoid git submodule issues when we are in heavy devleopment.

## Running Locally

To start running locally complete the Environment setup and then run `yarn dev`.

## Running the e2e/integration/cypress tests

```
 npx cypress run --browser chrome
```

# Contributing

Please lint your code before submitting. `yarn lint`. Lints must pass before submitting a PR.
Please document all new methods and files.

# Contributors

![GitHub Contributors Image](https://contrib.rocks/image?repo=Satellite-im/Core-PWA)
