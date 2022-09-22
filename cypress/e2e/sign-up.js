const faker = require('faker')
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN

describe('Sign up', () => {
  it('Sign up', { retries: 2 }, () => {
    cy.visit('/')
    cy.get('[data-cy="input-group"]').should('be.visible').click().type('12345')
    cy.get('[data-cy="submit-input"]').click()
    cy.get('[data-cy="create-account-button"]').click()
    cy.contains('I Saved It').click()
    cy.contains('Neil Spaceman...').click().type('username')
    cy.contains('Sign in').click()
    cy.contains('Got It!').click()
  })
})
