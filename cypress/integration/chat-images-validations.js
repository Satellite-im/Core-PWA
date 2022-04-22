const faker = require('faker')
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
const recoverySeed =
  'useful wedding venture reopen forest lawsuit essence hamster kitchen bundle level tower{enter}'

const pngImagePath = 'cypress/fixtures/images/logo.png'
const jpgImagePath = 'cypress/fixtures/images/jpeg-test.jpg'
const gifImagePath = 'cypress/fixtures/images/gif-test.gif'
const invalidImagePath = 'cypress/fixtures/images/incorrect-image.png'

describe.skip('Chat - Sending Images Tests', () => {
  it('PNG image is sent succesfully on chat', () => {
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

  it('JPG image is sent succesfully on chat', () => {
    //Send JPG Image
    cy.chatFeaturesSendImage(jpgImagePath, 'jpeg-test.jpg')
    cy.goToLastImageOnChat()
  })

  it('GIF image is sent succesfully on chat', () => {
    //Send GIF Image
    cy.chatFeaturesSendImage(gifImagePath, 'gif-test.gif')
    cy.goToLastImageOnChat()
  })

  it.skip('Invalid image is not sent succesfully on chat', () => {
    //Send Invalid Image
    cy.chatFeaturesSendImage(invalidImagePath, 'incorrect-image.png')
    cy.goToLastImageOnChat()
  })
})
