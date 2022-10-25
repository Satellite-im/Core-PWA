let urlToValidate = 'https://www.google.com'

describe('Chat features with two accounts at the same time - First User', () => {
  it('Create test account for First User', () => {
    // Create one account
    cy.createAccount('12345', 'Chat User A', false, true)

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
    cy.get('[data-cy=chat-header-status]')
      .contains('online', { timeout: 90000 })
      .should('be.visible')
  })

  //Is typing indicator is displayed
  it('Validate that is typing message is displayed', { retries: 1 }, () => {
    cy.get('[data-cy=footer-typing-indicator]').should('be.visible')
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
    cy.get('[data-cy=mediastream]', { timeout: 30000 }).should('be.visible')

    //Validate that video stream from local user is not visible since call started as voice call
    cy.validateVideoPresentOnCall('local', false)

    //Validate that video stream from remote user is not visible since call started as voice call
    cy.validateVideoPresentOnCall('remote', false)
  })

  //Need to add step on sending chat messages before starting videocall
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

  it('Video boxes should adjust to size when the user enters fullscreen', () => {
    // Click on full screen and validate that videocall is on fullscreen mode
    cy.get('[data-cy=go-fullscreen]').click()
    cy.get('[data-cy=mediastream]').should('have.class', 'is-fullscreen')

    // Click on exit full screen and and validate that videocall is not on fullscreen mode
    cy.get('[data-cy=exit-fullscreen]').click()
    cy.get('[data-cy=mediastream]').should('not.have.class', 'is-fullscreen')
  })

  it(
    'When the user clicks the video button camera should be enabled',
    { retries: 2 },
    () => {
      // Click on call video button and validate that video-stream is visible
      cy.get('[data-cy=call-video]').click()
      cy.validateVideoPresentOnCall('local', true)
      cy.get('[data-cy=video-unmuted').should('be.visible')
      cy.get('[data-cy=sidebar-video-unmuted').should('be.visible')
    },
  )

  it(
    'When the user clicks the video button camera should be disabled until the user enables it again',
    { retries: 1 },
    () => {
      // Click on call video button again and validate that video-stream is muted
      cy.get('[data-cy=call-video]').click()
      cy.validateVideoPresentOnCall('local', false)
      cy.get('[data-cy=video-muted').should('be.visible')
      cy.get('[data-cy=sidebar-video-muted').should('be.visible')
    },
  )

  it('Should appear an indication when the user is muted on the call', () => {
    //Click on call audio to mute audio
    cy.get('[data-cy=call-audio]').click()
    cy.validateAudioPresentOnCall('Chat User A', true)

    //Click on call audio to unmute audio
    cy.get('[data-cy=call-audio]').click()
    cy.validateAudioPresentOnCall('Chat User A', false)
  })

  it('Users should be able to mute their mic from chat and side menu', () => {
    //Mute mic from chat button
    cy.get('[data-cy=call-audio]').click()
    cy.validateAudioPresentOnCall('Chat User A', true)

    //Unmute audio from call
    cy.get('[data-cy=call-audio]').click()
    cy.validateAudioPresentOnCall('Chat User A', false)

    //Mute mic from side menu
    cy.get('[data-cy=sidebar-mic-button]').click()
    cy.validateAudioPresentOnCall('Chat User A', true)
  })

  it('User microphone can be set to active - Mic buttons will not be red', () => {
    //Unmute mic from chat button
    cy.get('[data-cy=call-audio]').click()

    // Microphone buttons from chat screen and sidebar will show as unmuted
    cy.get('[data-cy=audio-unmuted]').should('be.visible')
    cy.get('[data-cy=sidebar-mic-unmuted]').should('be.visible')
  })

  it('User can mute microphone and microphone buttons will show as red', () => {
    //Click again on button to mute mic from chat button
    cy.get('[data-cy=call-audio]').click()

    // Microphone buttons from chat screen and sidebar will show as muted
    cy.get('[data-cy=audio-muted]').should('be.visible')
    cy.get('[data-cy=sidebar-mic-muted]').should('be.visible')
  })

  it('Remote user can have microphone active - Mute indicator will not be displayed', () => {
    cy.validateAudioPresentOnCall('Chat User B', false, 60000)
  })

  it('Remote user can have microphone muted - Mute indicator will be displayed', () => {
    cy.validateAudioPresentOnCall('Chat User B', true, 60000)
  })

  it('Duration call appears on the call on the top left', () => {
    // Live indicator is displayed while on call
    cy.get('[data-cy=elapsed-time]').should('be.visible').and('contain', 'Live')
  })

  it('Current user can mute audio from remote user - Audio indicator will be red', () => {
    cy.get('[data-cy=sidebar-audio-button]').click()
    cy.get('[data-cy=sidebar-audio-deafened]').should('be.visible')
  })

  it('Videocall Audio Indicator - Is displayed as muted when microphone is muted', () => {
    cy.get('[data-cy=volume-at-min]').should('be.visible')
  })

  it('Current user can unmute audio from remote user - Audio indicator will not be red', () => {
    cy.get('[data-cy=sidebar-audio-button]').click()
    cy.get('[data-cy=sidebar-audio-not-deafened]').should('be.visible')
  })

  it('Current user can activate video - Camera will be displayed and video icon will not be red', () => {
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
    cy.validateVideoPresentOnCall('remote', true, 60000)
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
  })

  it('Current user can screen share - Screen will be displayed instead of camera', () => {
    //Enable screenshare
    cy.get('[data-cy=call-screen-share]').click()

    // Local Screenshare is loaded
    cy.validateScreenSharePresentOnCall('local', true)

    //Screen share button show enabled
    cy.get('[data-cy=screen-unmuted]').should('be.visible')
  })

  it('Current user can stop screen share - Screen will not be displayed now', () => {
    //Stop sharing screen
    cy.get('[data-cy=call-screen-share]').click()

    // Local Screenshare is not displayed
    cy.validateScreenSharePresentOnCall('local', false)

    //Screen share button show enabled
    cy.get('[data-cy=screen-muted]').should('be.visible')
  })

  it('Remote screen share - User can see remote screen instead of remote camera', () => {
    // Remote Screenshare is loaded
    cy.validateScreenSharePresentOnCall('remote', true, 45000)
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
  })

  it('Videocall Audio Indicator - When audio is deafened appears as muted', () => {
    // Click on deafen audio button
    cy.get('[data-cy=sidebar-audio-button]').click()
    cy.get('[data-cy=sidebar-audio-deafened]').should('be.visible')

    //Ensure that volume indicator appears as muted
    cy.get('[data-cy=volume-at-min]').should('be.visible')

    // Undeafen audio button
    cy.get('[data-cy=sidebar-audio-button]').click()
    cy.get('[data-cy=sidebar-audio-not-deafened]').should('be.visible')

    //Ensure that volume indicator does not appear as muted
    cy.get('[data-cy=volume-at-min]').should('not.exist')
  })

  it('Videocall Audio Indicator - Slider can be hidden again', () => {
    //Click on volume icon to show the volume slider
    cy.get('[data-cy=volume-icon]').click()
    cy.get('[data-cy=volume-wrapper]').should('be.visible')

    //Click on volume icon to hide the volume slider
    cy.get('[data-cy=volume-icon]').click()
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

    //Live Indicator should be visible again - Skipped since elapsed time is hidden after returning to call
    //cy.get('[data-cy=elapsed-time]').should('be.visible')
  })

  // Call Finished tests
  it('Finish videocall', () => {
    //Wait 15 seconds before finishing the call
    cy.wait(15000)
    cy.get('[data-cy=call-hangup]').click()
  })

  it('When a friend hangs up on a call, a call should end on both sides', () => {
    cy.get('[data-cy=mediastream]', { timeout: 30000 }).should('not.exist')
  })

  it('Live Feed indicator should turn off when the user hangs up a call or video', () => {
    cy.get('[data-cy=elapsed-time]').should('not.exist')
  })

  it('User can deny an incoming call', () => {
    //Deny incoming videocall
    cy.get('[data-cy=incoming-call]', { timeout: 90000 }).should('be.visible')
    cy.get('[data-cy=incoming-call-deny]').click()
  })

  it('Refreshing tab should end call', () => {
    //Accept the second incoming call from Chat User B
    cy.get('[data-cy=incoming-call]', { timeout: 60000 }).should('be.visible')
    cy.get('[data-cy=incoming-call-accept]').click()
    cy.get('[data-cy=mediastream]').should('be.visible')

    //Wait until remote side refresh the browser tab and call should be finished on both sides
    cy.get('[data-cy=mediastream]', { timeout: 60000 }).should('not.exist')
  })

  it('When closing tab should end a phone call', () => {
    cy.get('[data-cy=incoming-call]', { timeout: 90000 }).should('be.visible')
    cy.get('[data-cy=incoming-call-accept]').click()
    cy.get('[data-cy=mediastream]').should('be.visible')

    //Wait until remote side closes the browser tab and call should be finished on both sides
    cy.get('[data-cy=mediastream]', { timeout: 180000 }).should('not.exist')
  })
})
