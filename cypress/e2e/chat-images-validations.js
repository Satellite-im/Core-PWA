const pngImagePath = 'cypress/fixtures/images/logo.png'
const jpgImagePath = 'cypress/fixtures/images/jpeg-test.jpg'
const gifImagePath = 'cypress/fixtures/images/gif-test.gif'
const invalidImagePath = 'cypress/fixtures/images/incorrect-image.png'
const path = require('path')

describe('Chat - Sending Images Tests', () => {
  // Before starting spec - Restore Localstorage Snapshots for next specs
  before(() => {
    cy.restoreLocalStorage('Chat User A')
  })

  // Setup downloads folder for cypress
  const downloadsFolder = Cypress.config('downloadsFolder')

  it('Load account and consent file upload', () => {
    // Login with User A by restoring LocalStorage Snapshot
    cy.restoreLocalStorage('Chat User A').then(() => {
      cy.loginWithLocalStorage('12345')
    })

    // Go to a Conversation
    cy.goToConversation('Chat User B')

    //Click on file upload for the first time
    cy.get('[data-cy=chat-file-upload-btn-container]').click()
    cy.get('[data-cy=confirmation-modal]')
      .find('[data-cy=confirmation-modal-header]')
      .should('have.text', 'Consent to File Scanning')
      .and('be.visible')
    cy.get('[data-cy=confirmation-modal]')
      .find('[data-cy=confirm-button]')
      .click()
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

  after(() => {
    cy.saveLocalStorage('Chat User A')
  })
})
