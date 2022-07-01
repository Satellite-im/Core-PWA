import { dataRecovery } from '../fixtures/test-data-accounts.json'

const faker = require('faker')
const recoverySeed =
  dataRecovery.accounts
    .filter((item) => item.description === 'Chat Pair B')
    .map((item) => item.recoverySeed) + '{enter}'
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
const longMessage = faker.lorem.words(50) // generate random sentence

describe('Chat features with two accounts at the same time - Second User', () => {
  it('Load account from Chat Pair B (second account)', { retries: 2 }, () => {
    //Import first account
    cy.importAccount(randomPIN, recoverySeed)

    //Validate Chat Screen is loaded
    cy.validateChatPageIsLoaded()

    //Open a chat conversation
    cy.goToConversation('Chat Pair A')
  })

  it('Wait until Chat Pair A account is online to start', () => {
    cy.contains('Chat Pair A is online', { timeout: 300000 }).should(
      'be.visible',
    )
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
    cy.get('[data-cy=incoming-call]', { timeout: 180000 }).should('be.visible')
    cy.wait(5000) //Wait 5 seconds before answering to validate calling status on the other user
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

    //Video buttons show as muted
    cy.get('[data-cy=video-muted]').should('be.visible')
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
    cy.goToConversation('Chat Pair A')
  })

  it('Call again to User A for a fourth time', () => {
    //Wait until Chat Pair A is online again
    cy.contains('Chat Pair A is online', { timeout: 90000 }).should(
      'be.visible',
    )

    //Start videocall
    cy.get('[data-cy=toolbar-enable-audio]').click()

    //Wait 30 seconds and browser tab will be closed automatically when spec finishes running
    cy.wait(30000)
  })
})
