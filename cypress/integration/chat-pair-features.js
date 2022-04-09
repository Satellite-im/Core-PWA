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

describe('Chat features with two accounts', () => {
  it('Ensure chat window from first account is displayed', () => {
    //Import first account
    cy.importAccount(randomPIN, recoverySeedAccountOne)
    //Validate Chat Screen is loaded
    cy.contains('Chat User A', { timeout: 240000 }).should('be.visible')
  })

  it('Send message to user B', () => {
    cy.goToConversation('Chat User B')
    cy.chatFeaturesSendMessage(randomMessage)
    cy.contains(randomMessage).last().scrollIntoView().should('exist')
  })

  it('Send emoji to user B', () => {
    cy.chatFeaturesSendEmoji('[title="smile"]', '😄')
    cy.get('[data-cy=chat-message] > span')
      .last()
      .scrollIntoView()
      .should('have.text', '😄')
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
    cy.validateOptionNotInContextMenu('[data-cy=chat-glyph]', 'Edit')
  })

  it('Send image to user B', () => {
    cy.chatFeaturesSendImage(imageLocalPath, 'logo.png')
    cy.goToLastImageOnChat()
      .invoke('attr', 'src')
      .then((imgSrcValue) => {
        imageURL = imgSrcValue
      })
  })

  it('Image messages cannot be edited', () => {
    cy.validateOptionNotInContextMenu('[data-cy=chat-image]', 'Edit')
  })

  it.skip('Send file to user B', () => {
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

  it.skip('File messages cannot be edited', () => {
    cy.validateOptionNotInContextMenu('[data-cy=chat-file]', 'Edit')
  })

  it('Ensure chat window from second account is displayed', () => {
    cy.importAccount(randomPIN, recoverySeedAccountTwo)
    cy.contains('Chat User B', { timeout: 180000 }).should('be.visible')
  })

  it('Assert message received from user A', () => {
    //Adding assertion to validate that messages are displayed
    cy.goToConversation('Chat User A')
    cy.contains(randomMessage).last().scrollIntoView().should('exist')
  })

  it('Message not sent by same user cannot be edited', () => {
    cy.contains(randomMessage).last().as('lastmessage')
    cy.validateOptionNotInContextMenu('@lastmessage', 'Edit')
  })

  it('User should be able to reply a message', () => {
    cy.contains(randomMessage).last().as('lastmessage')
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

  it('Assert image received from user A', () => {
    cy.goToLastImageOnChat()
      .invoke('attr', 'src')
      .then((imageSecondAccountSrc) => {
        expect(imageSecondAccountSrc).to.be.eq(imageURL)
      })
  })

  it.skip('Assert file received from user A', () => {
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
        expect($text).to.match(/d+|[hour[s]? |minute[s]? |second[s]?]\s/)
      })
  })

  it('User should be able to reply without first clicking into the chat bar - Chat User C', () => {
    cy.goToConversation('Chat User C')
    cy.get('[data-cy=editable-input]').should('be.visible').type(randomMessage)
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
        expect($text).to.contain('a few seconds ago')
      })
  })

  it('Assert timestamp one minute after sending message', () => {
    //Wait for 60 seconds
    cy.wait(60000)

    //Assert timestamp text after a minute has passed
    cy.get('[data-cy=chat-timestamp]')
      .last()
      .invoke('text')
      .then(($text) => {
        expect($text).to.contain('a minute ago')
      })
  })

  it('Send a message from third account to second account', () => {
    //import Chat User C account
    cy.importAccount(randomPIN, recoverySeedAccountThree)
    cy.contains('Chat User C', { timeout: 180000 }).should('be.visible')
    //Send a message to Chat User B
    cy.goToConversation('Chat User B')
    cy.chatFeaturesSendMessage(randomMessage)
  })
})
