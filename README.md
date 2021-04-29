# Satellite-Absolute

# Running

## Environment

It's important to setup your environment before running `Satellite-Absoltue`. This will require you 
to add some keys. See the `.env.example` file to get started.

Start by cloning the `.env.example` to a local `.env`. This stores secure information and is not pushed to production.
```
cp .env.example .env
```

Now simply fill in the required information in the `.env` file.

To load your environemnt variables you need to prefix all yarn commands with `npx dotenv`.


## Running Locally

To start running locally complete the Environment setup and then run `npx dotenv yarn dev`.

# Contributing

Please lint your code before submitting. `npx dotenv yarn lint`. Lints must pass before submitting a PR.
Please document all new methods and files.