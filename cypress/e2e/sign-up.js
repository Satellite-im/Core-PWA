const faker = require('faker')
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN

describe.skip('Sign up', () => {
  it('Sign up', { retries: 2 }, () => {
    cy.contains('Enter Password...').should('be.visible').click().type('12345')
    cy.contains('Create Account').click()
    cy.contains('I Saved It').click()
    cy.contains('Neil Spaceman...').click().type('username')
    cy.contains('Sign in').click()
    cy.contains('Got It!').click()
  })
})
