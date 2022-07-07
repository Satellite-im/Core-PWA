const faker = require('faker')
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN

describe('Import Account - Negative Tests', () => {
  it('Verify error when adding a wrong order passphrase', () => {
    cy.importAccountPINscreen(randomPIN)
    cy.get('[data-cy=import-account-button]', { timeout: 60000 }).click()
    cy.get('[data-cy=add-passphrase]', { timeout: 30000 })
      .should('be.visible')
      .click()
      .type(
        'over tilt regret diamond rubber example there fire roof sheriff always boring{enter}',
        { log: false },
        { force: true },
      )
    cy.contains('Recover Account').click()
    cy.contains(
      'We were unable to verify your passphrase. Please check it and try again.',
    ).should('be.visible')
  })

  it('Verify behavior when adding less than 12 words', () => {
    cy.importAccountPINscreen(randomPIN)
    cy.get('[data-cy=import-account-button]', { timeout: 60000 }).click()
    cy.get('[data-cy=add-passphrase]', { timeout: 30000 })
      .should('be.visible')
      .click()
      .type(
        'over tilt regret diamond rubber example there fire roof sheriff always{enter}',
        { log: false },
        { force: true },
      )
    cy.get('.recover-account').should('be.disabled')
  })
})
