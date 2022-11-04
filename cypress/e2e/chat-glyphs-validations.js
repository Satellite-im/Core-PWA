let secondUserName

describe('Chat - Sending Glyphs Tests', () => {
  before(() => {
    //Retrieve username from Chat User B
    cy.restoreLocalStorage('Chat User B')
    cy.getLocalStorage('Satellite-Store').then((ls) => {
      let tempLS = JSON.parse(ls)
      secondUserName = tempLS.accounts.details.name
    })
  })

  it('Send a glyph on chat', () => {
    // Import account from localstorage
    cy.loginWithLocalStorage('Chat User A')

    // Go to a Conversation
    cy.goToConversation(secondUserName)

    //Send first glyph from Astrobunny pack
    cy.chatFeaturesSendGlyph()

    //Assert glyph sent
    cy.goToLastGlyphOnChat()
  })

  it('Send a glyph after scrolling in the selection screen', () => {
    //Send fourth glyph from Genshin Impact 2 pack
    cy.chatFeaturesSendGlyph(6, 3)

    //Assert glyph sent
    cy.goToLastGlyphOnChat()
  })

  // Skipped since Glyphs recent section removed
  it.skip('Send a glyph from the recents section', () => {
    //Send a glyph from recents section
    cy.get('[data-cy=send-glyph]').click()
    cy.get('[data-cy=glyphs-picker]').should('be.visible')
    cy.get('[data-cy=recent-glyph-item]').first().click()

    //Assert glyph received
    cy.goToLastGlyphOnChat()
  })

  it('Validate glyph pack screen appears', () => {
    cy.goToLastGlyphOnChat().should('be.visible').click()
    cy.validateGlyphsModal()
  })

  it('Validate coming soon modal is displayed on glyph pack screen', () => {
    cy.get('[data-cy=glyphs-modal-view-btn]').click()
    cy.get('[data-cy=modal-cta]').should('be.visible')
    cy.closeModal('[data-cy=modal-cta]')
  })

  it('Validate glyph pack modal can be closed', () => {
    cy.goToLastGlyphOnChat().should('be.visible').click()
    cy.get('[data-cy=glyphs-modal]').should('be.visible')
    cy.closeModal('[data-cy=glyphs-modal]')
  })
})
