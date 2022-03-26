const faker = require('faker')
const recoverySeed =
  'urban clump gather december smoke upset chicken spice steel hope doll pigeon{enter}'
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
const redirectedURL = 'http://localhost:3000/#/auth/unlock' // URL redirected from root

describe('Chat features with two accounts at the same time - Second User', () => {
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
  })

  it('Validate that is typing message is displayed', () => {
    cy.contains('Chat User B', { timeout: 300000 }).should('be.visible')
    cy.contains('typing', { timeout: 180000 }).should('be.visible')
  })
})
