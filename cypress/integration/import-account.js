const faker = require('faker')
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN

describe('Import Account Validations', () => {
  it('Import account - verify suggestions', () => {
    cy.importAccountPINscreen(randomPIN)
    cy.contains('Import Account', { timeout: 60000 })
      .should('be.visible')
      .click()
    cy.get('[data-cy=add-passphrase]').should('be.visible').click().type('b')
    cy.contains('bag').click()
    cy.get('.tag').should('be.visible')
  })

  it('Import account', () => {
    cy.importAccountPINscreen(randomPIN, false, false)
    cy.contains('Import Account', { timeout: 60000 })
      .should('be.visible')
      .click()
    cy.contains(
      'Enter your 12 word passphrase in exactly the same order your recovery seed was generated.',
    ).should('be.visible')
    cy.get('[data-cy=add-passphrase]')
      .should('be.visible')
      .click()
      .type(
        'veteran intact there despair unique trouble season rebel sort file unit hard{enter}',
        { log: false },
        { force: true },
      )
    cy.contains('Recover Account').should('be.visible').click()
    Cypress.on('uncaught:exception', (err, runnable) => false) // temporary until AP-48 gets fixed
  })
})
