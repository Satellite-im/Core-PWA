const { defineConfig } = require('cypress')

module.exports = defineConfig({
  fixturesFolder: false,
  defaultCommandTimeout: 15000,
  numTestsKeptInMemory: 0,
  pageLoadTimeout: 120000,
  watchForFileChanges: false,
  videosFolder: 'cypress/videos-chat-pair/first-user',
  screenshotsFolder: 'cypress/screenshots-chat-pair/first-user',
  $schema: 'https://on.cypress.io/cypress.schema.json',
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/integration-pair-chat/**/chat-first-user.js',
    supportFile: 'cypress/support/first-user/index.js',
  },
})
