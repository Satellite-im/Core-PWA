const faker = require('faker')
const recoverySeedAccountOne =
  'lonely dust spring orphan pulp angry mystery bracket pottery metal bright damp{enter}'
const recoverySeedAccountTwo =
  'urban clump gather december smoke upset chicken spice steel hope doll pigeon{enter}'
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
const randomMessage = faker.lorem.sentence() // generate random sentence
const imageLocalPath = 'cypress/fixtures/images/logo.png'
const fileLocalPath = 'cypress/fixtures/test-file.txt'
let glyphURL, imageURL, fileURL

describe('Chat features with two accounts', () => {
  before(() => {
    //Import first account
    cy.importAccount(randomPIN, recoverySeedAccountOne)
  })

  it('Ensure chat window from first account is displayed', () => {
    //Validate Chat Screen is loaded
    cy.contains('Chat User A', { timeout: 240000 }).should('be.visible')
  })

  it('Send message to user B', () => {
    cy.waitForMessagesToLoad()
    cy.chatFeaturesSendMessage(randomMessage)
    cy.contains(randomMessage).last().scrollIntoView().should('be.visible')
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
    cy.get('[data-cy=chat-glyph]')
      .last()
      .scrollIntoView()
      .should('be.visible')
      .invoke('attr', 'src')
      .then((glyphSrcValue) => {
        glyphURL = glyphSrcValue
      })
  })

  it('Glyphs messages cannot be edited', () => {
    cy.validateOptionNotInContextMenu('[data-cy=chat-glyph]', 'Edit')
  })

  it('Send image to user B', () => {
    cy.chatFeaturesSendImage(imageLocalPath)
    cy.get('[data-cy=chat-image]')
      .last()
      .scrollIntoView()
      .should('be.visible')
      .invoke('attr', 'src')
      .then((imgSrcValue) => {
        imageURL = imgSrcValue
      })
  })

  it('Image messages cannot be edited', () => {
    cy.validateOptionNotInContextMenu('[data-cy=chat-image]', 'Edit')
  })

  it('Send file to user B', () => {
    cy.chatFeaturesSendFile(fileLocalPath)
    cy.get('[data-cy=chat-file]')
      .last()
      .scrollIntoView()
      .should('be.visible')
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
    cy.contains('Chat User B', { timeout: 180000 }).should('be.visible')
  })

  it('Assert message received from user A', () => {
    //Adding assertion to validate that messages are displayed
    cy.waitForMessagesToLoad()
    cy.contains(randomMessage).last().scrollIntoView().should('be.visible')
  })

  it('Message not sent by same user cannot be edited', () => {
    cy.contains(randomMessage).last().as('lastmessage')
    cy.validateOptionNotInContextMenu('@lastmessage', 'Edit')
  })

  it('Assert emoji received from user A', () => {
    cy.get('[data-cy=chat-message] > span')
      .last()
      .scrollIntoView()
      .should('have.text', '😄')
  })

  it('Assert glyph received from user A', () => {
    cy.get('[data-cy=chat-glyph]')
      .last()
      .scrollIntoView()
      .should('be.visible')
      .invoke('attr', 'src')
      .then((glyphSecondAccountSrc) => {
        expect(glyphSecondAccountSrc).to.be.eq(glyphURL)
      })
  })

  it('Assert image received from user A', () => {
    cy.get('[data-cy=chat-image]')
      .last()
      .scrollIntoView()
      .should('be.visible')
      .invoke('attr', 'src')
      .then((imageSecondAccountSrc) => {
        expect(imageSecondAccountSrc).to.be.eq(imageURL)
      })
  })

  it('Assert file received from user A', () => {
    cy.get('[data-cy=chat-file]')
      .last()
      .scrollIntoView()
      .should('be.visible')
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
        expect($text).to.match(/d+[hour[s]? |minute[s]? |second[s]?]\s/)
      })
  })
})
