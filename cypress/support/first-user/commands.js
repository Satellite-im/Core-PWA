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
  cy.get('[data-cy=submit-input]').click()
  cy.get('[data-cy=import-account-button]', { timeout: 60000 }).click()
  cy.get('[data-cy=add-passphrase]')
    .should('be.visible')
    .trigger('input')
    .type(recoverySeed, { log: false }, { force: true })
  cy.contains('Recover Account').click()
})

// Chat - URL Commands

Cypress.Commands.add('validateURLOnClick', (expectedURL) => {
  let locatorURL = 'a[href="' + expectedURL + '"]'
  cy.get(locatorURL)
    .last()
    .scrollIntoView()
    .should('have.attr', 'href', expectedURL)
    .should('have.attr', 'target', '_blank')
    .then((link) => {
      cy.request(link.prop('href')).its('status').should('eq', 200)
    })
})

// Chat - Page Load Commands

Cypress.Commands.add('validateChatPageIsLoaded', () => {
  cy.get('[data-cy=user-name]', { timeout: 120000 }).should('exist')
})

Cypress.Commands.add('goToConversation', (user) => {
  cy.get('#app-wrap').then(($appWrap) => {
    if (!$appWrap.hasClass('is-open')) {
      cy.get('[data-cy=toggle-sidebar]').click()
    }
  })

  //Find the friend and click on the message button associated
  cy.get('[data-cy=sidebar-user-name]', { timeout: 60000 })
    .contains(user)
    .click()

  //Navigate through several pages before going to conversation
  //As a workaround for the issue of message containers taking a lot of time to be loaded
  cy.workaroundChatLoad(user)

  //Wait until conversation is fully loaded
  cy.get('[data-cy=message-container]', { timeout: 120000 })
    .last()
    .should('be.visible')
})

Cypress.Commands.add('workaroundChatLoad', (user) => {
  //Note: This workaround only works for non mobile tests. Mobiles tests will be skipped for now
  cy.get('[data-cy=sidebar-files]').click() //Go to files page
  cy.get('[data-cy=sidebar-friends]').click() //Go to friends page
  cy.get('[data-cy=sidebar-files]').click() // Return to files page
  //Click on the conversation again
  cy.get('[data-cy=sidebar-user-name]', { timeout: 30000 })
    .contains(user)
    .click()
})

// Paste Command

Cypress.Commands.add(
  'paste',
  { prevSubject: true },
  function (subject, pasteOptions) {
    const { pastePayload, pasteType } = pasteOptions
    const data =
      pasteType === 'application/json'
        ? JSON.stringify(pastePayload)
        : pastePayload
    // https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer
    const clipboardData = new DataTransfer()
    clipboardData.setData(pasteType, data)
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/paste_event
    const pasteEvent = new ClipboardEvent('paste', {
      bubbles: true,
      cancelable: true,
      dataType: pasteType,
      data,
      clipboardData,
    })
    subject[0].dispatchEvent(pasteEvent)

    return subject
  },
)

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
