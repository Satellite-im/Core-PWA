<img src="https://i.imgur.com/PdJwuII.png" height="65px" />

# Satellite-Absolute

[![Netlify Status](https://api.netlify.com/api/v1/badges/8dff7efb-8ce4-4eef-871a-cdf1f665d676/deploy-status)](https://app.netlify.com/sites/pensive-newton-4113d6/deploys)

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

## Building native versions

Check out the [instructions in the wiki](https://github.com/Satellite-im/Satellite-Absolute/wiki/Build-Deploy). We use capacitorjs to integrate with the OS and build the native apps.

# Contributing

Please lint your code before submitting. `npx dotenv yarn lint`. Lints must pass before submitting a PR.
Please document all new methods and files.

# Contributors

![GitHub Contributors Image](https://contrib.rocks/image?repo=Satellite-im/Satellite-Absolute)

