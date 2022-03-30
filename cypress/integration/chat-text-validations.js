const faker = require('faker')
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
const recoverySeed =
  'veteran intact there despair unique trouble season rebel sort file unit hard{enter}'
let longMessage = faker.random.alphaNumeric(2060) // generate random alphanumeric text with 2060 chars

describe('Chat Text Validations', () => {
  before(() => {
    //Import account
    cy.importAccount(randomPIN, recoverySeed)

    //Ensure messages are displayed before starting
    cy.contains('cypress', { timeout: 180000 }).should('be.visible')
    cy.get('.toggle-sidebar').should('be.visible').click()
  })

  it('Message with more than 2048 chars - Counter get reds', () => {
    cy.waitForMessagesToLoad()
    cy.get('[data-cy=editable-input]')
      .should('be.visible')
      .trigger('input')
      .type(longMessage)
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
  })

  it('Chat Text Validation - Emoji counts only for 1 char', () => {
    cy.get('[data-cy=editable-input]').trigger('input').type('😄')
    cy.validateCharlimit('1/2048', false)
    cy.get('[data-cy=send-message]').click()
  })
})
