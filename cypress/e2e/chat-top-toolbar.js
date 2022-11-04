let secondUserName

describe('Chat Toolbar Tests', () => {
  before(() => {
    //Retrieve username from Chat User B
    cy.restoreLocalStorage('Chat User B')
    cy.getLocalStorage('Satellite-Store').then((ls) => {
      let tempLS = JSON.parse(ls)
      secondUserName = tempLS.accounts.details.name
    })
  })

  it('Chat - Toolbar - Load Account for Testing Scenarios', () => {
    // Login with User A by restoring LocalStorage Snapshot
    cy.loginWithLocalStorage('Chat User A')

    // Validate message is sent
    cy.goToConversation(secondUserName)
  })

  it('Chat - Toolbar - Audio icon is active', () => {
    //Start validations
    cy.hoverOnActiveIcon(
      '[data-cy=toolbar-enable-audio]',
      'Offline calling unavailable',
    )
  })

  it('Chat - Toolbar - Marketplace icon shows Coming Soon', () => {
    cy.hoverOnComingSoonIcon(
      '[data-cy=toolbar-marketplace]',
      'Marketplace (Coming Soon)',
    )
  })

  it('Chat - Toolbar - Wallet icon shows Coming Soon', () => {
    cy.hoverOnComingSoonIcon('[data-cy=toolbar-wallet]', 'Wallet (Coming Soon)')
  })

  it('Chat - Toolbar - Search Bar shows Coming Soon', () => {
    cy.hoverOnComingSoonIcon('[data-cy=chat-search-input]', 'Coming Soon', true)
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

  // Skipped since glyphs marketplace was removed from glyphs modal
  it.skip('Chat - Glyphs Selection - Coming soon modal', () => {
    cy.get('[data-cy=send-glyph]').click()
    cy.get('[data-cy=glyphs-marketplace]').click()
    cy.get('[data-cy=modal-cta]').should('be.visible')
    cy.closeModal('[data-cy=modal-cta]')
  })
})
