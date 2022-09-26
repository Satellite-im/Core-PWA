const faker = require('faker')
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN

describe('Create Account and add friend', () => {
  // Pending to work on this by creating two users and passing the id of first user to the second one
  it.skip('Create Account and add friend', { retries: 2 }, () => {
    cy.createAccount(randomPIN)
    cy.validateChatPageIsLoaded()
    // Pending to be fixed until we find how to add a friend on localhost
    cy.get('.search-container > .search-box > .input')
      .click()
      .type('5CXGsRDw8iU8HxYXLHLB62RfaJryWyQuksSLus6EPWn1')
    cy.get('.controls > .button').click()
  })
})
