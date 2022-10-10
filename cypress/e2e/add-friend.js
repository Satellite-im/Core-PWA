import 'cypress-localstorage-commands'
//const faker = require('faker')
//const firstRandomName = faker.internet.userName(name) // generate random name for First Account
//const secondRandomName = faker.internet.userName(name) // generate random name for Second Account
//const thirdRandomName = faker.internet.userName(name) // generate random name for Third Account
let firstUserID, secondUserID, thirdUserID

describe('Create Accounts and Add Friends', () => {
  before(() => {
    // Delete Localstorage Snapshots before starting tests
    cy.clearLocalStorageSnapshot()
  })

  it('Create First Account', () => {
    // Create one account
    cy.createAccount('12345', 'Chat User A', false, true)

    // Save userId and userName from LocalStorage
    cy.validateChatPageIsLoaded().then(() => {
      let firstLocalStorage = localStorage.getItem('Satellite-Store')
      firstLocalStorage = JSON.parse(firstLocalStorage)
      firstUserID = firstLocalStorage.accounts.details.did
    })

    // Save Localstorage Snapshot for Chat User A
    cy.saveLocalStorage('Chat User A')
  })

  it('Create Second Account', () => {
    // Create Second User Account
    cy.createAccount('12345', 'Chat User B', false, true)

    // Save User ID from LocalStorage
    cy.validateChatPageIsLoaded().then(() => {
      let secondLocalStorage = localStorage.getItem('Satellite-Store')
      secondLocalStorage = JSON.parse(secondLocalStorage)
      secondUserID = secondLocalStorage.accounts.details.did
    })

    // Save Localstorage Snapshot for Chat User B
    cy.saveLocalStorage('Chat User B')
  })

  it('Create Third Account', () => {
    // Create Third User Account
    cy.createAccount('12345', 'Chat User C', false, true)

    // Save User ID from LocalStorage
    cy.validateChatPageIsLoaded().then(() => {
      let thirdLocalStorage = localStorage.getItem('Satellite-Store')
      thirdLocalStorage = JSON.parse(thirdLocalStorage)
      thirdUserID = thirdLocalStorage.accounts.details.did
    })

    // Save Localstorage Snapshot for Chat User C
    cy.saveLocalStorage('Chat User C')
  })

  it('Import second account and add first account as friend', () => {
    // Login with User B by restoring LocalStorage Snapshot
    cy.loginWithLocalStorage('Chat User B')

    // Go to Friends and send a friend request to First User
    cy.goToFriendsPage('Add Friend')
    cy.sendFriendRequest(firstUserID, 'Chat User A')
  })

  it('Friend request sent is displayed and user cancels it', () => {
    //Go to Requests
    cy.goToFriendsPage('Requests')
    // Type friend ID to add it and validate that friend request is sent. Then cancel it
    cy.contains('Outgoing').should('be.visible')
    cy.get('[data-cy=friend-name]').should('contain', 'Chat User A')
    cy.get('[data-cy="friend-cancel-button"]').click()
    cy.contains('No requests found').should('be.visible')
    cy.contains('You have no pending friend requests').should('be.visible')
  })

  it('Try to add yourself as friend', () => {
    // Type your userID to attempt to add yourself as friend
    cy.goToFriendsPage('Add Friend')
    cy.get('[data-cy=add-friend-page]')
      .find('[data-cy=input-group]')
      .as('friend-request-input')
    cy.get('@friend-request-input').click().type(secondUserID)
    cy.contains("You can't add yourself, you silly goose.").should('be.visible')
    cy.get('@friend-request-input').click().clear()
  })

  it('Send again friend request to User A', () => {
    // Type friend ID to add it and validate that friend request is sent
    cy.get('[data-cy=add-friend-page]')
      .find('[data-cy=input-group]')
      .type(firstUserID)
    cy.get('[data-cy=friend]')
      .should('be.visible')
      .then(() => {
        cy.get('[data-cy=friend-name]').should('contain', 'Chat User A')
        cy.get('[data-cy=friend-confirm-button]').click()
      })
    cy.contains('Friend request successfully sent!').should('be.visible')

    // Save Localstorage Snapshot for Chat User B
    cy.saveLocalStorage('Chat User B')
  })

  it('Chat User A has a friend request displayed and accepts it', () => {
    // Login with User A by restoring LocalStorage Snapshot
    cy.loginWithLocalStorage('Chat User A')

    // Go to Friends tab and validate that a friend request was received
    cy.goToFriendsPage('Requests')
    cy.validateRequestsBadge()
    cy.acceptUpcomingFriendRequest('Chat User B')
    cy.saveLocalStorage('Chat User A')
  })

  it('Load third account and send friend request to First User', () => {
    // Login with User C by restoring LocalStorage Snapshot
    cy.restoreLocalStorage('Chat User C').then(() => {
      cy.loginWithLocalStorage('12345')
    })

    // Send friend request to user A
    cy.goToFriendsPage('Add Friend')
    cy.sendFriendRequest(firstUserID, 'Chat User A')

    // Save Localstorage Snapshot for Chat User C
    cy.saveLocalStorage('Chat User C')
  })

  it('Load first account and accept upcoming friend request', () => {
    // Login with User A by restoring LocalStorage Snapshot
    cy.loginWithLocalStorage('Chat User A')

    // Go to Friends tab and validate that a friend request was received
    cy.goToFriendsPage('Requests')
    cy.validateRequestsBadge()
    cy.acceptUpcomingFriendRequest('Chat User C')
    cy.saveLocalStorage('Chat User A')
  })

  // Skipped since further research is needed on how to restore localstorage for more than two snapshots
  it('Load second account and send friend request to third user', () => {
    // Login with User B by restoring LocalStorage Snapshot
    cy.loginWithLocalStorage('Chat User B')

    // Send friend request to user A
    cy.goToFriendsPage('Add Friend')
    cy.sendFriendRequest(firstUserID, 'Chat User C')

    // Save Localstorage Snapshot for Chat User C
    cy.saveLocalStorage('Chat User B')
  })

  // Skipped since further research is needed on how to restore localstorage for more than two snapshots
  it('Load third account and accept upcoming friend request', () => {
    // Login with User C by restoring LocalStorage Snapshot
    cy.loginWithLocalStorage('Chat User C')

    // Go to Friends tab and validate that a friend request was received
    cy.goToFriendsPage('Requests')
    cy.validateRequestsBadge()
    cy.acceptUpcomingFriendRequest('Chat User B')
    cy.saveLocalStorage('Chat User C')
  })
})
