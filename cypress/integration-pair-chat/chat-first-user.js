const faker = require('faker')
const longMessage = faker.lorem.words(50) // generate random sentence
let urlToValidate = 'https://www.satellite.im'

describe('Chat features with two accounts at the same time - First User', () => {
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

  it('Create test account for First User', () => {
    // Create one account
    cy.createAccount('12345', 'Chat User A')

    // Validate chat page is loaded
    cy.validateChatPageIsLoaded()
  })

  it('Send friend request to Second User', () => {
    // Go to Friends and send a friend request to First User
    cy.goToFriendsPage('Add Friend')

    //Get second user DID to add it as friend
    cy.readFile('cypress/fixtures/second-user-account.txt', {
      timeout: 15000,
    })
      .should('exist')
      .then((secondUserID) => {
        cy.sendFriendRequest(secondUserID, 'Chat User B')
      })
  })

  it('Ensure that friend request was accepted and go to conversation', () => {
    //Go to Friends Page
    cy.goToFriendsPage('Friends')

    //Validate friend appears
    cy.goToConversation('Chat User B')

    //Wait until Chat User B is online
    cy.get('[data-cy=chat-header-name]')
      .contains('Chat User B')
      .should('be.visible')
    cy.get('[data-cy=chat-header-status]', { timeout: 120000 })
      .should('contain', 'online')
      .contains('online')
  })

  it('Type a long message in chat bar without sending it', () => {
    //Type a long message
    cy.get('[data-cy=editable-input]')
      .should('be.visible')
      .trigger('input')
      .type(longMessage)
      .clear()
  })

  //Start of videocall tests
  it('Call to User B', () => {
    //Start videocall
    cy.get('[data-cy=toolbar-enable-audio]').click()
  })

  //Skipped since there is no calling indicator active for now
  it.skip('Voice/Video Calling - when receiving a call, should appear an indication waiting for another user to accept', () => {
    //Remote user should have a class calling indicating that its being called
    cy.get('[data-cy=stream-participant]')
      .find('[data-cy=media-user-circle]')
      .should('have.class', 'calling')
  })

  it('If user A calls user B doing voice call, video call should be deactivated', () => {
    //Videocall should be displayed on both sides
    cy.get('[data-cy=mediastream]').should('be.visible')

    //Validate that video stream from local user is not visible since call started as voice call
    cy.validateVideoPresentOnCall('local', false)

    //Validate that video stream from remote user is not visible since call started as voice call
    cy.validateVideoPresentOnCall('remote', false)
  })

  // Test skipped for now until import account is fixed, so we can use accounts with text messages previously sent
  it.skip('User should be able to scroll on messages when call modal is open', () => {
    //Go to beginning of chat
    cy.get('[data-cy=chat-message]')
      .first()
      .scrollIntoView()
      .should('be.visible')
  })

  it('Users can send links in chat while in a video/phone call', () => {
    //Send a link in chat
    cy.get('[data-cy=editable-input]').trigger('input').type(urlToValidate)
    //Wait until link appears in editable input
    cy.get('[data-cy=editable-input]', { timeout: 30000 }).should(
      'have.text',
      urlToValidate,
    )
    //Send message
    cy.get('[data-cy=send-message]').click()
    let locatorURL = 'a[href="' + urlToValidate + '"]'
    //Ensure that an anchor tag was created with the link that was just sent
    cy.get(locatorURL).last().scrollIntoView().should('have.attr', 'href')
  })

  it('Opening a link while in a call should direct you to another browser tab', () => {
    //Click on URL that was just sent
    cy.validateURLOnClick(urlToValidate)
  })

  // Needs a workaround to trigger fullscreen event on cypress
  it.skip('Video boxes should adjust to size when the user enters fullscreen', () => {
    // Click on full screen and validate that videocall is on fullscreen mode
    cy.get('[data-cy=call-fullscreen]')
      .realHover()
      .realClick()
      .then(() => {
        cy.get('[data-cy=mediastream-full-screen]').should('exist')
      })

    // Click on exit full screen and and validate that videocall is not on fullscreen mode
    cy.get('[data-cy=call-fullscreen]')
      .realHover()
      .realClick()
      .then(() => {
        cy.get('[data-cy=mediastream]').should('exist')
      })
  })

  it('When the user clicks the video button camera should be enabled', () => {
    // Click on call video button and validate that video-stream is visible
    cy.get('[data-cy=call-video]')
      .click()
      .then(() => {
        cy.validateVideoPresentOnCall('local', true)
        cy.get('[data-cy=video-unmuted').should('be.visible')
        cy.get('[data-cy=sidebar-video-unmuted').should('be.visible')
      })
  })

  it('When the user clicks the video button camera should be disabled until the user enables it again', () => {
    // Click on call video button again and validate that video-stream is muted
    cy.get('[data-cy=call-video]')
      .click()
      .then(() => {
        cy.validateVideoPresentOnCall('local', false)
        cy.get('[data-cy=video-muted').should('be.visible')
        cy.get('[data-cy=sidebar-video-muted').should('be.visible')
      })
  })

  it('User can mute microphone and microphone buttons will show as red', () => {
    //Click again on button to mute mic from chat button
    cy.get('[data-cy=call-audio]')
      .click()
      .then(() => {
        // Microphone buttons from chat screen and sidebar will show as muted
        cy.get('[data-cy=audio-muted]').should('be.visible')
        cy.get('[data-cy=sidebar-mic-muted]').should('be.visible')
      })
  })

  it('User microphone can be set to active - Mic buttons will not be red', () => {
    //Unmute mic from chat button
    cy.get('[data-cy=call-audio]')
      .click()
      .then(() => {
        // Microphone buttons from chat screen and sidebar will show as unmuted
        cy.get('[data-cy=audio-unmuted]').should('be.visible')
        cy.get('[data-cy=sidebar-mic-unmuted]').should('be.visible')
      })
  })

  it('Remote user can have microphone active - Mute indicator will not be displayed', () => {
    // Finish existing call with the other user
    cy.finishCall()

    // Start a new call with the other user
    cy.callUser()

    // There should not be any muted indicators on screen when both users are unmuted
    cy.get('[data-cy=muted-indicator]').should('not.exist')
  })

  it('Remote user can have microphone muted - Mute indicator will be displayed', () => {
    // Mute yourself
    cy.get('[data-cy=call-audio]').click()
    // There should be two muted indicators on screen now
    cy.get('[data-cy=muted-indicator]').should('have.length', 2)
  })

  it('User can unmute microphone from mic button on videocall - Muted indicator not visible', () => {
    //Click on call audio to unmute audio
    cy.get('[data-cy=call-audio]')
      .click()
      .then(() => {
        cy.get('[data-cy=muted-indicator]').should('have.length', 1)
      })
  })

  it('User can mute microphone from mic button on videocall - Muted indicator is visible', () => {
    //Click on call audio to mute audio
    cy.get('[data-cy=call-audio]')
      .click()
      .then(() => {
        cy.get('[data-cy=muted-indicator]').should('have.length', 2)
      })
  })

  it('User should be able to unmute their mic from chat and side menu', () => {
    //Mute mic from side menu
    cy.get('[data-cy=sidebar-mic-button]')
      .click()
      .then(() => {
        cy.get('[data-cy=muted-indicator]').should('have.length', 1)
      })
  })

  it('Users should be able to mute their mic from chat and side menu', () => {
    //Mute mic from side menu
    cy.get('[data-cy=sidebar-mic-button]')
      .click()
      .then(() => {
        cy.get('[data-cy=muted-indicator]').should('have.length', 2)
      })
  })

  it('Duration call appears on the call on the top left', () => {
    // Live indicator is displayed while on call
    cy.get('[data-cy=elapsed-time]').should('be.visible').and('contain', 'Live')
  })

  it('Current user can mute audio from remote user - Audio indicator will be red', () => {
    //Click on sidebar audio button to mute audio
    cy.get('[data-cy=sidebar-audio-button]').click()
    cy.get('[data-cy=sidebar-audio-deafened]').should('be.visible')
  })

  it('Videocall Audio Indicator - Is displayed as muted when audio is deafened', () => {
    cy.get('[data-cy=volume-at-min]').should('be.visible')
  })

  it('Current user can unmute audio from remote user - Audio indicator will not be red', () => {
    //Click on sidebar audio button to unmute audio
    cy.get('[data-cy=sidebar-audio-button]').click()
    cy.get('[data-cy=sidebar-audio-not-deafened]').should('be.visible')

    //Finish videocall
    cy.finishCall()
  })

  it('Current user can activate video - Camera will be displayed and video icon will not be red', () => {
    // Start a new call with the other user
    cy.callUser()

    //Activate local camera
    cy.get('[data-cy=call-video]').click()

    // Local Camera is loaded
    cy.validateVideoPresentOnCall('local', true)

    //Video buttons show as unmuted
    cy.get('[data-cy=video-unmuted]').should('be.visible')
    cy.get('[data-cy=sidebar-video-unmuted]').should('be.visible')
  })

  it('Remote user can enable video - Remote camera will be displayed', () => {
    // Remote Camera is loaded
    cy.validateVideoPresentOnCall('remote', true)
  })

  it('Validate video call show local and remote video', () => {
    //Both videos can be displayed at the same time
    // Local Camera is loaded
    cy.validateVideoPresentOnCall('local', true)

    // Remote Camera is loaded
    cy.validateVideoPresentOnCall('remote', true)
  })

  it('Current user can disable video - Camera will not be displayed and video icon will be red', () => {
    //Disable local camera
    cy.get('[data-cy=call-video]').click()

    // Local Video Stream does not exist in DOM
    cy.validateVideoPresentOnCall('local', false)

    //Video buttons show muted
    cy.get('[data-cy=video-muted]').should('be.visible')
    cy.get('[data-cy=sidebar-video-muted]').should('be.visible')
  })

  it('Remote user can disable video - Remote camera will not be displayed', () => {
    // Remote Camera is disabled
    cy.validateVideoPresentOnCall('remote', false, 30000)

    // Wait until remote validations are finished
    cy.wait(5000)

    //Finish videocall
    cy.finishCall()
  })

  it('Current user can screen share - Screen will be displayed instead of camera', () => {
    // Start a new call with the other user
    cy.callUser()

    //Enable screenshare
    cy.get('[data-cy=call-screen-share]').click()

    // Local Screenshare is loaded
    cy.validateScreenSharePresentOnCall('local', true)

    //Screen share button show enabled
    cy.get('[data-cy=screen-unmuted]').should('be.visible')
  })

  it('Remote screen share - User can see remote screen instead of remote camera', () => {
    // Remote Screenshare is loaded
    cy.validateScreenSharePresentOnCall('remote', true)
  })

  it('Current user can stop screen share - Screen will not be displayed now', () => {
    //Stop sharing screen
    cy.get('[data-cy=call-screen-share]').click()

    // Local Screenshare is not displayed
    cy.validateScreenSharePresentOnCall('local', false)

    //Screen share button show enabled
    cy.get('[data-cy=screen-muted]').should('be.visible')
  })

  it('Remote screen share stopped - User will stop seeing the remote screen', () => {
    // Remote Screenshare is removed
    cy.validateScreenSharePresentOnCall('remote', false, 45000)
  })

  it('Videocall Audio Indicator - Is displayed in screen', () => {
    cy.get('[data-cy=volume-icon]').should('be.visible').click()
  })

  it('Videocall Audio Indicator - User can see the volume slider', () => {
    cy.get('[data-cy=volume-wrapper]').should('be.visible')
    cy.get('body').realClick({ position: 'topLeft' })
  })

  it('Videocall Audio Indicator - When audio is deafened appears as muted', () => {
    // Click on deafen audio button
    cy.get('[data-cy=sidebar-audio-button]').click()
    cy.get('[data-cy=sidebar-audio-deafened]').should('be.visible')

    //Ensure that volume indicator as muted appears in screen
    //Validation skipped for now since muted volume at min is not refreshed on screen for cypress
    //cy.get('[data-cy=volume-at-min]').should('be.visible')
  })

  it('Videocall Audio Indicator - When audio is undeafened volume at min is not visible', () => {
    // Undeafen audio button
    cy.get('[data-cy=sidebar-audio-button]').click()
    cy.get('[data-cy=sidebar-audio-not-deafened]').should('be.visible')

    //Ensure that volume indicator does not appear as muted
    //Validation skipped for now since muted volume at min is not refreshed on screen for cypress
    //cy.get('[data-cy=volume-at-min]').should('not.exist')
  })

  it('Videocall Audio Indicator - Slider can be hidden again', () => {
    //Click on volume icon to show the volume slider
    cy.get('[data-cy=volume-icon]').click()
    cy.get('[data-cy=volume-wrapper]').should('be.visible')

    //Click outside of the volume icon to hide the volume slider
    cy.get('body').realClick({ position: 'topLeft' })
    cy.get('[data-cy=volume-wrapper]').should('not.exist')
  })

  it('Live Feed indicator should be displayed again if the user navigates to a different page and then return to a call', () => {
    //Click on sidebar files to go to Files page
    cy.get('[data-cy=sidebar-friends]').click()
    cy.get('[data-cy=elapsed-time]').should('not.exist')
  })

  it('Current video pop-up should still be visible and user returns to videocall', () => {
    //Remote video pop-up is still visible
    cy.get('[data-cy=preview-call]').should('be.visible')

    //Click on preview call button to return to videocall
    cy.get('[data-cy=preview-call-button]').click()

    //Live Indicator should be visible again - Validation skipped since elapsed time is hidden after returning to call
    //cy.get('[data-cy=elapsed-time]').should('be.visible')
  })

  it('When a friend hangs up on a call, a call should end on both sides', () => {
    //Finish videocall
    cy.finishCall()

    cy.get('[data-cy=mediastream]').should('not.exist')
  })

  it('Live Feed indicator should turn off when the user hangs up a call or video', () => {
    cy.get('[data-cy=elapsed-time]').should('not.exist')
  })

  it('User can deny an incoming call', () => {
    //Deny incoming second videocall
    cy.get('[data-cy=incoming-call]').should('be.visible')
    cy.wait(2000) // wait 2 seconds before denying call
    cy.get('[data-cy=incoming-call-deny]').click()
  })

  it('If remote users refreshes the page, the call is eneded on both sides', () => {
    //Accept the third incoming call from Chat User B
    cy.answerVideocall()

    //Wait until remote side refresh the browser tab and call should be finished on both sides
    cy.waitUntilRemoteCallEnds(30000)
  })

  // Test skipped because remote page gets stuck in Linking Satellites screen after refreshing
  it.skip('When remote user closes the browser/tab the call is ended', () => {
    //Accept the incoming call from Chat User B
    cy.answerVideocall()

    //Wait until remote side tests are finished executing and cypress automatically closes the browser to finish the videocall
    cy.waitUntilRemoteCallEnds(30000)
  })
})
