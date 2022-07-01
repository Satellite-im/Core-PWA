import { dataRecovery } from '../fixtures/test-data-accounts.json'

const faker = require('faker')
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
const recoverySeed =
  dataRecovery.accounts
    .filter((item) => item.description === 'Only Text')
    .map((item) => item.recoverySeed) + '{enter}'
let longMessage = faker.random.alphaNumeric(2060) // generate random alphanumeric text with 2060 chars
const randomMessage = faker.lorem.sentence() // generate random sentence
const randomURL = faker.internet.url() // generate random url
let urlToValidate = 'https://www.google.com'
let urlToValidateTwo = 'http://www.google.com'
let urlToValidateThree = 'www.google.com'

describe('Chat Text and Sending Links Validations', () => {
  it('Load account for validation', { retries: 2 }, () => {
    //Import account
    cy.importAccount(randomPIN, recoverySeed)

    //Ensure messages are displayed before starting
    cy.validateChatPageIsLoaded()
    cy.goToConversation('Only Text Friend')
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

  it('Message with more than 2048 chars - Message will not be sent', () => {
    // Attempt to send the message and ensure that send message button is disabled
    cy.get('[data-cy=send-message]').should('have.attr', 'disabled')

    // Message will not be send and editable input will keep the previous message
    cy.get('[data-cy=editable-input]', { timeout: 30000 }).should(
      'have.text',
      longMessage,
    )

    //Charlimit will continue to be red since message was not sent
    let expectedMessage = longMessage.length.toString() + '/2048'
    cy.validateCharlimit(expectedMessage, true)

    //Attempt to send message again now by pressing ENTER key
    cy.get('[data-cy=editable-input]').trigger('input').type('{enter}')

    // Message will not be send and editable input will keep the previous message
    cy.get('[data-cy=editable-input]', { timeout: 30000 }).should(
      'have.text',
      longMessage,
    )

    //Charlimit will continue to be red since message was not sent
    cy.validateCharlimit(expectedMessage, true)

    // Clear editable input for next tests
    cy.get('[data-cy=editable-input]').trigger('input').clear()
  })

  it('Attempt to send empty message with a space', () => {
    cy.get('[data-cy=editable-input]')
      .trigger('input')
      .clear()
      .type(' ')
      .should('have.text', ' ')
    cy.validateCharlimit('1/2048', false)
    cy.get('[data-cy=send-message]').click()

    //Message with only empty space is not sent
    cy.get('[data-cy=editable-input]').should('have.text', ' ')
    cy.validateCharlimit('1/2048', false)

    //Clear input for next test
    cy.get('[data-cy=editable-input]').trigger('input').clear()
  })

  it('Send empty message by clicking on send icon', () => {
    //Empty message is not sent
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

  it('Chat Text Validation - Emoji counts for 2 chars', () => {
    cy.get('[data-cy=editable-input]').trigger('input').type('😄')
    cy.validateCharlimit('2/2048', false)
    cy.get('[data-cy=send-message]').click()
    // Wait until loading indicator disappears
    cy.get('[data-cy=loading-indicator]', { timeout: 30000 }).should(
      'not.exist',
    )
    cy.get('[data-cy=chat-message]').last().scrollIntoView()
  })

  it('Sending a link with format https://wwww', () => {
    cy.get('[data-cy=editable-input]').trigger('input').paste({
      pasteType: 'text',
      pastePayload: urlToValidate,
    })
    cy.get('[data-cy=editable-input]', { timeout: 30000 }).should(
      'have.text',
      urlToValidate,
    )
    cy.validateCharlimit('22/2048', false)
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
    cy.get('[data-cy=editable-input]', { timeout: 30000 }).should(
      'have.text',
      urlToValidateTwo,
    )
    cy.validateCharlimit('21/2048', false)
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
    cy.get('[data-cy=editable-input]', { timeout: 30000 }).should(
      'have.text',
      urlToValidateThree,
    )
    cy.validateCharlimit('14/2048', false)
    cy.get('[data-cy=send-message]').click()
    cy.get('[data-cy=chat-message]')
      .last()
      .then(($message) => {
        cy.getAttached($message)
          .scrollIntoView()
          .should('not.have.attr', 'href', urlToValidateThree)
      })
  })

  it('User should be able to use markdown *test* to make a text italic in chat', () => {
    cy.sendMessageWithMarkdown(randomMessage, '*')
  })

  it('User should be able to use markdown _test_ to make a text italic in chat', () => {
    cy.sendMessageWithMarkdown(randomMessage, '_')
  })

  it('User should be able to use markdown **test** to make a text bold in chat', () => {
    cy.sendMessageWithMarkdown(randomMessage, '**')
  })

  it('User should be able to use markdown __test__ to underscore a text in chat', () => {
    cy.sendMessageWithMarkdown(randomMessage, '__')
  })

  // prettier-ignore
  // added prettier-ignore due to prettier removing the \ below
  it('User should be able to use a single backslash to escape a markdown char in chat', () => {
    cy.chatFeaturesSendMessage('\*To Do', false)
    cy.get('[data-cy=chat-message]')
      .last()
      .scrollIntoView()
      .should('have.text', '*To Do')
  })
  // prettier-ignore
  // added prettier-ignore due to prettier removing the \ below
  it('User should be able to use double backslash  to write a single backslash in chat', () => {
    cy.chatFeaturesSendMessage('\\To Do', false)
    cy.get('[data-cy=chat-message]')
      .last()
      .scrollIntoView()
      .should('have.text', '\\To Do') // expected is only one backslash but cypress use one as escape char
  })

  it('User should be able to use markdown ` to send text as code', () => {
    cy.sendMessageWithMarkdown(randomMessage, '`')
  })

  it('User should be able to use markdown "***" to use combined bold/italics', () => {
    cy.sendMessageWithMarkdown(randomMessage, '***')
  })

  it('User should be able to use markdown "~~" to put a strikethrough a text in chat', () => {
    cy.sendMessageWithMarkdown(randomMessage, '~~')
  })

  it('User should use markdown "<>" to insert an autolink', () => {
    let locatorURL = 'a[href="' + randomURL + '"]'
    let autolink = '<' + randomURL + '>'
    cy.chatFeaturesSendMessage(autolink, false)
    cy.get(locatorURL)
      .last()
      .then(($message) => {
        cy.getAttached($message)
          .scrollIntoView()
          .should('have.attr', 'href', randomURL)
          .and('have.text', randomURL)
      })
  })

  it('User should use markdown "||" to insert an spoiler', () => {
    cy.sendMessageWithMarkdown(randomMessage, '||')
  })
})
