const faker = require('faker')
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN

describe('Create Account and add friend', () => {
  it('Create Account and add friend', () => {
    cy.createAccount(randomPIN)
    cy.validateChatPageIsLoaded()
    cy.get('.search-container > .search-box > .input')
      .click()
      .type('5CXGsRDw8iU8HxYXLHLB62RfaJryWyQuksSLus6EPWn1')
    cy.get('.controls > .button').click()
  })
})