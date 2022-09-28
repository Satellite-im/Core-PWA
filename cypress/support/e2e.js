import './commands'
import 'cypress-localstorage-commands'
import 'cypress-real-events/support'

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})
