const faker = require('faker')
const randomNumber = faker.datatype.number() // generate random number
const randomMessage = faker.lorem.sentence() // generate random sentence
const imageLocalPath = 'cypress/fixtures/images/logo.png'
let expectedEmojiFrequentList
let imageURL, expecedEditedMessage, secondUserName

describe('Chat Features Tests', () => {
  before(() => {
    //Retrieve username from Chat User B
    cy.restoreLocalStorage('Chat User B')
    cy.getLocalStorage('Satellite-Store').then((ls) => {
      const tempLS = JSON.parse(ls)
      secondUserName = tempLS.accounts.details.name
    })
  })

  it('Chat - Send message on chat', () => {
    // Login with User A by restoring LocalStorage Snapshot
    cy.loginWithLocalStorage('Chat User A')

    // Validate message is sent
    cy.goToConversation(secondUserName)
    cy.chatFeaturesSendMessage(randomMessage)
    expecedEditedMessage = randomMessage
  })

  it('Chat - Send Emoji on chat', () => {
    cy.chatFeaturesSendEmoji('[title="smile"]', '😄')
  })

  it('Chat - Edit message on chat by hovering and selecting edit button', () => {
    cy.chatFeaturesEditMessage(randomMessage, randomNumber, 'hover')
    expecedEditedMessage += randomNumber
  })

  it('Chat - Edit message on chat using right-click', () => {
    cy.chatFeaturesEditMessage(expecedEditedMessage, randomNumber, 'rightClick')
    expecedEditedMessage += randomNumber
  })

  it('Chat - Message edited shows edited status', () => {
    // Edited message shows (Edited) status
    cy.get('[data-cy=message-edited]').last().should('contain', '(edited)')

    // Edited message is correct
    cy.get('[data-cy=message-edited]')
      .last()
      .prev('[data-cy=chat-message]')
      .should('contain', expecedEditedMessage)
  })

  it('Chat - Copy paste text', () => {
    // Allowing Chrome Browser to have read and write access to clipboard
    cy.wrap(
      Cypress.automation('remote:debugger:protocol', {
        command: 'Browser.grantPermissions',
        params: {
          permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'],
          //make the permission trigger by allowing the current origin only
          origin: window.location.origin,
        },
      }),
    )

    //Ensuring permissions for read were granted
    cy.window()
      .its('navigator.permissions')
      .invoke('query', { name: 'clipboard-read' })
      .its('state')
      .should('equal', 'granted')

    //Copying the latest text message sent
    cy.contains(expecedEditedMessage).last().scrollIntoView().rightclick()
    cy.contains('Copy Message').realClick()

    //Validating that text messsage copied matches with actual clipboard value
    cy.window()
      .its('navigator.clipboard')
      .invoke('readText')
      .should('equal', expecedEditedMessage)
      .then((clipboardText) => {
        //Simulating the paste event through a cypress command passing the clipboard data
        cy.get('[data-cy=editable-input]').click().paste({
          pasteType: 'text',
          pastePayload: clipboardText,
        })
      })
    // Validating that editable input text matches with pasted value
    cy.get('[data-cy=editable-input]').should('have.text', expecedEditedMessage)
    cy.get('[data-cy=editable-input]').click().clear()
  })

  //Skipped because it needs rework - AP-1324
  it.skip('Chat - Copy paste images', () => {
    cy.chatFeaturesSendImage(imageLocalPath, 'logo.png')

    // Copying the latest image URL sent
    cy.goToLastImageOnChat()
      .invoke('attr', 'src')
      .then((imgSrcValue) => {
        imageURL = imgSrcValue
      })
    cy.goToLastImageOnChat().rightclick()
    cy.contains('Copy Image').realClick()

    // Simulating paste event through a cypress command passing the clipboard image URL data
    cy.window()
      .its('navigator.clipboard')
      .invoke('read')
      .then((clipboardImageURL) => {
        cy.get('[data-cy=editable-input]').realClick().paste({
          pasteType: 'url',
          pastePayload: clipboardImageURL,
        })
      })
    // Validating that preview of image is displayed and matches with image filename copied from clipboard
    cy.get('.file-item').should('exist') //seems this is no longer available, test needs to be updated
    cy.get('.file-info > .title').should('contain', 'logo.png')
  })

  it('Chat - Verify when clicking on Emoji, the emoji picker appears', () => {
    // Emoji picker is displayed  when clicking on its button
    cy.get('[data-cy=send-emoji]').click()
    cy.contains('Frequently used').should('be.visible')
    cy.get('[data-cy=emoji-picker]').should('be.visible')

    //Click outside to close the emoji picker
    cy.get('body')
      .realClick({ position: 'topLeft' })
      .then(() => {
        cy.get('[data-cy=emoji-picker]').should('not.exist')
      })
  })

  it('Chat - Verify when clicking on Glyphs, the glyphs picker appears', () => {
    // Glyphs picker is displayed when clicking on its button
    cy.get('[data-cy=emoji-picker]').should('not.exist')
    cy.get('[data-cy=send-glyph]').click()
    cy.get('[data-cy=glyphs-picker]').should('be.visible')
    //Click outside to close the glyphs picker
    cy.get('body')
      .realClick({ position: 'topLeft' })
      .then(() => {
        cy.get('[data-cy=glyphs-picker]').should('not.exist')
      })
  })

  it('Chat - Switching Glyphs/Emoji pickers ', () => {
    // Open Emoji Picker and ensure that only emoji picker its visible
    cy.get('[data-cy=send-emoji]').click()
    cy.validateActiveGlyphsEmojiPicker('emoji')

    // Click on Emoji Tab and ensure that only emoji picker its visible
    cy.get('[data-cy=glyphs-emoji-active]').click()
    cy.validateActiveGlyphsEmojiPicker('emoji')

    // Click on Glyphs Tab and ensure that only glyphs picker its visible
    cy.get('[data-cy=glyphs-emoji-inactive]').click()
    cy.validateActiveGlyphsEmojiPicker('glyphs')

    // Click on Emoji Tab again and ensure that only emoji picker its visible
    cy.get('[data-cy=glyphs-emoji-inactive]').click()
    cy.validateActiveGlyphsEmojiPicker('emoji')

    // Click on Send Glyph button and ensure that only glyphs picker its visible
    cy.get('[data-cy=send-glyph]').click()
    cy.validateActiveGlyphsEmojiPicker('glyphs')

    // Click on Send Emoji button and ensure that only emoji picker its visible
    cy.get('[data-cy=send-emoji]').click()
    cy.validateActiveGlyphsEmojiPicker('emoji')

    // Click again on Send Glyph button and ensure that only glyphs picker its visible
    cy.get('[data-cy=send-glyph]').click()
    cy.validateActiveGlyphsEmojiPicker('glyphs')

    // Click on Glyphs Tab and ensure that only glyphs picker its visible
    cy.get('[data-cy=glyphs-emoji-active]').click()
    cy.validateActiveGlyphsEmojiPicker('glyphs')

    // Click on Emoji Tab and ensure that only glyphs picker its visible
    cy.get('[data-cy=glyphs-emoji-active]').click()
    cy.validateActiveGlyphsEmojiPicker('glyphs')

    // Click on Esc to close Glyphs/Emoji picker
    cy.get('body').type('{esc}')
  })

  it('Chat - Validate User ID can be copied when clicked on it', () => {
    cy.chatFeaturesProfileName()
  })

  //Test is skipped because Profile Screen cannot be accessed now from Main Chat Page
  it.skip('Chat - Add a note to user profile', () => {
    cy.addOrAssertProfileNote('This is a test note' + randomNumber, 'add')
  })

  //Test is skipped because Profile Screen cannot be accessed now from Main Chat Page
  it.skip('Chat - Assert note from user profile', () => {
    cy.addOrAssertProfileNote('This is a test note' + randomNumber, 'assert')
  })

  it('Chat - Emoji Picker - Frequently used - Validate list order', () => {
    //Assign the same emojis previously sent to our expected list variable
    expectedEmojiFrequentList = '😄😃😀😊😉😍😘😚😗😙'

    // Send 9 different emojis, so we can have 10 emojis sent on the list
    cy.chatFeaturesSendEmoji('[title="smiley"]', '😃', false)
    cy.chatFeaturesSendEmoji('[title="grinning"]', '😀', false)
    cy.chatFeaturesSendEmoji('[title="blush"]', '😊', false)
    cy.chatFeaturesSendEmoji('[title="wink"]', '😉', false)
    cy.chatFeaturesSendEmoji('[title="heart_eyes"]', '😍', false)
    cy.chatFeaturesSendEmoji('[title="kissing_heart"]', '😘', false)
    cy.chatFeaturesSendEmoji('[title="kissing_closed_eyes"]', '😚', false)
    cy.chatFeaturesSendEmoji('[title="kissing"]', '😗', false)
    cy.chatFeaturesSendEmoji('[title="kissing_smiling_eyes"]', '😙', false)

    //Validate emoji frequently used list has the expected order
    cy.validateFrequentEmojiItems(expectedEmojiFrequentList)

    //Clear editable input
    cy.get('[data-cy=editable-input]').click().clear()
  })

  it('Chat - Emoji - Frequently used - List will be updated and emoji sent more times will be first', () => {
    // Select 3x times joy emoji (not previously clicked)
    cy.chatFeaturesSendEmoji('[title="joy"]', '😂', false)
    cy.chatFeaturesSendEmoji('[title="joy"]', '😂', false)
    cy.chatFeaturesSendEmoji('[title="joy"]', '😂', false)

    // Select 3x times heart eyes emoji (now clicked 4 times)
    cy.chatFeaturesSendEmoji('[title="heart_eyes"]', '😍', false)
    cy.chatFeaturesSendEmoji('[title="heart_eyes"]', '😍', false)
    cy.chatFeaturesSendEmoji('[title="heart_eyes"]', '😍', false)

    // Send 1x time wink emoji and then validate (now clicked 2 times)
    cy.chatFeaturesSendEmoji('[title="wink"]', '😉', true).then(() => {
      // Update our existing expected list variable, the last emoji just 1x used will be removed from the list
      expectedEmojiFrequentList = '😍😂😉😄😃😀😊😘😚😗'

      //Validate emoji frequently used list has the expected order
      cy.validateFrequentEmojiItems(expectedEmojiFrequentList)
    })

    //Clear editable input
    cy.get('[data-cy=editable-input]').click().clear()
  })

  it('Chat - Emoji Picker - Frequently used - List length is capped to 10', () => {
    //Open emoji picker and validate frequent used list length
    cy.get('[data-cy=send-emoji]').click()
    cy.get('[data-cy=emoji-frequently-used-list]')
      .children()
      .should('have.length', 10)

    //Close Emoji Picker
    cy.get('body').type('{esc}')
  })
})
