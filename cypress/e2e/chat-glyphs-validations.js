describe('Chat - Sending Glyphs Tests', () => {
  before(() => {
    // Restore Localstorage Snapshots for next specs
    cy.restoreLocalStorage('Chat User A')
  })
  it('Send a glyph on chat', { retries: 2 }, () => {
    // Import account from localstorage
    cy.loginWithLocalStorage('Chat User A', '12345')

    // Go to a Conversation
    cy.goToConversation('Chat User B')

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

  it('Send a glyph from the recents section', () => {
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

  //Skipped until bug #5069 - Modals extra close icon is fixed
  it.skip('Validate glyph pack modal can be closed', () => {
    cy.goToLastGlyphOnChat().should('be.visible').click()
    cy.get('[data-cy=glyphs-modal]').should('be.visible')
    cy.closeModal('[data-cy=glyphs-modal]').then(() => {
      cy.get('[data-cy=glyphs-modal]').should('not.exist')
    })
  })
})
