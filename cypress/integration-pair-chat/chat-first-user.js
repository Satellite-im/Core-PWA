import { dataRecovery } from '../fixtures/test-data-accounts.json'

const faker = require('faker')
const recoverySeed =
  dataRecovery.accounts
    .filter((item) => item.description === 'Chat Pair A')
    .map((item) => item.recoverySeed) + '{enter}'
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN

describe('Chat features with two accounts at the same time - First User', () => {
  it('Load account from Chat Pair A (first account)', () => {
    //Import first account
    cy.importAccount(randomPIN, recoverySeed)
    //Validate Chat Screen is loaded
    cy.validateChatPageIsLoaded()

    cy.goToConversation('Chat Pair B')
  })

  it('Validate video call show local and remote video', () => {
    cy.get('[data-cy=toolbar-enable-video]')
      .click()
      .then(() => {
        cy.get('[data-cy=mediastream]', { timeout: 180000 }).should(
          'be.visible',
        )
        cy.get('#local-video').should('be.visible')
        cy.get('#remote-video', { timeout: 300000 }).should('be.visible')
      })

    cy.wait(60000)

    cy.get('[data-cy=call-hangup]')
      .click()
      .then(() => {
        cy.get('[data-cy=mediastream]', { timeout: 30000 }).should('not.exist')
      })
  })

  it('Validate that is typing message is displayed', () => {
    cy.contains('typing', { timeout: 180000 }).should('be.visible')
  })
})
