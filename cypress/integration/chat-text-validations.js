import { dataRecovery } from '../fixtures/test-data-accounts.json'

const faker = require('faker')
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
const recoverySeed =
  dataRecovery.accounts
    .filter((item) => item.description === 'cypress')
    .map((item) => item.recoverySeed) + '{enter}'
let longMessage = faker.random.alphaNumeric(2060) // generate random alphanumeric text with 2060 chars
const randomMessage = faker.lorem.sentence() // generate random sentence
const randomURL = faker.internet.url() // generate random url
let urlToValidate = 'https://www.satellite.im'
let urlToValidateTwo = 'http://www.satellite.im'
let urlToValidateThree = 'www.satellite.im'

describe('Chat Text and Sending Links Validations', () => {
  it('Load account for validation', { retries: 1 }, () => {
    //Import account
    cy.importAccount(randomPIN, recoverySeed)

    //Ensure messages are displayed before starting
    cy.validateChatPageIsLoaded()
    cy.goToConversation('cypress friend')
  })

  it('Message with more than 2048 chars - Counter get reds', () => {
    cy.get('[data-cy=editable-input]')
      .should('be.visible')
      .trigger('input')
      .paste({
        pasteType: 'text',
        pastePayload: longMessage,
      })
    cy.get('[data-cy=editable-input]', { timeout: 30000 }).should(
      'have.text',
      longMessage,
    )
    let expectedMessage = longMessage.length.toString() + '/2048'
    cy.validateCharlimit(expectedMessage, true)
  })

  it('Message with more than 2048 chars - Message will only send the first 2048 chars', () => {
    cy.get('[data-cy=send-message]').click()
    cy.contains(longMessage.slice(0, 2048)).scrollIntoView().should('exist')
    cy.contains(longMessage).should('not.exist')
  })

  it('Attempt to send empty message with a space', () => {
    cy.get('[data-cy=editable-input]')
      .trigger('input')
      .clear()
      .type(' ')
      .should('have.text', ' ')
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
    cy.get('[data-cy=editable-input]')
      .trigger('input')
      .clear()
      .type(' ')
      .should('have.text', ' ')
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
    cy.get('[data-cy=editable-input]', { timeout: 20000 }).should(
      'have.text',
      urlToValidate,
    )
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
    cy.get('[data-cy=editable-input]', { timeout: 20000 }).should(
      'have.text',
      urlToValidateTwo,
    )
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
    cy.get('[data-cy=editable-input]', { timeout: 20000 }).should(
      'have.text',
      urlToValidateThree,
    )
    cy.validateCharlimit('16/2048', false)
    cy.get('[data-cy=send-message]').click()
    cy.contains(urlToValidateThree)
      .last()
      .scrollIntoView()
      .should('not.have.attr', 'href', urlToValidateThree)
  })

  it('User should be able to use markdown "*" to make a word italic in chat', () => {
    cy.sendMessageWithMarkdown(randomMessage, '*')
  })

  it('User should be able to use markdown "_" to make a word italic in chat', () => {
    cy.sendMessageWithMarkdown(randomMessage, '_')
  })

  it('User should be able to use markdown "**" to make a word bold in chat', () => {
    cy.sendMessageWithMarkdown(randomMessage, '**')
  })

  it('User should be able to use markdown "__" to put an underscore on a word in chat', () => {
    cy.sendMessageWithMarkdown(randomMessage, '__')
  })

  it('User should be able to use "" to escape in chat', () => {
    cy.chatFeaturesSendMessage('*To Do', false)
    cy.get('[data-cy=chat-message]')
      .last()
      .scrollIntoView()
      .should('have.text', '*To Do')
  })

  it('User should be able to use "\\" to write a single "" in chat', () => {
    cy.chatFeaturesSendMessage('\\*To Do', false)
    cy.get('[data-cy=chat-message]')
      .last()
      .scrollIntoView()
      .should('have.text', '*To Do')
  })

  it('User should be able to use markdown ` to code with single', () => {
    cy.sendMessageWithMarkdown(randomMessage, '`')
  })

  it('User should be able to use markdown "***" to use combined bold/italics', () => {
    cy.sendMessageWithMarkdown(randomMessage, '***')
  })

  it('User should be able to use markdown "~~" to put a strikethrough a word in chat', () => {
    cy.sendMessageWithMarkdown(randomMessage, '~~')
  })

  it('User should use markdown "<>" to insert an autolink', () => {
    let locatorURL = 'a[href="' + randomURL + '"]'
    let autolink = '<' + randomURL + '>'
    cy.chatFeaturesSendMessage(autolink, false)
    cy.get(locatorURL).last().scrollIntoView().should('have.attr', 'href')
  })

  it('User should use markdown "||" to insert an spoiler', () => {
    cy.sendMessageWithMarkdown(randomMessage, '||')
  })
})
