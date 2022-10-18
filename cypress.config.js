const { defineConfig } = require('cypress')

const _ = require('lodash')
const del = require('del')

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
      on('after:spec', (spec, results) => {
        if (results && results.video) {
          // Do we have failures for any retry attempts?
          const failures = _.some(results.tests, (test) => {
            return _.some(test.attempts, { state: 'failed' })
          })
          if (!failures) {
            // delete the video if the spec passed and no tests retried
            return del(results.video)
          }
        }
      })
      require('./cypress/plugins/index.js')(on, config)
      require('cypress-localstorage-commands/plugin')(on, config)
      return config
    },
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
})
