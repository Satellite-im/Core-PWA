const faker = require('faker')
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
const recoverySeed =
  'boring over tilt regret diamond rubber example there fire roof sheriff always{enter}'

describe('Chat Features Tests', () => {
  before(() => {
    //Import account
    cy.importAccount(randomPIN, recoverySeed)

    //Ensure messages are displayed before starting
    cy.contains('sadad', { timeout: 180000 }).should('be.visible')
    cy.get('.toggle-sidebar').should('be.visible').click()
    cy.waitForMessagesToLoad()
  })

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
})
