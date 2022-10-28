const { defineConfig } = require('cypress')

const _ = require('lodash')
const del = require('del')

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
    specPattern: 'cypress/integration-pair-chat/**/chat-first-user.js',
    supportFile: 'cypress/support/first-user/e2e.js',
  },
})
