const faker = require('faker')
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN

describe('Create Account and add friend', () => {
  it.skip('Create Account and add friend', { retries: 2 }, () => {
    cy.createAccount(randomPIN)
    cy.validateChatPageIsLoaded()
    cy.get('.search-container > .search-box > .input')
      .click()
      .type('5CXGsRDw8iU8HxYXLHLB62RfaJryWyQuksSLus6EPWn1')
    cy.get('.controls > .button').click()
  })
})
