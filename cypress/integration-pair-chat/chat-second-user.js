const faker = require('faker')
const longMessage = faker.lorem.words(100) // generate random sentence

describe('Chat features with two accounts at the same time - Second User', () => {
  it('Create test account for Second User', () => {
    // Create one account
    cy.createAccount('12345', 'Chat User B', false, true)

    // Validate chat page is loaded
    cy.validateChatPageIsLoaded()

    //Save userDID on file
    cy.getLocalStorage('Satellite-Store').then((value) => {
      let valueObject = JSON.parse(value)
      let userDID = valueObject.accounts.active
      cy.writeFile('cypress/fixtures/second-user-account.txt', userDID, 'utf-8')
    })
  })

  it('Accept friend request received from first user', () => {
    // Go to Friends tab and validate that a friend request was received
    cy.goToFriendsPage('Requests')
    cy.validateRequestsBadge()
    cy.acceptUpcomingFriendRequest('Chat User A')
  })

  it('Go to conversation with first user', () => {
    //Open a chat conversation
    cy.goToConversation('Chat User A')
  })

  it('Type a long message in chat bar without sending it', () => {
    //Type a long message
    cy.get('[data-cy=editable-input]')
      .should('be.visible')
      .trigger('input')
      .type(longMessage)
      .clear()
  })

  it('Receive Incoming Video Call', () => {
    //Answer remote videocall
    cy.get('[data-cy=incoming-call]', { timeout: 30000 }).should('be.visible')

    //Accept incoming video call
    cy.get('[data-cy=incoming-call-accept]').click()

    //Wait until all validations from other user are completed
    cy.wait(60000)
  })

  it('Mute microphone', () => {
    //Click again on button to mute mic from chat button
    cy.get('[data-cy=call-audio]').click()

    // Microphone buttons from chat screen and sidebar will show as muted
    cy.get('[data-cy=audio-muted]').should('be.visible')
    cy.get('[data-cy=sidebar-mic-muted]').should('be.visible')
  })

  it('Enable camera', { retries: 1 }, () => {
    //Activate local camera
    cy.get('[data-cy=call-video]').click()

    // Local Camera is loaded
    cy.validateVideoPresentOnCall('local', true)

    //Video buttons show as unmuted
    cy.get('[data-cy=video-unmuted]').should('be.visible')
    cy.get('[data-cy=sidebar-video-unmuted]').should('be.visible')
    cy.wait(30000)
  })

  it('Disable camera', () => {
    //Turn off local camera
    cy.get('[data-cy=call-video]').click()

    // Local Camera is not loaded
    cy.validateVideoPresentOnCall('local', false)

    //Video buttons show as muted
    cy.get('[data-cy=video-muted]').should('be.visible')
    cy.get('[data-cy=sidebar-video-muted]').should('be.visible')
    cy.wait(30000)
  })

  it('Enable screenshare', () => {
    //Enable screenshare
    cy.get('[data-cy=call-screen-share]').click()

    // Local Screenshare is loaded
    cy.validateScreenSharePresentOnCall('local', true)

    //Screen share button show enabled
    cy.get('[data-cy=screen-unmuted]').should('be.visible')
    cy.wait(30000)
  })

  it('Disable screenshare', () => {
    //Disable screenshare
    cy.get('[data-cy=call-screen-share]').click()

    // Local Screenshare is no longer visible
    cy.validateScreenSharePresentOnCall('local', false)

    //Screen share button show enabled
    cy.get('[data-cy=screen-muted]').should('be.visible')
    cy.wait(30000)
  })

  it('Call finished on remote side should end call in local side', () => {
    cy.get('[data-cy=mediastream]', { timeout: 240000 }).should('not.exist')
  })

  it('Call to User B for a second time', () => {
    //Start videocall
    cy.get('[data-cy=toolbar-enable-audio]').click()
  })

  it('Call to User A for a third time', () => {
    //Start videocall
    cy.get('[data-cy=toolbar-enable-audio]')
      .click()
      .then(() => {
        cy.get('[data-cy=mediastream]').should('be.visible')
      })

    //Wait 10 seconds before refreshing tab
    cy.wait(10000)
  })

  it('Refresh tab to finish the videocall', () => {
    //Refresh page
    cy.reload()

    //Validate Chat Screen is loaded again after refreshing
    cy.validateChatPageIsLoaded()

    //Go to conversation
    cy.goToConversation('Chat User A')
  })

  it('Call again to User A for a fourth time', () => {
    //Wait until Chat Pair A is online again
    cy.get('[data-cy=chat-header-name]')
      .contains('Chat User A')
      .should('be.visible')
    cy.get('[data-cy=chat-header-status]')
      .contains('online', { timeout: 90000 })
      .should('be.visible')

    //Start videocall
    cy.get('[data-cy=toolbar-enable-audio]').click()

    //Wait 30 seconds and browser tab will be closed automatically when spec finishes running
    cy.wait(30000)
  })
})
