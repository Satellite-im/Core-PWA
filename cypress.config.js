const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: '4offi6',
  numTestsKeptInMemory: 0,
  pageLoadTimeout: 120000,
  defaultCommandTimeout: 10000,
  video: false,
  chromeWebSecurity: false,
  watchForFileChanges: false,
  waitForAnimations: false,
  animationDistanceThreshold: 50,
  e2e: {
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
})
