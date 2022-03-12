const faker = require('faker')
const recoverySeed =
  'core radio verb scout shuffle moment pottery maple need ostrich train around{enter}'
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
const redirectedURL = 'http://localhost:3000/#/auth/unlock' // URL redirected from root
const longMessage = faker.lorem.words(250) // generate random sentence

describe('Chat features with two accounts at the same time - First User', () => {
  before(() => {
    //Visit root page
    cy.window().then((win) => {
      win.sessionStorage.clear()
    })
    cy.visit('/')
    cy.url().then(($url) => {
      if (!($url === redirectedURL)) {
        cy.clearLocalStorage()
        cy.clearCookies()
        cy.wait(100)
        cy.visit('/')
      }
    })

    //Import account
    cy.url().should('contain', '#/auth/unlock')
    cy.get('[data-cy=add-input]')
      .should('be.visible')
      .type(randomPIN, { log: false }, { force: true })
    cy.get('[data-cy=submit-input]').click()
    cy.contains('Import Account', { timeout: 60000 }).click()
    cy.get('[data-cy=add-passphrase]')
      .should('be.visible')
      .type(recoverySeed, { log: false }, { force: true })
    cy.contains('Recover Account').click()
    Cypress.on('uncaught:exception', (err, runnable) => false) // temporary until AP-48 gets fixed
    cy.contains('Linking Satellites...', { timeout: 300000 }).should(
      'not.exist',
    )
  })

  it('Type a long message in chat bar without sending it', () => {
    //Validate Chat Screen is loaded
    cy.contains('Chat User A', { timeout: 300000 }).should('be.visible')
    //Attempt 3 times to ensure that if first account loads before, second account will see the typing indicator
    for (let times = 0; times < 3; times++) {
      cy.get('.messageuser').should('be.visible').type(longMessage).clear()
    }
  })
})
