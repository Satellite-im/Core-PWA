const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: '4offi6',
  numTestsKeptInMemory: 0,
  pageLoadTimeout: 120000,
  defaultCommandTimeout: 10000,
  video: true,
  chromeWebSecurity: false,
  watchForFileChanges: false,
  waitForAnimations: false,
  experimentalWebKitSupport: true,
  animationDistanceThreshold: 50,
  e2e: {
    setupNodeEvents(on, config) {
      require('./cypress/plugins/index.js')(on, config)
      require('cypress-localstorage-commands/plugin')(on, config)
      return config
    },
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
})
