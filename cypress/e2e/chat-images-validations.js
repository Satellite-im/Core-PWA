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
const path = require('path')

describe('Chat - Sending Images Tests', () => {
  const downloadsFolder = Cypress.config('downloadsFolder')
  it('Load account for test chat images scenarios', { retries: 2 }, () => {
    //Import account
    cy.importAccount(randomPIN, recoverySeed)

    //Validate profile name displayed
    cy.validateChatPageIsLoaded()

    //Validate message is sent
    cy.goToConversation('cypress friend')
  })

  it('PNG image is sent successfully on chat', () => {
    //Send PNG Image
    cy.chatFeaturesSendImage(pngImagePath, 'logo.png')
    cy.goToLastImageOnChat(90000) // first image sent takes more time
  })

  it('JPG image is sent successfully on chat', () => {
    //Send JPG Image
    cy.chatFeaturesSendImage(jpgImagePath, 'jpeg-test.jpg')
    cy.goToLastImageOnChat(30000)
  })

  it('Save Image from Chat', () => {
    // Go to last image (jpeg), right click and select on context menu Save Image
    cy.goToLastImageOnChat(30000).as('lastImage')
    cy.selectContextMenuOption('@lastImage', 'Save Image')
    // Assert image was downloaded in downloads folder with the same name
    const downloadedFile = path.join(downloadsFolder, 'jpeg-test.jpg')
    cy.readFile(downloadedFile, { timeout: 15000 }).should('exist')
  })

  it('GIF image is sent successfully on chat', () => {
    //Send GIF Image
    cy.chatFeaturesSendImage(gifImagePath, 'gif-test.gif')
    cy.goToLastImageOnChat()
  })

  it('Invalid image is not sent successfully on chat', () => {
    //Send Invalid Image and validate that image placeholder is visible instead of image
    //Ensure that Image failed to load text is displayed
    cy.chatFeaturesSendImage(invalidImagePath, 'incorrect-image.png')
    cy.get('[data-cy=chat-image-placeholder]')
      .last()
      .scrollIntoView()
      .should('be.visible')
    cy.get('[data-cy=image-placeholder-caption]').should(
      'contain',
      'Image failed to load',
    )
  })
})
