const faker = require('faker')
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
let friendUsername = ''
let friendUserID = ''

describe('Create Account and add friend', () => {
  it('Create First Account and grab friend ID', { retries: 2 }, () => {
    cy.createAccount(randomPIN)
    cy.validateChatPageIsLoaded().then(() => {
      let myLocalStorage = localStorage.getItem('Satellite-Store')
      myLocalStorage = JSON.parse(myLocalStorage)
      friendUserID = myLocalStorage.accounts.details.did
      friendUsername = myLocalStorage.accounts.details.name
    })
  })

  it('Create Second Account and add friend', () => {
    cy.createAccount(randomPIN)
    cy.validateChatPageIsLoaded()
    // Pending to be fixed until we find how to add a friend on localhost
    cy.get('[data-cy=sidebar-friends]').click()
    cy.get('[data-cy=tab-element]').contains('Add Friend').click()
    cy.get('[data-cy=add-friend-page]')
      .find('[data-cy=input-group]')
      .click()
      .type(friendUserID)
    cy.get('[data-cy=friend]')
      .should('be.visible')
      .then(() => {
        cy.get('[data-cy=friend-name]').should('contain', friendUsername)
        cy.get('[data-cy=friend-did]').should('contain', friendUserID)
        cy.get('[data-cy=friend-send-request]').click()
      })
    cy.contains('Friend request successfully sent!').should('be.visible')
  })

  it('Requests tab should display the new pending friend request listed', () => {
    cy.get('[data-cy=tab-element]').contains('Requests').click()
    cy.contains('Outgoing requests').should('be.visible')
    cy.get('[data-cy=friend-name]').should('contain', friendUsername)
  })

  it('User should be able to withdraw friend request', () => {
    cy.get('[data-cy="friend-cancel-request-sent"]').click()
    cy.contains('No requests found').should('be.visible')
    cy.contains('You have no pending friend requests').should('be.visible')
  })
})
