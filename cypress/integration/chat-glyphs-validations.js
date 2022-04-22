const faker = require('faker')
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
const recoverySeed =
  'useful wedding venture reopen forest lawsuit essence hamster kitchen bundle level tower{enter}'

describe.skip('Chat - Sending Glyphs Tests', () => {
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
