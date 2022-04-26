const faker = require('faker')
const { utimes } = require('fs')
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
const randomNumber = faker.datatype.number() // generate random number
const randomMessage = faker.lorem.sentence() // generate random sentence
const imageLocalPath = 'cypress/fixtures/images/logo.png'
const randomTextToCopy = faker.lorem.sentence() // generate random sentence
const recoverySeed =
  'useful wedding venture reopen forest lawsuit essence hamster kitchen bundle level tower{enter}'
let imageURL
let randomTextEdited = randomMessage + randomNumber

describe('Chat Features Tests', () => {
  it('Chat - Send message on chat', () => {
    // Import account
    cy.importAccount(randomPIN, recoverySeed)

    // Validate profile name displayed
    cy.validateChatPageIsLoaded()

    // Validate message is sent
    cy.goToConversation('cypress friend')
    cy.chatFeaturesSendMessage(randomMessage)
  })

  it('Chat - Send Emoji on chat', () => {
    cy.chatFeaturesSendEmoji('[title="smile"]', '😄')
  })

  it('Chat - Edit message on chat', () => {
    cy.chatFeaturesEditMessage(randomMessage, randomNumber)
  })

  it('Chat - Message edited shows edited status', () => {
    cy.contains(randomMessage + randomNumber)
      .parents('[data-cy=message-container]')
      .find('[data-cy=message-edited]')
      .should('contain', '(edited)')
  })

  it('Chat - Verify when clicking on Send Money, coming soon appears', () => {
    // Hover over on Send Money and Coming Soon tooltip will appear when clicking on its button
    cy.hoverOnComingSoonIcon(
      '#chatbar-controls > span > .tooltip-container',
      'Send Money\nComing Soon',
    )
  })

  it('Chat - Verify when clicking on Emoji, the emoji picker appears', () => {
    // Emoji picker is displayed  when clicking on its button
    cy.get('#emoji-toggle').click()
    cy.get('.navbar > .button-group > .active > #custom-cursor-area').should(
      'contain',
      'Emoji',
    )
    cy.get('#emoji-toggle').click()
  })

  it('Chat - Verify when clicking on Glyphs, the glyphs picker appears', () => {
    // Glyphs picker is displayed when clicking on its button
    cy.get('#glyph-toggle').click()
    cy.get('.pack-list > .is-text').should('contain', 'Try using some glyphs')
    cy.get('#glyph-toggle').click()
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
    cy.contains(randomTextEdited).last().scrollIntoView().rightclick()
    cy.contains('Copy Message').realClick()

    //Validating that text messsage copied matches with actual clipboard value
    cy.window()
      .its('navigator.clipboard')
      .invoke('readText')
      .should('equal', randomTextEdited)
      .then((clipboardText) => {
        //Simulating the paste event through a cypress command passing the clipboard data
        cy.get('[data-cy=editable-input]').realClick().paste({
          pasteType: 'text',
          pastePayload: clipboardText,
        })
      })
    // Validating that editable input text matches with pasted value
    cy.get('[data-cy=editable-input]').should('have.text', randomTextEdited)
  })

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
    cy.get('.file-item').should('exist')
    cy.get('.file-info > .title').should('contain', 'logo.png')
  })

  it('Chat - Validate User ID can be copied when clicked on it', () => {
    // Moving this at the end of execution to avoid issues on CI when running chat tests
    cy.get('[data-cy=toggle-sidebar]').click()
    cy.chatFeaturesProfileName('cypress')
  })

  it('Chat - Add a note to user profile', () => {
    cy.get('[data-cy=friend-chat-circle]').click()
    cy.get('[data-cy=profile]').should('be.visible')
    cy.contains('Add Note').should('be.visible')
    cy.get('[data-cy=profile-add-note] > .cte-input')
      .should('contain', 'Click to add note')
      .click()
      .type('This is a test note{enter}')
    cy.get('[data-cy=profile]').find('.close-button').click()
  })

  it('Chat - Assert note from user profile', () => {
    cy.get('[data-cy=friend-chat-circle]').click()
    cy.get('[data-cy=profile]').should('be.visible')
    cy.get('[data-cy=profile-add-note] > .cte-input')
      .should('contain', 'This is a test note')
      .click()
      .clear()
      .type('{enter}') // removing note added before
    cy.get('[data-cy=profile]').find('.close-button').click()
  })

  it('Chat - Search - Text message - Exact match', () => {
    //Get text from last chat-message and look for it in search bar
    cy.get('[data-cy=chat-message]')
      .contains(randomTextEdited)
      .last()
      .invoke('text')
      .then(($message) => {
        cy.searchFromTextInChat($message)
      })

    //Assert results and close search modal
    cy.assertFirstMatchOnSearch(randomTextEdited)
    cy.get('[data-cy=chat-search-result]').find('.close-button').click()
  })

  it('Chat - Search - Emoji - Exact match', () => {
    //Get text from last emoji-message and look for it in search bar
    cy.get('[data-cy=chat-message]')
      .contains('😄')
      .last()
      .invoke('text')
      .then(($message) => {
        cy.searchFromTextInChat($message)
      })

    //Assert results and close search modal
    cy.assertFirstMatchOnSearch('😄')
    cy.get('[data-cy=chat-search-result]').find('.close-button').click()
  })

  it('Chat - Search Results - Pagination is displayed when more than 10 matches are found', () => {
    //Look for a word showing more than 10 results in chat and ensure pagination is displayed
    cy.searchFromTextInChat('omnis')
    cy.get('[data-cy=chat-search-result-pagination]').should('exist')
  })

  it('Chat - Search Results - Navigate through results ordered by New', () => {
    //Navigate through results sorted by New, which is the default view
    cy.navigateThroughSearchResults()
  })

  it('Chat - Search Results - Navigate through results ordered by Old', () => {
    //Click on Sort By Old
    cy.get('.orderby-item').contains('Old').click()

    //Navigate through all results sorted by Old
    cy.navigateThroughSearchResults()
  })

  it('Chat - Search Results - Navigate through results oredered by Relevant', () => {
    //Click on Sort By Relevant
    cy.get('.orderby-item').contains('Relevant').click()

    //Navigate through all results sorted by Relevant
    cy.navigateThroughSearchResults()

    //Finally close search results modal
    cy.get('[data-cy=chat-search-result]').find('.close-button').click()
  })

  it('Chat - Search - Results - Pagination is NOT displayed when 10 or less matches are found', () => {
    //Search for a random number and assert results
    cy.searchFromTextInChat(randomNumber)
    cy.assertFirstMatchOnSearch(randomNumber)

    //Validate that pagination is not displayed and close search modal
    cy.get('[data-cy=chat-search-result-pagination]').should('not.exist')
    cy.get('[data-cy=chat-search-result]').find('.close-button').click()
  })
})
