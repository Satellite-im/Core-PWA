import { dataRecovery } from '../fixtures/test-data-accounts.json'

const faker = require('faker')
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
const randomNumber = faker.datatype.number() // generate random number
const randomMessage = faker.lorem.sentence() // generate random sentence
const imageLocalPath = 'cypress/fixtures/images/logo.png'
const recoverySeed =
  dataRecovery.accounts
    .filter((item) => item.description === 'Only Text')
    .map((item) => item.recoverySeed) + '{enter}'
let imageURL

describe('Chat Features Tests', () => {
  it('Chat - Send message on chat', { retries: 2 }, () => {
    // Import account
    cy.importAccount(randomPIN, recoverySeed)

    // Validate profile name displayed
    cy.validateChatPageIsLoaded()

    // Validate message is sent
    cy.goToConversation('Only Text Friend')
    cy.chatFeaturesSendMessage(randomMessage)
  })

  it('Chat - Send Emoji on chat', () => {
    cy.chatFeaturesSendEmoji('[title="smile"]', '😄')
  })

  it.skip('Chat - Edit message on chat', () => {
    // skipped because edit feature is coming soon
    cy.chatFeaturesEditMessage(randomMessage, randomNumber)
  })

  it.skip('Chat - Message edited shows edited status', () => {
    // skipped because edit feature is coming soon
    cy.get('[data-cy=message-edited]').last().parents()

    cy.contains(randomMessage + randomNumber)
      .parents('[data-cy=message-container]')
      .find('[data-cy=message-edited]', { timeout: 30000 })
      .should('contain', '(edited)')
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
    cy.contains(randomMessage).last().scrollIntoView().rightclick()
    cy.contains('Copy Message').realClick()

    //Validating that text messsage copied matches with actual clipboard value
    cy.window()
      .its('navigator.clipboard')
      .invoke('readText')
      .should('equal', randomMessage)
      .then((clipboardText) => {
        //Simulating the paste event through a cypress command passing the clipboard data
        cy.get('[data-cy=editable-input]').realClick().paste({
          pasteType: 'text',
          pastePayload: clipboardText,
        })
      })
    // Validating that editable input text matches with pasted value
    cy.get('[data-cy=editable-input]').should('have.text', randomMessage)
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

  it('Chat - Verify when clicking on Send Money, coming soon appears', () => {
    // Hover over on Send Money and Coming Soon tooltip will appear when clicking on its button
    cy.hoverOnComingSoonIcon(
      '#chatbar-controls > span',
      'Send Money Coming Soon',
    )
  })

  it('Chat - Verify when clicking on Emoji, the emoji picker appears', () => {
    // Emoji picker is displayed  when clicking on its button
    cy.get('#emoji-toggle').click()
    cy.get('.navbar > .button-group > .styled-button > .content').should(
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

  it('Chat - Validate User ID can be copied when clicked on it', () => {
    //Click on toggle-sidebar only if app is collapsed
    cy.get('#app-wrap').then(($appWrap) => {
      if ($appWrap.hasClass('is-collapsed')) {
        cy.get('[data-cy=toggle-sidebar]').click()
      }
    })

    //Start validation
    cy.chatFeaturesProfileName('Only Text')
    cy.get('[data-cy=hamburger-button]').click()
  })

  //Following two tests are skipped because Profile Screen is not visible now
  it.skip('Chat - Add a note to user profile', () => {
    cy.addOrAssertProfileNote('This is a test note' + randomNumber, 'add')
  })

  it.skip('Chat - Assert note from user profile', () => {
    cy.addOrAssertProfileNote('This is a test note' + randomNumber, 'assert')
  })
})
