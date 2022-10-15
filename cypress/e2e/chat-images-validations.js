const pngImagePath = 'cypress/fixtures/images/logo.png'
const jpgImagePath = 'cypress/fixtures/images/jpeg-test.jpg'
const gifImagePath = 'cypress/fixtures/images/gif-test.gif'
const invalidImagePath = 'cypress/fixtures/images/incorrect-image.png'
const path = require('path')
let secondUserName

// Skipping due to errors on file uploads - file is missing
describe.skip('Chat - Sending Images Tests', () => {
  before(() => {
    //Retrieve username from Chat User B
    cy.restoreLocalStorage('Chat User B')
    cy.getLocalStorage('Satellite-Store').then((ls) => {
      let tempLS = JSON.parse(ls)
      secondUserName = tempLS.accounts.details.name
    })
  })

  // Setup downloads folder for cypress
  const downloadsFolder = Cypress.config('downloadsFolder')
  it('Load account and consent file upload', () => {
    // Login with User A by restoring LocalStorage Snapshot
    cy.loginWithLocalStorage('Chat User A')

    // Go to a Conversation
    cy.goToConversation(secondUserName)

    //Click on file upload for the first time
    cy.get('[data-cy=chat-file-upload-btn-container]').click()
    cy.consentFileScanning()
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
    cy.wait(1000) // wait one second until last image is loaded
    cy.goToLastImageOnChat(30000).as('lastImage')
    cy.selectContextMenuOption('@lastImage', 'Save Image')
    // Assert image was downloaded in downloads folder with the same name
    const downloadedFile = path.join(downloadsFolder, 'jpeg-test.jpg')
    cy.readFile(downloadedFile, { timeout: 15000 }).should('exist')
  })

  it.skip('GIF image is sent successfully on chat', () => {
    // Skipping for now since GIF upload from file of 5mb fails
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
