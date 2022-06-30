import { dataRecovery } from '../fixtures/test-data-accounts.json'

const faker = require('faker')
const recoverySeed =
  dataRecovery.accounts
    .filter((item) => item.description === 'Chat Pair A')
    .map((item) => item.recoverySeed) + '{enter}'
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
let urlToValidate = 'https://www.google.com'

describe('Chat features with two accounts at the same time - First User', () => {
  it('Load account from Chat Pair A (first account)', { retries: 2 }, () => {
    //Import first account
    cy.importAccount(randomPIN, recoverySeed)
    //Validate Chat Screen is loaded
    cy.validateChatPageIsLoaded()

    //Open a chat conversation with Chat Pair B
    cy.goToConversation('Chat Pair B')
  })

  //Is typing indicator is displayed
  it('Validate that is typing message is displayed', { retries: 1 }, () => {
    cy.contains('typing', { timeout: 30000 }).should('be.visible')
  })

  //Start of videocall tests
  it('Call to User B', () => {
    //Start videocall
    cy.get('[data-cy=toolbar-enable-audio]').click()
  })

  it('Voice/Video Calling - when receiving a call, should appear an indication waiting for another user to accept', () => {
    //Remote user should have a class calling indicating that its being called
    cy.get('[data-cy=remote-video]')
      .find('[data-cy=media-user-circle]')
      .should('have.class', 'calling')
  })

  it('If user A calls user B doing voice call, video call should be deactivated', () => {
    //Videocall should be displayed on both sides
    cy.get('[data-cy=mediastream]', { timeout: 30000 }).should('be.visible')

    //Validate that video stream from local user is not visible since call started as voice call
    cy.get('[data-cy=local-video]')
      .find('[data-cy=video-stream]')
      .should('not.exist')

    //Validate that video stream from remote user is not visible since call started as voice call
    cy.get('[data-cy=remote-video]')
      .find('[data-cy=video-stream]')
      .should('not.exist')
  })

  it('User should be able to scroll on messages when call modal is open', () => {
    //Go to beginning of chat
    cy.get('[data-cy=chat-message]')
      .first()
      .scrollIntoView()
      .should('be.visible')
  })

  it('Users can send links in chat while in a video/phone call', () => {
    //Send a link in chat
    cy.get('[data-cy=editable-input]').trigger('input').paste({
      pasteType: 'text',
      pastePayload: urlToValidate,
    })
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
    cy.get('[data-cy=swiper-slide]').should('have.class', 'fullscreen-media')

    // Click on exit full screen and and validate that videocall is not on fullscreen mode
    cy.get('[data-cy=exit-fullscreen]').click()
    cy.get('[data-cy=swiper-slide]').should(
      'not.have.class',
      'fullscreen-media',
    )
  })

  it(
    'When the user clicks the video button camera should be enabled',
    { retries: 2 },
    () => {
      // Click on call video button and validate that video-stream is visible
      cy.get('[data-cy=call-video]').click()
      cy.get('[data-cy=video-stream]')
        .should('be.visible')
        .and('have.class', 'loaded')
      cy.get('[data-cy=video-unmuted').should('be.visible')
    },
  )

  it(
    'When the user clicks the video button camera should be disabled until the user enables it again',
    { retries: 1 },
    () => {
      // Click on call video button again and validate that video-stream is muted
      cy.get('[data-cy=call-video]').click()
      cy.get('[data-cy=video-muted').should('be.visible')
      cy.get('[data-cy=video-stream]').should('not.exist')
    },
  )

  it('Should appear an indication when the user is muted on the call', () => {
    //Click on call audio to mute audio
    cy.get('[data-cy=call-audio]').click()
    cy.get('[data-cy=local-video]')
      .find('[data-cy=muted-indicator]')
      .should('be.visible')

    //Click on call audio to unmute audio
    cy.get('[data-cy=call-audio]').click()
    cy.get('[data-cy=local-video]')
      .find('[data-cy=muted-indicator]')
      .should('not.exist')
  })

  it('Users should be able to mute their mic from chat and side menu', () => {
    //Mute mic from chat button
    cy.get('[data-cy=call-audio]').click()
    cy.get('[data-cy=local-video]')
      .find('[data-cy=muted-indicator]')
      .should('be.visible')

    //Unmute audio from call
    cy.get('[data-cy=call-audio]').click()
    cy.get('[data-cy=local-video]')
      .find('[data-cy=muted-indicator]')
      .should('not.exist')

    //Mute mic from side menu
    cy.get('[data-cy=sidebar-mic-button]').click()
    cy.get('[data-cy=local-video]')
      .find('[data-cy=muted-indicator]')
      .should('be.visible')
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
    cy.get('[data-cy=remote-video]')
      .find('[data-cy=muted-indicator]', { timeout: 60000 })
      .should('not.exist')
  })

  it('Remote user can have microphone muted - Mute indicator will be displayed', () => {
    cy.get('[data-cy=remote-video]')
      .find('[data-cy=muted-indicator]', { timeout: 60000 })
      .should('be.visible')
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
    cy.get('[data-cy=local-video]')
      .find('[data-cy=video-stream]')
      .should('be.visible')
      .and('have.class', 'loaded')

    //Video buttons show as unmuted
    cy.get('[data-cy=video-unmuted]').should('be.visible')
    cy.get('[data-cy=sidebar-video-unmuted]').should('be.visible')
  })

  it('Remote user can enable video - Remote camera will be displayed', () => {
    // Remote Camera is loaded
    cy.get('[data-cy=remote-video]')
      .find('[data-cy=video-stream]', { timeout: 60000 })
      .should('be.visible')
      .and('have.class', 'loaded')
  })

  it('Validate video call show local and remote video', () => {
    //Both videos can be displayed at the same time
    // Local Camera is loaded
    cy.get('[data-cy=local-video]')
      .find('[data-cy=video-stream]')
      .should('be.visible')
      .and('have.class', 'loaded')

    // Remote Camera is loaded
    cy.get('[data-cy=remote-video]')
      .find('[data-cy=video-stream]')
      .should('be.visible')
      .and('have.class', 'loaded')
  })

  it('Current user can disable video - Camera will not be displayed and video icon will be red', () => {
    //Disable local camera
    cy.get('[data-cy=call-video]').click()

    // Local Video Stream does not exist in DOM
    cy.get('[data-cy=local-video]')
      .find('[data-cy=video-stream]')
      .should('not.exist')

    //Video buttons show muted
    cy.get('[data-cy=video-muted]').should('be.visible')
    cy.get('[data-cy=sidebar-video-muted]').should('be.visible')
  })

  it('Remote user can disable video - Remote camera will not be displayed', () => {
    // Remote Camera is loaded
    cy.get('[data-cy=remote-video]')
      .find('[data-cy=video-stream]', { timeout: 30000 })
      .should('not.exist')
  })

  it('Current user can screen share - Screen will be displayed instead of camera', () => {
    //Enable screenshare
    cy.get('[data-cy=call-screen-share]').click()

    // Local Screenshare is loaded
    cy.get('[data-cy=local-video]')
      .find('[data-cy=screen-stream]')
      .should('be.visible')
      .and('have.class', 'loaded')

    //Screen share button show enabled
    cy.get('[data-cy=screen-unmuted]').should('be.visible')
  })

  it('Current user can stop screen share - Screen will not be displayed now', () => {
    //Stop sharing screen
    cy.get('[data-cy=call-screen-share]').click()

    // Local Screenshare is not displayed
    cy.get('[data-cy=local-video]')
      .find('[data-cy=screen-stream]')
      .should('not.exist')

    //Screen share button show enabled
    cy.get('[data-cy=screen-muted]').should('be.visible')
  })

  it('Remote screen share - User can see remote screen instead of remote camera', () => {
    // Remote Screenshare is loaded
    cy.get('[data-cy=remote-video]')
      .find('[data-cy=screen-stream]', { timeout: 45000 })
      .should('be.visible')
      .and('have.class', 'loaded')
  })

  it('Remote screen share stopped - User will stop seeing the remote screen', () => {
    // Remote Screenshare is removed
    cy.get('[data-cy=remote-video]')
      .find('[data-cy=screen-stream]', { timeout: 45000 })
      .should('not.exist')
  })

  it('Videocall Settings Indicator - Option is not available yet', () => {
    cy.get('[data-cy=media-settings]')
      .should('be.visible')
      //Changing the validation since data-tooltip is no longer a property of the element
      .find('svg')
      .should('have.attr', 'disabled', 'disabled')
  })

  it('Videocall Audio Indicator - Is displayed in screen', () => {
    cy.get('[data-cy=volume-icon]').should('be.visible').click()
  })

  it('Videocall Audio Indicator - User can see the volume slider', () => {
    cy.get('[data-cy=volume-slider]').should('be.visible')
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
    cy.get('[data-cy=volume-slider]').should('be.visible')

    //Click on volume icon to hide the volume slider
    cy.get('[data-cy=volume-icon]').click()
    cy.get('[data-cy=volume-slider]').should('not.exist')
  })

  it('Live Feed indicator should be displayed again if the user navigates to a different page and then return to a call', () => {
    //Click on sidebar files to go to Files page
    cy.get('[data-cy=sidebar-files]').click()
    cy.get('[data-cy=elapsed-time]').should('not.exist')
    cy.goToConversation('Chat Pair B')

    //Live Indicator should be visible again
    cy.get('[data-cy=elapsed-time]').should('be.visible')
  })

  // Call Finished tests
  it('Finish videocall', () => {
    //Wait 30 seconds before finishing the call
    cy.wait(30000)
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
