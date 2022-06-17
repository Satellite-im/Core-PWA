import { dataRecovery } from '../fixtures/test-data-accounts.json'

const faker = require('faker')
const recoverySeed =
  dataRecovery.accounts
    .filter((item) => item.description === 'Chat Pair B')
    .map((item) => item.recoverySeed) + '{enter}'
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN

describe('Chat features with two accounts at the same time - Second User', () => {
  it('Load account from Chat Pair B (second account)', () => {
    //Import first account
    cy.importAccount(randomPIN, recoverySeed)

    //Validate Chat Screen is loaded
    cy.validateChatPageIsLoaded()

    //Open a chat conversation
    cy.goToConversation('Chat Pair A')
  })

  it('Receive Incoming Video Call', () => {
    //Click on toggle sidebar to display sidebar
    cy.get('[data-cy=toggle-sidebar]').click()

    //Answer remote videocall
    cy.get('[data-cy=incoming-call]', { timeout: 180000 }).should('be.visible')
    cy.get('[data-cy=incoming-call-accept]').click()

    //Wait until all validations from other user are completed
    cy.wait(30000)
  })

  it('Mute microphone', () => {
    //Click again on button to mute mic from chat button
    cy.get('[data-cy=call-audio]').click()

    // Microphone buttons from chat screen and sidebar will show as muted
    cy.get('[data-cy=audio-muted]').should('be.visible')
    cy.get('[data-cy=sidebar-mic-muted]').should('be.visible')
  })

  it('Enable camera', () => {
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
    cy.wait(30000)
  })

  it('Disable camera', () => {
    //Turn off local camera
    cy.get('[data-cy=call-video]').click()

    // Local Camera is not loaded
    cy.get('[data-cy=local-video]')
      .find('[data-cy=video-stream]')
      .should('not.exist')

    //Video buttons show as unmuted
    cy.get('[data-cy=video-unmuted]').should('be.visible')
    cy.get('[data-cy=sidebar-video-muted]').should('be.visible')
    cy.wait(30000)
  })

  it('Enable screenshare', () => {
    //Enable screenshare
    cy.get('[data-cy=call-screen-share]').click()

    // Local Screenshare is loaded
    cy.get('[data-cy=local-video]')
      .find('[data-cy=screen-stream]')
      .should('be.visible')
      .and('have.class', 'loaded')

    //Screen share button show enabled
    cy.get('[data-cy=screen-unmuted]').should('be.visible')
    cy.wait(30000)
  })

  it('Disable screenshare', () => {
    //Disable screenshare
    cy.get('[data-cy=call-screen-share]').click()

    // Local Screenshare is no longer visible
    cy.get('[data-cy=local-video]')
      .find('[data-cy=screen-stream]')
      .should('not.exist')

    //Screen share button show enabled
    cy.get('[data-cy=screen-muted]').should('be.visible')
    cy.wait(30000)
  })

  it('Call finished on remote side should end call in local side', () => {
    cy.get('[data-cy=mediastream]', { timeout: 30000 }).should('not.exist')
  })

  it('Type a long message in chat bar without sending it', () => {
    //Type a long message
    cy.get('[data-cy=editable-input]')
      .should('be.visible')
      .trigger('input')
      .type(longMessage)
      .clear()
  })

  it('Call to User A for a second time', () => {
    //Start videocall
    cy.get('[data-cy=toolbar-enable-audio]')
      .click()
      .then(() => {
        cy.get('[data-cy=mediastream]').should('be.visible')
      })
    cy.wait(30000)
  })

  it('Refresh tab to finish the videocall', () => {
    //Refresh page
    cy.reload()

    //Validate Chat Screen is loaded again after refreshing
    cy.validateChatPageIsLoaded()

    //Go to conversation
    cy.goToConversation('Chat Pair A')
  })

  it('Call again to User A for a third time', () => {
    //Start videocall
    cy.get('[data-cy=toolbar-enable-audio]')
      .click()
      .then(() => {
        cy.get('[data-cy=mediastream]').should('be.visible')
      })

    //Wait 30 seconds and browser tab will be closed automatically when spec finishes running
    cy.wait(30000)
  it.skip('Type a long message in chat bar without sending it', () => {
    //Attempt 3 times to ensure that if second account loads before, first account will see the typing indicator
    for (let times = 0; times < 3; times++) {
      cy.get('[data-cy=editable-input]')
        .should('be.visible')
        .trigger('input')
        .type(longMessage)
        .clear()
    }
  })
})
