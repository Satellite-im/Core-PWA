const faker = require('faker')
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN

describe('Import Account Validations', () => {
  it('Import account - verify suggestions', () => {
    cy.importAccountPINscreen(randomPIN)
    cy.get('[data-cy=import-account-button]', { timeout: 60000 })
      .should('be.visible')
      .click()
    cy.get('[data-cy=add-passphrase]').should('be.visible').click().type('b')
    cy.contains('bag').click()
    cy.get('.tag').should('be.visible')
  })

  it('Import account', () => {
    cy.importAccountPINscreen(randomPIN, false, false)
    cy.get('[data-cy=import-account-button]', { timeout: 60000 })
      .should('be.visible')
      .click()
    cy.contains(
      'Enter your 12 word passphrase in exactly the same order your recovery seed was generated.',
    ).should('be.visible')
    cy.get('[data-cy=add-passphrase]')
      .should('be.visible')
      .click()
      .type(
        'useful wedding venture reopen forest lawsuit essence hamster kitchen bundle level tower{enter}',
        { log: false },
        { force: true },
      )
    cy.contains('Recover Account').should('be.visible').click()
  })
})
