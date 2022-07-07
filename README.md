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

## Running Locally

To start running locally complete the Environment setup and then run `yarn dev`.

## Running Cypress tests

To run Cypress tests you need to do yarn dev in order to build out `localhost:3000`, that's the one we use as the baseUrl

When `localhost:3000` is running you can either use

- `npx cypress open` - this will open the test runner and you can test all the tests in bulk or run a specific test

or

- `npx cypress run --browser chrome` - this will run the tests in the terminal

if you want to run a specific test on terminal you can also use

- `npx cypress run --spec "cypress/integration/test-name-here.js" --browser chrome`

## Running Jest tests

To run Jest tests you can use

- `yarn test` - this will run all the tests on our test suite

if you want to run a specific test you can also use

- `yarn test folder-name/test-name-here.test.ts`

# Contributing

Please lint your code before submitting. `yarn lint`. Lints must pass before submitting a PR.
Please document all new methods and files.

# Contributors

![GitHub Contributors Image](https://contrib.rocks/image?repo=Satellite-im/Core-PWA)
