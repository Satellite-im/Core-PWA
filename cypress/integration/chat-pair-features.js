const faker = require('faker')
const recoverySeedAccountOne =
  'memory cherry add return that phrase suit plate ladder earth people gravity{enter}'
const recoverySeedAccountTwo =
  'position few settle fold sister transfer song speed million congress acoustic version{enter}'
const recoverySeedAccountThree =
  'emerge cat innocent buddy install shy topic goddess legend leisure mutual bitter{enter}'
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
const randomMessage = faker.lorem.sentence() // generate random sentence
const randomMessageTwo = faker.lorem.sentence() // generate random sentence
const imageLocalPath = 'cypress/fixtures/images/logo.png'
const fileLocalPath = 'cypress/fixtures/test-file.txt'
const textReply = 'This is a reply to the message'
let glyphURL, imageURL, fileURL

describe.skip('Chat features with two accounts', () => {
  it('Ensure chat window from first account is displayed', () => {
    //Import first account
    cy.importAccount(randomPIN, recoverySeedAccountOne)
    //Validate Chat Screen is loaded
    cy.validateChatPageIsLoaded()
  })

  it('Send emoji to user B', () => {
    cy.goToConversation('Chat User B')
    cy.chatFeaturesSendEmoji('[title="smile"]', '😄')
    cy.get('[data-cy=chat-message] > span')
      .last()
      .scrollIntoView()
      .should('have.text', '😄')
  })

  it('Send message to user B', () => {
    cy.chatFeaturesSendMessage(randomMessage)
    cy.get('[data-cy=chat-message]')
      .contains(randomMessage)
      .last()
      .scrollIntoView()
      .should('exist')
  })

  it('Send glyph to user B', () => {
    cy.chatFeaturesSendGlyph()
    cy.goToLastGlyphOnChat()
      .invoke('attr', 'src')
      .then((glyphSrcValue) => {
        glyphURL = glyphSrcValue
      })
  })

  it('Glyphs messages cannot be edited', () => {
    cy.get('[data-cy=chat-glyph]').last().scrollIntoView()
    cy.validateOptionNotInContextMenu('[data-cy=chat-glyph]', 'Edit')
  })

  it.skip('Send image to user B', () => {
    cy.chatFeaturesSendImage(imageLocalPath, 'logo.png')
    cy.goToLastImageOnChat()
      .invoke('attr', 'src')
      .then((imgSrcValue) => {
        imageURL = imgSrcValue
      })
  })

  it.skip('Image messages cannot be edited', () => {
    cy.validateOptionNotInContextMenu('[data-cy=chat-image]', 'Edit')
  })

  it('Send file to user B', () => {
    cy.chatFeaturesSendFile(fileLocalPath)
    cy.get('[data-cy=chat-file]')
      .last()
      .scrollIntoView()
      .should('exist')
      .invoke('attr', 'href')
      .then((fileSrcValue) => {
        fileURL = fileSrcValue
      })
  })

  it('File messages cannot be edited', () => {
    cy.validateOptionNotInContextMenu('[data-cy=chat-file]', 'Edit')
  })

  it('Ensure chat window from second account is displayed', () => {
    cy.importAccount(randomPIN, recoverySeedAccountTwo)
    cy.validateChatPageIsLoaded()
  })

  it('Assert message received from user A', () => {
    //Adding assertion to validate that messages are displayed
    cy.goToConversation('Chat User A')
    cy.get('[data-cy=chat-message]').last().scrollIntoView().should('exist')
  })

  it('Message not sent by same user cannot be edited', () => {
    cy.get('[data-cy=chat-message]').last().as('lastmessage')
    cy.validateOptionNotInContextMenu('@lastmessage', 'Edit')
  })

  it('User should be able to reply a message', () => {
    cy.get('[data-cy=chat-message]').last().as('lastmessage')
    cy.chatFeaturesReplyMessage('Chat User A', '@lastmessage', textReply)
  })

  it('Reply to message shows as collapsed first', () => {
    //reply path
    cy.getReply(randomMessage)
    cy.get('@reply-preview')
      .scrollIntoView()
      .should('contain', 'Reply from Chat User B')
  })

  it('Reply to message is displayed by clicking on it', () => {
    cy.getReply(randomMessage)
    cy.get('@reply-preview').click()
    cy.get('[data-cy="reply-message"]').should('have.text', textReply)
    cy.get('[data-cy="reply-close"]')
      .should('exist')
      .should('contain', 'Collapse')
  })

  it('Reply to message is not displayed when clicking on Collapse', () => {
    cy.get('[data-cy="reply-close"]').scrollIntoView().click()
    cy.get('[data-cy="reply-message"]').should('not.exist')
    cy.getReply(randomMessage)
    cy.get('@reply-preview').should('exist').scrollIntoView()
  })

  it('Assert emoji received from user A', () => {
    cy.get('[data-cy=chat-message] > span')
      .last()
      .scrollIntoView()
      .should('have.text', '😄')
  })

  it('Assert glyph received from user A', () => {
    cy.goToLastGlyphOnChat()
      .invoke('attr', 'src')
      .then((glyphSecondAccountSrc) => {
        expect(glyphSecondAccountSrc).to.be.eq(glyphURL)
      })
  })

  it.skip('Assert image received from user A', () => {
    cy.goToLastImageOnChat()
      .invoke('attr', 'src')
      .then((imageSecondAccountSrc) => {
        expect(imageSecondAccountSrc).to.be.eq(imageURL)
      })
  })

  it('Assert file received from user A', () => {
    cy.get('[data-cy=chat-file]')
      .last()
      .scrollIntoView()
      .should('exist')
      .invoke('attr', 'href')
      .then((fileSecondAccountSrc) => {
        expect(fileSecondAccountSrc).to.be.eq(fileURL)
      })
  })

  it.skip('Assert timestamp is displayed when user A sends a message', () => {
    cy.get('[data-cy=chat-timestamp]')
      .last()
      .invoke('text')
      .then(($text) => {
        expect($text).to.contain('now')
      })
  })

  it('Add reactions to text message in chat', () => {
    cy.get('[data-cy=chat-message]').last().as('messageToReact')
    cy.reactToChatElement('@messageToReact', '[title="smile"]')
    cy.validateChatReaction('@messageToReact', '😄')
  })

  it.skip('Add reactions to image in chat', () => {
    cy.get('[data-cy=chat-image]').last().as('imageToReact')
    cy.reactToChatElement('@imageToReact', '[title="smile"]')
    cy.validateChatReaction('@imageToReact', '😄')
  })

  it('Add reactions to file in chat', () => {
    cy.get('[data-cy=chat-file]').last().as('fileToReact')
    cy.reactToChatElement('@fileToReact', '[title="smile"]')
    cy.validateChatReaction('@fileToReact', '😄')
  })

  it('Add reactions to glyph in chat', () => {
    cy.get('[data-cy=chat-glyph]').last().as('glyphToReact')
    cy.reactToChatElement('@glyphToReact', '[title="smile"]')
    cy.validateChatReaction('@glyphToReact', '😄')
  })

  it('User should be able to reply without first clicking into the chat bar - Chat User C', () => {
    cy.goToConversation('Chat User C')
    cy.get('[data-cy=editable-input]').should('be.visible').paste({
      pasteType: 'text',
      pastePayload: randomMessage,
    })
    cy.get('[data-cy=editable-input]').clear()
  })

  it('Assert timestamp immediately after sending message', () => {
    //Send a random message
    cy.chatFeaturesSendMessage(randomMessageTwo)

    //Assert timestamp text immediately
    cy.get('[data-cy=chat-timestamp]')
      .last()
      .invoke('text')
      .then(($text) => {
        expect($text).to.contain('now')
      })
  })

  it.skip('Assert timestamp one minute after sending message', () => {
    //Wait for 60 seconds
    cy.wait(60000)

    //Assert timestamp text after a minute has passed
    cy.get('[data-cy=chat-timestamp]')
      .last()
      .invoke('text')
      .then(($text) => {
        let regexTimestamp = '((1[0-2]|0?[1-9]):([0-5][0-9]) ([AaPp][Mm]))'
        expect($text).to.match(regexTimestamp)
      })
  })

  it('Send a message from third account to second account', () => {
    //import Chat User C account
    cy.importAccount(randomPIN, recoverySeedAccountThree)
    cy.validateChatPageIsLoaded()
    //Send a message to Chat User B
    cy.goToConversation('Chat User B')
    cy.chatFeaturesSendMessage(randomMessage)
  })

  it('React to other users reaction', () => {
    //import Chat User A account the one that receive reactions previously
    cy.importAccount(randomPIN, recoverySeedAccountOne)
    cy.validateChatPageIsLoaded()

    //Go to conversation with Chat User B
    cy.goToConversation('Chat User B')

    //Find the last reaction message
    cy.get('[data-cy=chat-message]').last().as('messageReacted')
    //Message reaction should not have blue background image initially. Click on it
    cy.get('@messageReacted')
      .scrollIntoView()
      .parents('[data-cy=message-container]')
      .find('[data-cy=reaction-to-message]')
      .as('reactionToMessage')
    cy.get('@reactionToMessage')
      .should(
        'have.css',
        'background-image',
        'linear-gradient(0deg, rgba(34, 44, 63, 0.5) 0%, rgba(36, 40, 57, 0.5) 100%)',
      )
      .click()

    //Validate count of reactors is two
    cy.get('@reactionToMessage')
      .find('[data-cy=emoji-reaction-count]')
      .should('contain', '2')

    //Validate reaction background image is now blue
    cy.get('@reactionToMessage').should(
      'have.css',
      'background-image',
      'linear-gradient(40deg, rgb(39, 97, 253) 0%, rgb(40, 109, 254) 100%)',
    )
  })
})
