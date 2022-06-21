import 'cypress-localstorage-commands'

const COMMAND_DELAY = 2000 // to run tests slower

for (const command of [
  'visit',
  'click',
  'trigger',
  'type',
  'clear',
  'reload',
  'contains',
]) {
  Cypress.Commands.overwrite(command, (originalFn, ...args) => {
    const origVal = originalFn(...args)

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(origVal)
      }, COMMAND_DELAY)
    })
  })
}

//Commands to retry visiting root page when previous PIN data is not cleared correctly

Cypress.Commands.add('visitRootPage', () => {
  cy.deleteStorage()
  cy.wait(1000)
  cy.visit('/')
  cy.wait(1000)
  cy.get('body').then(($body) => {
    if (!($body.find('.create_pin_section').length > 0)) {
      cy.visitRootPage()
    }
  })
})

Cypress.Commands.add('deleteStorage', () => {
  cy.removeLocalStorage('Satellite-Store')
  cy.window().then((win) => {
    win.sessionStorage.clear()
  })
  cy.clearCookies()
})

Cypress.Commands.add(
  'clearDatabase',
  () =>
    new Cypress.Promise(async (resolve) => {
      const req = indexedDB.deleteDatabase('SatelliteDB')
      req.onsuccess = function () {
        resolve()
      }
    }),
)

//Import Account Commands

Cypress.Commands.add('importAccount', (pin, recoverySeed) => {
  cy.clearDatabase()
  cy.visitRootPage()
  cy.url().should('contain', '#/auth/unlock')
  cy.get('[data-cy=add-input]')
    .should('be.visible')
    .trigger('input')
    .type(pin, { log: false }, { force: true })
  cy.get('[data-cy=switch-button]').click() //store PIN
  cy.get('[data-cy=submit-input]').click()
  cy.get('[data-cy=import-account-button]', { timeout: 60000 }).click()
  cy.get('[data-cy=add-passphrase]')
    .should('be.visible')
    .trigger('input')
    .type(recoverySeed, { log: false }, { force: true })
  cy.contains('Recover Account').click()
})

// Chat - Page Load Commands

Cypress.Commands.add('validateChatPageIsLoaded', () => {
  cy.get('[data-cy=user-name]', { timeout: 420000 }).should('exist')
})

Cypress.Commands.add('goToConversation', () => {
  cy.get('#app-wrap').then(($appWrap) => {
    if (!$appWrap.hasClass('is-open')) {
      cy.get('[data-cy=toggle-sidebar]').click()
    }
  })

  //Find the friend and click on the message button associated
  cy.get('[data-cy=sidebar-user-name]', { timeout: 60000 })
  cy.getAttached('[data-cy=sidebar-user-name]').click()

  // Hide sidebar
  cy.get('[data-cy=hamburger-button]').click()

  //Wait until conversation is fully loaded
  cy.get('[data-cy=message-loading]', { timeout: 180000 }).should('not.exist')
})

// Get element attached to DOM

Cypress.Commands.add('getAttached', (selector) => {
  const getElement =
    typeof selector === 'function' ? selector : ($d) => $d.find(selector)
  let $el = null
  return cy
    .document()
    .should(($d) => {
      $el = getElement(Cypress.$($d))
      expect(Cypress.dom.isDetached($el)).to.be.false
    })
    .then(() => cy.wrap($el))
})
