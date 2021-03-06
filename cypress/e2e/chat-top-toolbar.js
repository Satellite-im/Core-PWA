import { dataRecovery } from '../fixtures/test-data-accounts.json'

const faker = require('faker')
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
const recoverySeed =
  dataRecovery.accounts
    .filter((item) => item.description === 'cypress')
    .map((item) => item.recoverySeed) + '{enter}'

describe('Chat Toolbar Tests', () => {
  it(
    'Chat - Toolbar - Load Account for Testing Scenarios',
    { retries: 2 },
    () => {
      //Import account
      cy.importAccount(randomPIN, recoverySeed)

      //Ensure messages are displayed before starting
      cy.validateChatPageIsLoaded()
      cy.goToConversation('cypress friend')
    },
  )

  it('Chat - Toolbar - Audio icon is active', () => {
    //Start validations
    cy.hoverOnActiveIcon(
      '[data-cy=toolbar-enable-audio]',
      'Offline calling unavailable',
    )
  })

  it('Chat - Toolbar - Alerts icon is active', () => {
    cy.hoverOnActiveIcon('[data-cy=toolbar-alerts]', 'Alerts')
  })

  it('Chat - Toolbar - Archived Messages icon shows Coming Soon', () => {
    cy.hoverOnComingSoonIcon(
      '[data-cy=toolbar-archived-messages]',
      'Archived Messages Coming Soon',
    )
  })

  it('Chat - Toolbar - Marketplace icon shows Coming Soon', () => {
    cy.hoverOnComingSoonIcon(
      '[data-cy=toolbar-marketplace]',
      'Marketplace Coming soon',
    )
  })

  it('Chat - Toolbar - Wallet icon shows Coming Soon', () => {
    cy.hoverOnComingSoonIcon('[data-cy=toolbar-wallet]', 'Wallet Coming Soon')
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
