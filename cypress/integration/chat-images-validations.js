import { dataRecovery } from '../fixtures/test-data-accounts.json'

const faker = require('faker')
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
const recoverySeed =
  dataRecovery.accounts
    .filter((item) => item.description === 'cypress')
    .map((item) => item.recoverySeed) + '{enter}'
const pngImagePath = 'cypress/fixtures/images/logo.png'
const jpgImagePath = 'cypress/fixtures/images/jpeg-test.jpg'
const gifImagePath = 'cypress/fixtures/images/gif-test.gif'
const invalidImagePath = 'cypress/fixtures/images/incorrect-image.png'

describe.skip('Chat - Sending Images Tests', () => {
  it('PNG image is sent successfully on chat', { retries: 2 }, () => {
    //Import account
    cy.importAccount(randomPIN, recoverySeed)

    //Validate profile name displayed
    cy.validateChatPageIsLoaded()

    //Validate message is sent
    cy.goToConversation('cypress friend')

    //Send PNG Image
    cy.chatFeaturesSendImage(pngImagePath, 'logo.png')
    cy.goToLastImageOnChat()
  })

  it('JPG image is sent successfully on chat', () => {
    //Send JPG Image
    cy.chatFeaturesSendImage(jpgImagePath, 'jpeg-test.jpg')
    cy.goToLastImageOnChat()
  })

  it('GIF image is sent successfully on chat', () => {
    //Send GIF Image
    cy.chatFeaturesSendImage(gifImagePath, 'gif-test.gif')
    cy.goToLastImageOnChat()
  })

  it.skip('Invalid image is not sent successfully on chat', () => {
    //Send Invalid Image
    cy.chatFeaturesSendImage(invalidImagePath, 'incorrect-image.png')
    cy.goToLastImageOnChat()
  })
})
