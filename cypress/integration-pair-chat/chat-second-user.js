describe('Chat features with two accounts at the same time - Second User', () => {
  beforeEach(() => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      if (err.message.includes('multiaddr must have a valid')) {
        console.log(
          'Error: multiaddr must have a valid format: /{ip4, ip6, dns4, dns6, dnsaddr}/{address}/{tcp, udp}/{port',
        )
      }
      // returning false here prevents Cypress from failing the test
      return false
    })
  })

  it('Create test account for Second User', () => {
    // Create one account
    cy.createAccount('12345', 'Chat User B', false)

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
    cy.validateRequestsBadge()
    cy.goToFriendsPage('Requests')
    cy.acceptUpcomingFriendRequest('Chat User A')
  })

  it('Go to conversation with first user', () => {
    //Open a chat conversation
    cy.goToConversation('Chat User A')

    //Wait until Chat User A is online
    cy.get('[data-cy=chat-header-name]')
      .contains('Chat User A')
      .should('be.visible')
    cy.get('[data-cy=chat-header-status]', { timeout: 120000 })
      .should('contain', 'online')
      .contains('online')
  })

  //Is typing indicator is displayed
  it('Validate that is typing message is displayed', () => {
    cy.get('[data-cy=footer-typing-indicator]', { timeout: 30000 }).should(
      'be.visible',
    )
  })

  it('Receive First Incoming Video Call for initial validations', () => {
    //Answer remote videocall
    cy.answerVideocall(45000)
  })

  it('Receive Second Incoming Video Call for not muted indicators', () => {
    //Wait until remote call ends
    cy.waitUntilRemoteCallEnds(60000)

    //Answer remote videocall
    cy.answerVideocall()

    //Wait one second
    cy.wait(1000)
  })

  it('Mute microphone', () => {
    //Click on button to mute mic from chat button
    cy.get('[data-cy=call-audio]').click()

    // Microphone buttons from chat screen and sidebar will show as muted
    cy.get('[data-cy=audio-muted]').should('be.visible')
    cy.get('[data-cy=sidebar-mic-muted]').should('be.visible')
  })

  it('Enable camera', () => {
    //Wait until remote call ends
    cy.waitUntilRemoteCallEnds(30000)
    //Answer remote videocall
    cy.answerVideocall()

    //Activate local camera
    cy.get('[data-cy=call-video]').click()

    // Local Camera is loaded
    cy.validateVideoPresentOnCall('local', true)

    //Video buttons show as unmuted
    cy.get('[data-cy=video-unmuted]').should('be.visible')
    cy.get('[data-cy=sidebar-video-unmuted]').should('be.visible')
  })

  it('Disable camera', () => {
    // Wait until remote validations finish
    cy.wait(10000)

    //Turn off local camera
    cy.get('[data-cy=call-video]').click()

    // Local Camera is not loaded
    cy.validateVideoPresentOnCall('local', false)

    //Video buttons show as muted
    cy.get('[data-cy=video-muted]').should('be.visible')
    cy.get('[data-cy=sidebar-video-muted]').should('be.visible')
  })

  it('Enable screenshare', () => {
    //Wait until remote call ends
    cy.waitUntilRemoteCallEnds(30000)

    //Answer remote videocall
    cy.answerVideocall()

    //Enable screenshare
    cy.get('[data-cy=call-screen-share]').click()

    // Local Screenshare is loaded
    cy.validateScreenSharePresentOnCall('local', true)

    //Screen share button show enabled
    cy.get('[data-cy=screen-unmuted]').should('be.visible')

    // Wait 3 seconds before disabling screen share
    cy.wait(3000)
  })

  it('Disable screenshare', () => {
    //Disable screenshare
    cy.get('[data-cy=call-screen-share]').click()

    // Local Screenshare is no longer visible
    cy.validateScreenSharePresentOnCall('local', false)

    //Screen share button show enabled
    cy.get('[data-cy=screen-muted]').should('be.visible')
  })

  it('Call finished on remote side should end call in local side', () => {
    cy.waitUntilRemoteCallEnds(45000)
  })

  it('When a friend hangs up on a call, a call should end on both sides', () => {
    cy.get('[data-cy=mediastream]').should('not.exist')
  })

  it('Call to User A and wait for remote user to end the call', () => {
    /// Start a new call with the other user
    cy.callUser()

    // Wait until remote call was denied
    cy.waitUntilRemoteCallEnds()
  })

  it('Call to User A and refresh tab', () => {
    // Start a new call with the other user
    cy.callUser()

    //Wait 5 seconds before refreshing tab
    cy.wait(5000)

    cy.visit('/')

    //Call is ended
    cy.get('[data-cy=mediastream]').should('not.exist')
  })

  // Skipped since refreshing page on Cypress is showing Choose Your Password Screen instead of Decrypt Account
  it.skip('Call again to User A and close the browser', () => {
    //Enter Pin once that Decrypt Account is displayed

    cy.contains('Decrypt Account', { timeout: 30000 }).should('be.visible')
    cy.get('[data-cy=input-group]').trigger('input').type('12345')
    cy.get('[data-cy=submit-input]').click()

    // Validate chat page is loaded
    cy.validateChatPageIsLoaded()

    //Go to conversation
    cy.goToConversation('Chat User A')

    // Start a new call with the other user
    cy.callUser()

    //Wait 3 seconds before ending test and cypress will automatically close the browser
    cy.wait(3000)
  })
})
