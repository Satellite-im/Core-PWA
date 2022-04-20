const faker = require('faker')
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
const recoverySeed =
  'useful wedding venture reopen forest lawsuit essence hamster kitchen bundle level tower{enter}'
const pngImagePath = 'cypress/fixtures/images/logo.png'
const jpgImagePath = 'cypress/fixtures/images/jpeg-test.jpg'
const gifImagePath = 'cypress/fixtures/images/gif-test.gif'
const invalidImagePath = 'cypress/fixtures/images/incorrect-image.png'
const longMessage = faker.random.alphaNumeric(2060) // generate random alphanumeric text with 2060 chars
const urlToValidate = 'https://www.satellite.im'
const urlToValidateTwo = 'http://www.satellite.im'
const urlToValidateThree = 'www.satellite.im'

describe('Chat - Sending Glyphs Tests', () => {
  it('Send a glyph on chat', () => {
    //Import account
    cy.importAccount(randomPIN, recoverySeed)

    //Validate profile name displayed
    cy.validateChatPageIsLoaded()

    //Validate message is sent
    cy.goToConversation('cypress friend')

    //Send first glyph from Astrobunny pack
    cy.chatFeaturesSendGlyph()

    //Assert glyph received
    cy.goToLastGlyphOnChat()
  })

  it('Send a glyph after scrolling in the selection screen', () => {
    //Send fourth glyph from Genshin Impact 2 pack
    cy.chatFeaturesSendGlyph(6, 3)

    //Assert glyph received
    cy.goToLastGlyphOnChat()
  })

  it('Send a glyph from the recents section', () => {
    //Send a glyph from recents section
    cy.get('#glyph-toggle').click()
    cy.get('#glyphs').should('be.visible')
    cy.get('[data-cy=recent-glyph-item]').first().click()
    cy.get('[data-cy=send-message]').click() //sending glyph message

    //Assert glyph received
    cy.goToLastGlyphOnChat()
  })

  it('Validate glyph pack screen appears', () => {
    cy.goToLastGlyphOnChat().should('be.visible').click()
    cy.validateGlyphsModal()
  })

  it('Validate coming soon modal is displayed on glyph pack screen', () => {
    cy.contains('View Glyph Pack').click()
    cy.get('[data-cy=modal-cta]').should('be.visible')
    cy.closeModal('[data-cy=modal-cta]')
  })
})

