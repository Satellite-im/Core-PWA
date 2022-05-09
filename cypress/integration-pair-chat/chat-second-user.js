const faker = require('faker')
const recoverySeed =
  'sword dad network author move fault web mimic develop drill cancel warfare{enter}'
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
const longMessage = faker.lorem.words(250) // generate random sentence

describe('Chat features with two accounts at the same time - Second User', () => {
  it('Load account from Chat Pair B (second account)', () => {
    //Import first account
    cy.importAccount(randomPIN, recoverySeed)
    //Validate Chat Screen is loaded
    cy.validateChatPageIsLoaded()

    cy.goToConversation('Chat Pair A')
  })

  it('Receive Incoming Video Call', () => {
    cy.get('[data-cy=incoming-call]', { timeout: 180000 }).should('be.visible')
  })

  it('Answer Incoming Video Call', () => {
    cy.get('[data-cy=incoming-call-accept-video]')
      .should('be.visible')
      .click()
      .then(() => {
        cy.get('[data-cy=mediastream]', { timeout: 60000 }).should('be.visible')
        cy.get('#local-video').should('be.visible')
        cy.wait(60000)
        cy.get('[data-cy=mediastream]', { timeout: 60000 }).should('not.exist')
      })
  })

  it('Type a long message in chat bar without sending it', () => {
    //Attempt 3 times to ensure that if second account loads before, first account will see the typing indicator
    for (let times = 0; times < 3; times++) {
      cy.get('[data-cy=editable-input]')
        .should('be.visible')
        .trigger('input')
        .type(longMessage)
        .clear()
    }
  })
})
