const faker = require('faker')
const randomMessage = faker.lorem.sentence() // generate random sentence
const randomMessageTwo = faker.lorem.sentence() // generate a second random sentence
const imageLocalPath = 'cypress/fixtures/images/logo.png'
const fileLocalPath = 'cypress/fixtures/test-file.txt'
let glyphURL,
  imageURL,
  fileURL,
  messageTimestamp,
  messageTimestampPast,
  firstUserName,
  secondUserName,
  thirdUserName
const textReply = 'This is a reply to the message'

describe('Chat pair features with Chat User A  - Part 1', () => {
  before(() => {
    //Retrieve username from Chat User B and Chat User C
    cy.restoreLocalStorage('Chat User B')
    cy.getLocalStorage('Satellite-Store').then((ls) => {
      let tempLS = JSON.parse(ls)
      secondUserName = tempLS.accounts.details.name
    })
    //Retrieve username from Chat User B and Chat User C
    cy.restoreLocalStorage('Chat User C')
    cy.getLocalStorage('Satellite-Store').then((ls) => {
      let tempLS = JSON.parse(ls)
      thirdUserName = tempLS.accounts.details.name
    })
  })

  it('Ensure chat window from first account is displayed', () => {
    // Login with User A by restoring LocalStorage Snapshot
    cy.loginWithLocalStorage('Chat User A')

    // Go to a Conversation
    cy.goToConversation(secondUserName)
  })

  it('Send message to user B', () => {
    //Send message
    cy.chatFeaturesSendMessage(randomMessage)

    // Obtain timestamps from chat message
    cy.getTimestamp('now').then((value) => {
      messageTimestamp = value
    })
    cy.getTimestamp('past').then((value) => {
      messageTimestampPast = value
    })

    //Go to last chat message
    cy.get('[data-cy=chat-message]')
      .contains(randomMessage)
      .last()
      .scrollIntoView()
      .should('exist')
  })

  it('Send emoji to user B', () => {
    cy.chatFeaturesSendEmoji('[title="smile"]', '😄')
    cy.get('[data-cy=chat-message] > span')
      .last()
      .scrollIntoView()
      .should('have.text', '😄')
  })

  it('Context Menu Options - Text Message', () => {
    let optionsMessage = [
      'Add Reaction',
      'Reply',
      'Copy Message',
      'Edit Message',
    ]
    cy.get('[data-cy=chat-message]')
      .contains(randomMessage)
      .last()
      .as('lastMessage')
    cy.validateAllOptionsInContextMenu('@lastMessage', optionsMessage)
  })

  it('Send glyph to user B', () => {
    cy.chatFeaturesSendGlyph()
    cy.goToLastGlyphOnChat()
      .invoke('attr', 'src')
      .then((glyphSrcValue) => {
        glyphURL = glyphSrcValue
      })
  })

  it('Context Menu Options - Glyph Message', () => {
    let optionsGlyph = ['Add Reaction', 'Reply']
    cy.get('[data-cy=chat-glyph]').last().as('lastGlyph')
    cy.validateAllOptionsInContextMenu('@lastGlyph', optionsGlyph)
  })

  it('Glyphs messages cannot be edited', () => {
    cy.get('[data-cy=chat-glyph]').last().scrollIntoView()
    cy.validateOptionNotInContextMenu('[data-cy=chat-glyph]', 'Edit')
  })

  // Skipping due to errors on file uploads - file is missing
  it.skip('Send image to user B', () => {
    cy.chatFeaturesSendImage(imageLocalPath, 'logo.png')
    cy.goToLastImageOnChat()
      .invoke('attr', 'src')
      .then((imgSrcValue) => {
        imageURL = imgSrcValue
      })
  })

  // Skipping due to errors on file uploads - file is missing
  it.skip('Context Menu Options - Image Message', () => {
    let optionsImage = ['Copy Image', 'Save Image']
    cy.get('[data-cy=chat-image]').last().as('lastImage')
    cy.validateAllOptionsInContextMenu('@lastImage', optionsImage)
  })

  // Skipping due to errors on file uploads - file is missing
  it.skip('Image messages cannot be edited', () => {
    cy.validateOptionNotInContextMenu('[data-cy=chat-image]', 'Edit')
  })

  // Skipping due to errors on file uploads - file is missing
  it.skip('Send file to user B', () => {
    cy.chatFeaturesSendFile(fileLocalPath, 'test-file.txt')
    cy.get('[data-cy=chat-file]')
      .last()
      .scrollIntoView()
      .should('exist')
      .invoke('attr', 'href')
      .then((fileSrcValue) => {
        fileURL = fileSrcValue
      })
  })

  //Skipping since there is no context menu now for file messages
  it.skip('Context Menu Options - File Message', () => {
    let optionsFile = ['Add Reaction', 'Reply']
    cy.get('[data-cy=chat-file]').last().as('lastFile')
    cy.validateAllOptionsInContextMenu('@lastFile', optionsFile)
  })

  //Skipping since there is no context menu now for file messages
  it.skip('File messages cannot be edited', () => {
    cy.validateOptionNotInContextMenu('[data-cy=chat-file]', 'Edit')
  })

  it('Messages not sent should persist when switching conversations', () => {
    // Type a message without sent it in conversation with Chat User B
    cy.get('[data-cy=editable-input]').trigger('input').type(randomMessage)

    // Go to Conversation with Chat User C and type a different message
    cy.goToConversation(thirdUserName)
    cy.get('[data-cy=editable-input]').trigger('input').type(randomMessageTwo)

    // Return to conversation with Chat User B and assert that first message not sent yet is still present
    cy.goToConversation(secondUserName)
    cy.get('[data-cy=editable-input]').should('have.text', randomMessage)

    // Return to conversation with Chat User C and assert that last message not sent yet is still present
    cy.goToConversation(thirdUserName)
    cy.get('[data-cy=editable-input]').should('have.text', randomMessageTwo)
  })
})