describe('Chat Features - Images validations', () => {
  it('PNG image is sent succesfully on chat', () => {
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

describe('Chat Features - Text Validations', () => {
  it('Message with more than 2048 chars - Counter get reds', () => {
    cy.get('[data-cy=editable-input]')
      .should('be.visible')
      .trigger('input')
      .paste({
        pasteType: 'text',
        pastePayload: longMessage,
      })
    let expectedMessage = longMessage.length.toString() + '/2048'
    cy.validateCharlimit(expectedMessage, true)
  })

  it('Message with more than 2048 chars - Message will only send the first 2048 chars', () => {
    cy.get('[data-cy=send-message]').click()
    cy.contains(longMessage.slice(0, 2048)).scrollIntoView().should('exist')
    cy.contains(longMessage).should('not.exist')
  })

  it('Attempt to send empty message with a space', () => {
    cy.get('[data-cy=editable-input]').trigger('input').clear().type(' ')
    cy.validateCharlimit('1/2048', false)
    cy.get('[data-cy=send-message]').click()
    cy.get('[data-cy=editable-input]').should('have.text', '')
    cy.validateCharlimit('0/2048', false)
  })

  it('Send empty message by clicking on send icon', () => {
    cy.get('[data-cy=send-message]').click()
    cy.get('[data-cy=editable-input]').should('have.text', '')
    cy.validateCharlimit('0/2048', false)
  })

  it('Chat Text Validation - Space counts only for 1 char', () => {
    cy.get('[data-cy=editable-input]').trigger('input').clear().type(' ')
    cy.validateCharlimit('1/2048', false)
    cy.get('[data-cy=editable-input]').clear()
    cy.validateCharlimit('0/2048', false)
  })

  it('Chat Text Validation - Emoji counts only for 1 char', () => {
    cy.get('[data-cy=editable-input]').trigger('input').type('😄')
    cy.validateCharlimit('1/2048', false)
    cy.get('[data-cy=send-message]').click()
  })

  it('Sending a link with format https://wwww', () => {
    cy.get('[data-cy=editable-input]').trigger('input').type(urlToValidate)
    cy.validateCharlimit('24/2048', false)
    cy.get('[data-cy=send-message]').click()
    let locatorURL = 'a[href="' + urlToValidate + '"]'
    cy.get(locatorURL).last().scrollIntoView().should('have.attr', 'href')
  })

  it('Validate link with format https://wwww from chat message redirects to expected URL', () => {
    cy.validateURLOnClick(urlToValidate)
  })

  it('Sending a link with format http://wwww', () => {
    cy.get('[data-cy=editable-input]').trigger('input').type(urlToValidateTwo)
    cy.validateCharlimit('23/2048', false)
    cy.get('[data-cy=send-message]').click()
    let locatorURL = 'a[href="' + urlToValidateTwo + '"]'
    cy.get(locatorURL).last().scrollIntoView().should('have.attr', 'href')
  })

  it('Validate link with format http://wwww from chat message redirects to expected URL', () => {
    cy.validateURLOnClick(urlToValidateTwo)
  })

  it('Sending a text with format wwww. will not send it as link', () => {
    cy.get('[data-cy=editable-input]').trigger('input').type(urlToValidateThree)
    cy.validateCharlimit('16/2048', false)
    cy.get('[data-cy=send-message]').click()
    cy.contains(urlToValidateThree)
      .last()
      .scrollIntoView()
      .should('not.have.attr', 'href', urlToValidateThree)
  })
})

describe('Chat Features - Top Toolbar', () => {
  it('Chat - Toolbar - Validate audio icon is displayed', () => {
    cy.hoverOnActiveIcon('[data-cy=toolbar-enable-audio]')
  })

  it('Chat - Toolbar - Validate video icon is displayed', () => {
    cy.hoverOnActiveIcon('[data-cy=toolbar-enable-video]')
  })

  it('Chat - Toolbar - Alerts icon shows Coming Soon', () => {
    cy.get('[data-cy=toolbar-alerts]').should('be.visible')
    cy.hoverOnComingSoonIcon(
      '[data-cy=toolbar-alerts] > .tooltip-container',
      'Alerts\nComing Soon',
    )
  })

  it('Chat - Toolbar - Archived Messages icon shows Coming Soon', () => {
    cy.get('[data-cy=toolbar-archived-messages]').should('be.visible')
    cy.hoverOnComingSoonIcon(
      '[data-cy=toolbar-archived-messages] > .tooltip-container',
      'Archived Messages\nComing Soon',
    )
  })

  it('Chat - Toolbar - Marketplace icon is displayed', () => {
    cy.get('[data-cy=toolbar-marketplace]').should('be.visible')
    cy.hoverOnComingSoonIcon('[data-cy=toolbar-marketplace]', 'Marketplace')
  })

  it('Chat - Toolbar - Wallet icon shows Coming Soon', () => {
    cy.get('[data-cy=toolbar-wallet]').should('be.visible')
    cy.hoverOnComingSoonIcon(
      '[data-cy=toolbar-wallet] > .tooltip-container',
      'Wallet\nComing Soon',
    )
  })

  it('Chat - Marketplace - Coming Soon modal content is correct', () => {
    cy.get('[data-cy=toolbar-marketplace]').click()
    cy.validateComingSoonModal()
  })

  it('Chat - Marketplace - Coming Soon modal button has correct URL', () => {
    cy.validateURLComingSoonModal()
  })

  it('Chat - Marketplace - Coming Soon modal can be dismissed', () => {
    cy.closeModal('[data-cy=modal-cta]')
  })

  it('Chat - Glyph Pack screen is displayed', () => {
    cy.chatFeaturesSendGlyph()
    cy.goToLastGlyphOnChat().click()
    cy.validateGlyphsModal()
  })

  it('Chat - Glyph Pack - Coming Soon modal', () => {
    cy.contains('View Glyph Pack').click()
    cy.get('[data-cy=modal-cta]').should('be.visible')
    cy.closeModal('[data-cy=modal-cta]')
  })

  it('Chat - Glyph Pack screen can be dismissed', () => {
    cy.goToLastGlyphOnChat().click()
    cy.get('[data-cy=glyphs-modal]').should('be.visible')
    cy.closeModal('[data-cy=glyphs-modal]')
  })

  it('Chat - Glyphs Selection - Coming soon modal', () => {
    cy.get('#glyph-toggle').click()
    cy.get('[data-cy=glyphs-marketplace]').click()
    cy.get('[data-cy=modal-cta]').should('be.visible')
    cy.closeModal('[data-cy=modal-cta]')
  })
})
