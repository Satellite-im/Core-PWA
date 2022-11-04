const faker = require('faker')
const firstUserName = faker.internet.password(12, true) // Generate username with 12 characters
const secondUserName = faker.internet.password(12, true) // Generate username with 12 characters
const thirdUserName = faker.internet.password(12, true) // Generate username with 12 characters
let firstUserID, secondUserID, thirdUserID

describe('Create Test Accounts', () => {
  before(() => {
    // Delete Localstorage Snapshots before starting tests
    cy.clearLocalStorageSnapshot()
  })

  it('Create First Account', () => {
    // Create one account
    cy.createAccount('12345', firstUserName, true)

    // Validate chat page is loaded
    cy.validateChatPageIsLoaded()

    // Copy userID by clicking on your user satellite circle and save it into a variable
    cy.copyUserIDFromProfile().then((value) => {
      firstUserID = value
    })

    // Save LocalStorage snapshot
    cy.saveLocalStorage('Chat User A')
  })

  it('Create Second Account', () => {
    // Create Second User Account
    cy.createAccount('12345', secondUserName, true)

    // Save User ID from LocalStorage
    cy.validateChatPageIsLoaded()

    // Copy userID by clicking on your user satellite circle and save it into a variable
    cy.copyUserIDFromProfile().then((value) => {
      secondUserID = value
    })

    // Save LocalStorage snapshot
    cy.saveLocalStorage('Chat User B')
  })

  it('Create Third Account', () => {
    // Create Third User Account
    cy.createAccount('12345', thirdUserName, true)

    // Save User ID from LocalStorage
    cy.validateChatPageIsLoaded()

    // Copy userID by clicking on your user satellite circle and save it into a variable
    cy.copyUserIDFromProfile().then((value) => {
      thirdUserID = value
    })

    // Save LocalStorage snapshot
    cy.saveLocalStorage('Chat User C')
  })
})

describe('Add Friend tests with Chat User B', () => {
  it('Import second account and add first account as friend', () => {
    // Login with User B by restoring LocalStorage Snapshot
    cy.loginWithLocalStorage('Chat User B')

    // Go to Friends and send a friend request to First User
    cy.goToFriendsPage('Add Friend')
    cy.sendFriendRequest(firstUserID, firstUserName)
  })

  it('Friend request sent is displayed and user cancels it', () => {
    //Go to Requests
    cy.goToFriendsPage('Requests')
    // Type friend ID to add it and validate that friend request is sent. Then cancel it
    cy.contains('Outgoing').should('be.visible')
    cy.get('[data-cy=friend-name]').should('contain', firstUserName)
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
        cy.get('[data-cy=friend-name]').should('contain', firstUserName)
        cy.get('[data-cy=friend-confirm-button]').click()
      })
    cy.contains('Friend request successfully sent!').should('be.visible')
  })

  it('Send friend request to User C', () => {
    // Send friend request to user C
    cy.goToFriendsPage('Add Friend')
    cy.sendFriendRequest(thirdUserID, thirdUserName)
  })
})

describe('Add Friend tests with Chat User A', () => {
  it('Chat User A has a friend request displayed and accepts it', () => {
    // Login with User A by restoring LocalStorage Snapshot
    cy.loginWithLocalStorage('Chat User A')

    // Go to Friends tab and validate that a friend request was received
    cy.goToFriendsPage('Requests')
    cy.validateRequestsBadge()
    cy.acceptUpcomingFriendRequest(secondUserName)
  })

  it('Send friend request to Chat User C', () => {
    // Send friend request to user C
    cy.goToFriendsPage('Add Friend')
    cy.sendFriendRequest(thirdUserID, thirdUserName)
  })
})

describe('Add Friend tests with Chat User C', () => {
  it('Accept upcoming friend request from Chat User A', () => {
    // Login with User C by restoring LocalStorage Snapshot
    cy.loginWithLocalStorage('Chat User C')

    // Go to Friends tab and validate that a friend request was received
    cy.goToFriendsPage('Requests')
    cy.validateRequestsBadge('2')
    cy.acceptUpcomingFriendRequest(firstUserName, 2)
  })

  it('Accept upcoming friend request from Chat User B', () => {
    // Go to Friends tab and validate that a friend request was received
    cy.goToFriendsPage('Requests')
    cy.validateRequestsBadge('1')
    cy.acceptUpcomingFriendRequest(secondUserName)
  })
})
