const faker = require('faker')
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
const recoverySeed =
  'boring over tilt regret diamond rubber example there fire roof sheriff always{enter}'

describe('Chat Features Tests', () => {
  before(() => {
    //Import account
    cy.importAccount(randomPIN, recoverySeed)

    //Validate profile name displayed
    cy.chatFeaturesProfileName('sadad')

    // Click on hamburger menu if width < height
    cy.get('.toggle-sidebar').should('be.visible').click()

    //Validate message is sent
    cy.waitForMessagesToLoad()
  })

  it('Chat - Toolbar - Validate expected icons are displayed', () => {
    cy.get('[data-cy=toolbar-alerts]').should('be.visible')
    cy.get('[data-cy=toolbar-enable-audio]').should('be.visible')
    cy.get('[data-cy=toolbar-enable-video]').should('be.visible')
    cy.get('[data-cy=toolbar-archived-messages]').should('be.visible')
    cy.get('[data-cy=toolbar-marketplace]').should('be.visible')
    cy.get('[data-cy=toolbar-wallet]').should('be.visible')
  })

  it('Chat - Toolbar - Alerts icon shows Coming Soon', () => {
    cy.hoverOnActiveIcon(
      '[data-cy=toolbar-alerts] > .tooltip-container',
      'Alerts\nComing Soon',
    )
  })

  it('Chat - Toolbar - Call icon is disabled', () => {
    cy.validateDisabledIcon('[data-cy=toolbar-enable-audio]')
  })

  it('Chat - Toolbar - Video icon is disabled', () => {
    cy.validateDisabledIcon('[data-cy=toolbar-enable-video]')
  })

  it('Chat - Toolbar - Archived Messages icon shows Coming Soon', () => {
    cy.hoverOnActiveIcon(
      '[data-cy=toolbar-archived-messages] > .tooltip-container',
      'Archived Messages\nComing Soon',
    )
  })

  it('Chat - Toolbar - Marketplace icon shows Coming Soon', () => {
    cy.hoverOnActiveIcon(
      '[data-cy=toolbar-marketplace] > .tooltip-container',
      'Marketplace\nComing Soon',
    )
  })

  it('Chat - Toolbar - Wallet icon shows Coming Soon', () => {
    cy.hoverOnActiveIcon(
      '[data-cy=toolbar-wallet] > .tooltip-container',
      'Wallet\nComing Soon',
    )
  })
})
