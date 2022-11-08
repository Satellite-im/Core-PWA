import { data } from '../fixtures/mobile-devices.json'

const faker = require('faker')
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
const randomName = faker.internet.password(12, true) // Generate username with 12 characters
const randomStatus = faker.lorem.word() // generate random status
const randomNumber = faker.datatype.number() // generate random number
const randomMessage = faker.lorem.sentence() // generate random sentence
let secondUserName

// We will require to pass this configuration as a custom npm script once that import account works
data.allDevices.forEach((item) => {
  cy.on('window:before:load', (win) => {
    Object.defineProperty(win.navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1',
    })
  })
  describe(
    `Run mobile responsiveness tests on ${item.description}`,
    {
      viewportHeight: item.height,
      viewportWidth: item.width,
    },
    () => {
      before(() => {
        //Retrieve username from Chat User B
        cy.restoreLocalStorage('Chat User B')
        cy.getLocalStorage('Satellite-Store').then((ls) => {
          let tempLS = JSON.parse(ls)
          secondUserName = tempLS.accounts.details.name
        })
      })

      it(`Create Account on ${item.description}`, () => {
        cy.createAccountPINscreen(randomPIN, false, false)

        //Create or Import account selection screen
        cy.createAccountSecondScreen()

        //Recovery Seed Screen
        cy.createAccountRecoverySeed()

        //Username and Status Input
        cy.validateUserInputIsDisplayed()
        cy.createAccountUserInput(randomName, randomStatus)

        //Finishing Account Creation
        cy.createAccountSubmit()
      })

      it(`Load Account from LocalStorage on ${item.description}`, () => {
        // Login with User A by restoring LocalStorage Snapshot
        cy.loginWithLocalStorage('Chat User A')

        // Validate message is sent
        cy.goToConversation(secondUserName, true)
      })

      it(`Chat Features on ${item.description}`, () => {
        //Validate message and emojis are sent
        cy.chatFeaturesSendMessage(randomMessage)
        cy.chatFeaturesSendEmoji('[title="smile"]', '😄')
        cy.chatFeaturesEditMessage(randomMessage, randomNumber)
      })

      it(`Glyphs Modal on ${item.description}`, () => {
        //Send first glyph from Astrobunny pack
        cy.chatFeaturesSendGlyph()

        //Go to last glyph and click on glyphs modal
        cy.goToLastGlyphOnChat().click()
        cy.validateGlyphsModal()

        //Coming soon modal
        cy.get('[data-cy=glyphs-modal-view-btn]').click()
        cy.get('[data-cy=modal-cta]').should('be.visible')
        cy.closeModal('[data-cy=modal-cta]')

        //Glyph Pack Screen can be dismissed
        cy.goToLastGlyphOnChat().click()
        cy.get('[data-cy=glyphs-modal]').should('be.visible')
        cy.closeModal('[data-cy=glyphs-modal]')
      })

      it(`Marketplace - Coming Soon Modal on ${item.description}`, () => {
        //Skipped because chat conversation does not finish loading on mobile
        cy.get('[data-cy=toolbar-marketplace]').click()
        cy.validateComingSoonModal()
        cy.validateURLComingSoonModal()
        cy.closeModal('[data-cy=modal-cta]')
      })

      // Keeping this test skipped since we need to add a custom user agent to execute these tests
      it.skip(`Swipe on Settings Screen on ${item.description}`, () => {
        //Skipped because chat conversation does not finish loading on mobile
        // From the chat screen, swipe to the right to return to main screen
        cy.get('body').realSwipe('toRight')
        cy.get('#mobile-nav').should('be.visible')

        //Go to settings screen
        cy.get('[data-cy=mobile-nav-settings]').click()

        //Validate that left part of Settings screen is displayed on mobile initially
        cy.contains('Personalize').should('be.visible')

        // Swipe to the left, to go to the right part of the screen
        cy.get('#settings').realSwipe('toLeft')

        //Validate that right part of Settings screen is displayed after doing the swipe
        cy.contains('Settings').should('be.visible')

        //Close settings screen
        cy.get('[data-cy=settings-close-button]').click()
      })

      // Keeping this test skipped since we need to add a custom user agent to execute these tests
      it.skip(`Swipe on Chat Screen on ${item.description}`, () => {
        //Skipped because chat conversation does not finish loading on mobile
        // Return to chat screen, doing a swipe from main screen
        cy.get('body').realSwipe('toLeft')
        cy.get('[data-cy=editable-input]').should('be.visible')

        // From the chat screen, swipe to the right to return to main screen
        cy.get('body').realSwipe('toRight')
        cy.get('#mobile-nav').should('be.visible')
      })

      it(`Version number is displayed ${item.description}`, () => {
        cy.visit('/')
        cy.get('[data-cy=version]')
          .should('be.visible')
          .find('span')
          .contains('Core-PWA')
      })
    },
  )
})
