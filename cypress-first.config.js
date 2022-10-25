const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: '4offi6',
  fixturesFolder: false,
  defaultCommandTimeout: 15000,
  numTestsKeptInMemory: 0,
  pageLoadTimeout: 120000,
  watchForFileChanges: false,
  chromeWebSecurity: false,
  video: true,
  videosFolder: 'cypress/videos-chat-pair/first-user',
  waitForAnimations: false,
  animationDistanceThreshold: 50,
  experimentalWebKitSupport: true,
  screenshotsFolder: 'cypress/screenshots-chat-pair/first-user',
  e2e: {
    setupNodeEvents(on, config) {
      require('./cypress/plugins/index.js')(on, config)
      require('cypress-localstorage-commands/plugin')(on, config)
      return config
    },
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/integration-pair-chat/**/chat-first-user.js',
    supportFile: 'cypress/support/first-user/e2e.js',
  },
})
