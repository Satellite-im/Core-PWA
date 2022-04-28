const faker = require('faker')
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
const recoverySeed =
  'useful wedding venture reopen forest lawsuit essence hamster kitchen bundle level tower{enter}'
let longMessage = faker.random.alphaNumeric(2060) // generate random alphanumeric text with 2060 chars
let urlToValidate = 'https://www.satellite.im'
let urlToValidateTwo = 'http://www.satellite.im'
let urlToValidateThree = 'www.satellite.im'

describe('Chat Text and Sending Links Validations', () => {
  it('Message with more than 2048 chars - Counter get reds', () => {
    //Import account
    cy.importAccount(randomPIN, recoverySeed)

    //Ensure messages are displayed before starting
    cy.validateChatPageIsLoaded()
    cy.goToConversation('cypress friend')
    cy.get('[data-cy=editable-input]')
      .should('be.visible')
      .trigger('input')
      .paste({
        pasteType: 'text',
        pastePayload: longMessage,
      })
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
    cy.validateCharlimit('0/2048', false)
  })

  it('Chat Text Validation - Emoji counts only for 1 char', () => {
    cy.get('[data-cy=editable-input]').trigger('input').type('😄')
    cy.validateCharlimit('1/2048', false)
    cy.get('[data-cy=send-message]').click()
  })

  it('Sending a link with format https://wwww', () => {
    cy.get('[data-cy=editable-input]').trigger('input').paste({
      pasteType: 'text',
      pastePayload: urlToValidate,
    })
    cy.validateCharlimit('24/2048', false)
    cy.get('[data-cy=send-message]').click()
    let locatorURL = 'a[href="' + urlToValidate + '"]'
    cy.get(locatorURL).last().scrollIntoView().should('have.attr', 'href')
  })

  it('Validate link with format https://wwww from chat message redirects to expected URL', () => {
    cy.validateURLOnClick(urlToValidate)
  })

  it('Sending a link with format http://wwww', () => {
    cy.get('[data-cy=editable-input]').trigger('input').paste({
      pasteType: 'text',
      pastePayload: urlToValidateTwo,
    })
    cy.validateCharlimit('23/2048', false)
    cy.get('[data-cy=send-message]').click()
    let locatorURL = 'a[href="' + urlToValidateTwo + '"]'
    cy.get(locatorURL).last().scrollIntoView().should('have.attr', 'href')
  })

  it('Validate link with format http://wwww from chat message redirects to expected URL', () => {
    cy.validateURLOnClick(urlToValidateTwo)
  })

  it('Sending a text with format wwww. will not send it as link', () => {
    cy.get('[data-cy=editable-input]').trigger('input').paste({
      pasteType: 'text',
      pastePayload: urlToValidateThree,
    })
    cy.validateCharlimit('16/2048', false)
    cy.get('[data-cy=send-message]').click()
    cy.contains(urlToValidateThree)
      .last()
      .scrollIntoView()
      .should('not.have.attr', 'href', urlToValidateThree)
  })
})
