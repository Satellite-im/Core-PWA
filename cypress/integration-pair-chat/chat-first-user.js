const faker = require('faker')
const recoverySeed =
  'lonely dust spring orphan pulp angry mystery bracket pottery metal bright damp{enter}'
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
const redirectedURL = 'http://localhost:3000/#/auth/unlock' // URL redirected from root
const longMessage = faker.lorem.words(250) // generate random sentence

describe('Chat features with two accounts at the same time - First User', () => {
  before(() => {
    //Delete database before starting
    new Cypress.Promise(async (resolve) => {
      const req = indexedDB.deleteDatabase('SatelliteDB')
      req.onsuccess = function () {
        resolve()
      }
    })

    //Remove local storage, cookies and then visit root page
    cy.window().then((win) => {
      win.sessionStorage.clear()
    })
    cy.clearCookies()
    cy.wait(1000)
    cy.visit('/')

    //Import account
    cy.url().should('contain', '#/auth/unlock')
    cy.get('[data-cy=add-input]')
      .should('be.visible')
      .click()
      .wait(500)
      .clear()
      .type(randomPIN, { log: false }, { force: true })
    cy.get('[data-cy=submit-input]').click()
    cy.contains('Import Account', { timeout: 60000 }).click()
    cy.get('[data-cy=add-passphrase]')
      .should('be.visible')
      .click()
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
      cy.get('[data-cy=editable-input]')
        .should('be.visible')
        .trigger('input')
        .type(longMessage)
        .clear()
    }
  })
})