// Skipping for now since an issue is presented showing the friends twice - Will do investigation to determine if its a localstorage thing or an actual bug with CorePWA/Iridium
describe.skip('Chat pair features with Chat User B', () => {
  before(() => {
    //Retrieve username from Chat User A
    cy.restoreLocalStorage('Chat User A')
    cy.getLocalStorage('Satellite-Store').then((ls) => {
      let tempLS = JSON.parse(ls)
      firstUserName = tempLS.accounts.details.name
    })

    //Retrieve username from Chat User C
    cy.restoreLocalStorage('Chat User C')
    cy.getLocalStorage('Satellite-Store').then((ls) => {
      let tempLS = JSON.parse(ls)
      thirdUserName = tempLS.accounts.details.name
    })
  })

  it('Ensure chat window from second account is displayed', () => {
    // Login with User B by restoring LocalStorage Snapshot
    cy.loginWithLocalStorage('Chat User B')

    // Go to a Conversation
    cy.goToConversation(firstUserName)
  })

  it('Assert message received from user A', () => {
    //Adding assertion to validate that messages are displayed
    cy.get('[data-cy=chat-message]')
      .contains(randomMessage)
      .last()
      .scrollIntoView()
      .should('exist')
  })

  it('Message not sent by same user cannot be edited', () => {
    cy.get('[data-cy=chat-message]')
      .contains(randomMessage)
      .last()
      .as('lastmessage')
    cy.validateOptionNotInContextMenu('@lastmessage', 'Edit')
  })

  it('User should be able to reply a message', () => {
    cy.get('[data-cy=chat-message]')
      .contains(randomMessage)
      .last()
      .as('lastmessage')
    cy.chatFeaturesReplyMessage(firstUserName, '@lastmessage', textReply)
  })

  it('Reply to message shows as collapsed first', () => {
    //reply path
    cy.getReply(randomMessage)
    cy.get('@reply-preview')
      .scrollIntoView()
      .should('contain', 'Reply from ' + firstUserName)
  })

  it('Reply to message is displayed by clicking on it', () => {
    cy.getReply(randomMessage)
    cy.get('@reply-preview').click()
    cy.get('[data-cy=reply-message]').should('have.text', textReply)
    cy.get('[data-cy=reply-close]')
      .should('exist')
      .should('contain', 'Collapse')
  })

  it('Reply to message is not displayed when clicking on Collapse', () => {
    cy.get('[data-cy=reply-close]').scrollIntoView().click()
    cy.get('[data-cy=reply-message]').should('not.exist')
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

  it('Assert image received from user A', () => {
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

  it('Assert timestamp is displayed when user A sends a message', () => {
    cy.get('[data-cy=chat-timestamp]')
      .last()
      .invoke('text')
      .then(($text) => {
        expect($text).to.be.oneOf([messageTimestamp, messageTimestampPast])
      })
  })

  it('Add reactions to text message in chat', () => {
    cy.get('[data-cy=chat-message]')
      .contains(randomMessage)
      .last()
      .as('messageToReact')
    cy.reactToChatElement('@messageToReact', '[title="smile"]')
    cy.validateChatReaction('@messageToReact', '😄')
  })

  it('Add reactions to image in chat', () => {
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

  it('Assert timestamp immediately after sending message', () => {
    //Send chat message
    cy.chatFeaturesSendMessage(randomMessage)

    // Obtain timestamps from chat message
    cy.getTimestamp('now').then((value) => {
      messageTimestamp = value
    })
    cy.getTimestamp('past').then((value) => {
      messageTimestampPast = value
    })

    //Go to last chat message
    cy.get('[data-cy=chat-message]')
      .contains(randomMessage)
      .last()
      .scrollIntoView()
      .should('exist')

    //Assert timestamp text immediately
    cy.get('[data-cy=chat-timestamp]')
      .last()
      .then(($timestamp) => {
        cy.getAttached($timestamp)
          .invoke('text')
          .then(($text) => {
            expect($text).to.be.oneOf([messageTimestamp, messageTimestampPast])
          })
      })
  })

  it('User should be able to reply without first clicking into the chat bar - Chat User C', () => {
    cy.goToConversation(thirdUserName)
    cy.get('[data-cy=editable-input]').should('be.visible').paste({
      pasteType: 'text',
      pastePayload: randomMessage,
    })
    cy.get('[data-cy=editable-input]').clear()
  })
})

// Skipping for now since an issue is presented showing the friends twice - Will do investigation to determine if its a localstorage thing or an actual bug with CorePWA/Iridium
describe.skip('Chat pair features with Chat User A - Part 2', () => {
  it('React to other users reaction - Load Account User A', () => {
    // Login with User C by restoring LocalStorage Snapshot
    cy.loginWithLocalStorage('Chat User A')

    // Go to a Conversation
    cy.goToConversation(secondUserName)
  })

  it('React to other users reaction - Execute validation', () => {
    //Find the last reaction message
    cy.get('[data-cy=chat-message]')
      .contains(randomMessage)
      .last()
      .as('messageReacted')
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

    //Validate count of reactions is two
    cy.get('@reactionToMessage')
      .find('[data-cy=emoji-reaction-count]')
      .should('contain', '2')

    //Validate reaction background image is now blue
    cy.get('@reactionToMessage').should(
      'have.css',
      'background-image',
      'linear-gradient(40deg, rgb(39, 97, 253) 40%, rgb(40, 108, 254) 100%)',
    )
  })
})
