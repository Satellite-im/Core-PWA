import 'cypress-localstorage-commands'
const faker = require('faker')
const firstRandomName = faker.internet.userName(name) // generate random name
const secondRandomName = faker.internet.userName(name) // generate random name
let friendUsername,
  friendUserID,
  myUserID = ''

describe('Create two reusable accounts and validate friend request/accept flow', () => {
  before(() => {
    // Delete Localstorage Snapshots before starting tests
    cy.clearLocalStorageSnapshot()
  })
  
  it('Create First Account and grab friend ID', { retries: 2 }, () => {
    // Create one account
    cy.createAccount('12345', firstRandomName)

    // Save userId and userName from LocalStorage
    cy.validateChatPageIsLoaded().then(() => {
      let firstLocalStorage = localStorage.getItem('Satellite-Store')
      firstLocalStorage = JSON.parse(firstLocalStorage)
      friendUserID = firstLocalStorage.accounts.details.did
      friendUsername = firstLocalStorage.accounts.details.name
    })

    // Save Localstorage Snapshot for Chat User A
    cy.saveLocalStorage('Chat User A')
  })

  it('Create Second Account and add first user as friend', () => {
    // Create Second User Account
    cy.createAccount('12345', secondRandomName)

    // Save User ID from LocalStorage
    cy.validateChatPageIsLoaded().then(() => {
      let secondLocalStorage = localStorage.getItem('Satellite-Store')
      secondLocalStorage = JSON.parse(secondLocalStorage)
      myUserID = secondLocalStorage.accounts.details.did
    })

    // Go to Friends and send a friend request to First User
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
        cy.get('[data-cy=friend-confirm-button]').click()
      })
    cy.contains('Friend request successfully sent!').should('be.visible')
  })

  it('Friend request sent is displayed and user cancels it', () => {
    // Type friend ID to add it and validate that friend request is sent. Then cancel it
    cy.get('[data-cy=tab-element]').contains('Requests').click()
    cy.contains('Outgoing requests').should('be.visible')
    cy.get('[data-cy=friend-name]').should('contain', friendUsername)
    cy.get('[data-cy="friend-cancel-button"]').click()
    cy.contains('No requests found').should('be.visible')
    cy.contains('You have no pending friend requests').should('be.visible')
  })

  it('Try to add yourself as friend', () => {
    // Type your userID to attempt to add yourself as friend
    cy.get('[data-cy=tab-element]').contains('Add Friend').click()
    cy.get('[data-cy=add-friend-page]')
      .find('[data-cy=input-group]')
      .as('friend-request-input')
    cy.get('@friend-request-input').click().type(myUserID)
    cy.contains("You can't add yourself, you silly goose.").should('be.visible')
    cy.get('@friend-request-input').click().clear()
  })

  it('Send again friend request to User A', () => {
    // Type friend ID to add it and validate that friend request is sent
    cy.get('[data-cy=add-friend-page]')
      .find('[data-cy=input-group]')
      .type(friendUserID)
    cy.get('[data-cy=friend]')
      .should('be.visible')
      .then(() => {
        cy.get('[data-cy=friend-name]').should('contain', friendUsername)
        cy.get('[data-cy=friend-confirm-button]').click()
      })
    cy.contains('Friend request successfully sent!').should('be.visible')

    // Save Localstorage Snapshot for Chat User B
    cy.saveLocalStorage('Chat User B')
  })

  it('Chat User A has a friend request displayed and accepts it', () => {
    // Login with User A by restoring LocalStorage Snapshot
    cy.loginWithLocalStorage('Chat User A', '12345')

    // Go to Friends tab and validate that a friend request was received
    cy.get('[data-cy=sidebar-friends]').click()
    cy.get('[data-cy=tab-element]')
      .contains('Requests')
      .should('have.attr', 'data-badge', '1')
      .click()
    cy.get('[data-cy=friend]')
      .find('[data-cy=friend-name]')
      .should('contain', secondRandomName)
      .parents('[data-cy=friend]')
      .find('[data-cy=friend-confirm-button]')
      .click()
    cy.contains('No requests found').should('be.visible')
    cy.contains('You have no pending friend requests').should('be.visible')
    cy.saveLocalStorage('Chat User A')
  })

  after(() => {
    // Save Localstorage Snapshots for next specs
    cy.saveLocalStorage('Chat User A', 'Chat User B')
  })
})
