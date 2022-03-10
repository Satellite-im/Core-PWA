const faker = require('faker')
const recoverySeedAccountOne =
  'core radio verb scout shuffle moment pottery maple need ostrich train around{enter}'
const recoverySeedAccountTwo =
  'festival drastic visual aisle noble off cousin stairs arm seat agent table{enter}'
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
const randomMessage = faker.lorem.sentence() // generate random sentence
const imageLocalPath = 'cypress/fixtures/images/logo.png'
const fileLocalPath = 'cypress/fixtures/test-file.txt'
let glyphURL, imageURL, fileURL

describe('Chat features with two accounts - First User', () => {
  before(() => {
    //Import first account
    cy.importAccount(randomPIN, recoverySeedAccountOne)
  })

  it('Ensure chat window from second account is displayed', () => {
    //Validate Chat Screen is loaded
    cy.contains('Chat User A', { timeout: 180000 }).should('be.visible')
  })

  it('Send message to user B', () => {
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

  it('Ensure chat window from second account is displayed', () => {
    cy.importAccount(randomPIN, recoverySeedAccountTwo)
    cy.contains('Chat User B', { timeout: 180000 }).should('be.visible')
  })

  it('Assert message received from user A', () => {
    cy.contains(randomMessage).last().scrollIntoView().should('be.visible')
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
    cy.get('[data-cy=chat-timestamp]').last().should('contain', 'minutes ago')
  })
})
