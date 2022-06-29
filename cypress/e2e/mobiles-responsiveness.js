import { data } from '../fixtures/mobile-devices.json'
import { dataRecovery } from '../fixtures/test-data-accounts.json'

const faker = require('faker')
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
const randomName = faker.internet.userName(name) // generate random name
const randomStatus = faker.lorem.word() // generate random status
const filepathCorrect = 'images/logo.png'
const randomNumber = faker.datatype.number() // generate random number
const randomMessage = faker.lorem.sentence() // generate random sentence
const recoverySeed =
  dataRecovery.accounts
    .filter((item) => item.description === 'cypress')
    .map((item) => item.recoverySeed) + '{enter}'

data.allDevices.forEach((item) => {
  describe(
    `Run responsiveness tests on ${item.description}`,
    {
      viewportHeight: item.height,
      viewportWidth: item.width,
    },
    () => {
      Cypress.config('pageLoadTimeout', 180000) //adding more time for pageLoadTimeout only for this spec
      it.only(`Create Account on ${item.description}`, { retries: 2 }, () => {
        cy.createAccountPINscreen(randomPIN, false, false, true)

        //Create or Import account selection screen
        cy.createAccountSecondScreen()

        //Recovery Seed Screen
        cy.createAccountRecoverySeed()

        //Username and Status Input
        cy.validateUserInputIsDisplayed()
        cy.createAccountUserInput(randomName, randomStatus)

        //User Image Input
        cy.createAccountAddImage(filepathCorrect)
        cy.get('[data-cy=cropper-container]', { timeout: 60000 })
          .should('exist')
          .then(() => {
            cy.contains('Crop', { timeout: 30000 }).should('exist').click()
          })

        //Finishing Account Creation
        cy.createAccountSubmit()
      })

      it(`Import Account on ${item.description}`, { retries: 2 }, () => {
        cy.importAccount(randomPIN, recoverySeed, true, true)
        //Validate profile name displayed
        cy.validateChatPageIsLoaded(true)

        //Go to conversation
        cy.goToConversation('cypress friend', true)
      })

      it(`Chat Features - Send Messages on ${item.description}`, () => {
        //Validate message and emojis are sent
        cy.chatFeaturesSendMessage(randomMessage)
      })

      it(`Chat Features - Send Emoji on ${item.description}`, () => {
        cy.chatFeaturesSendEmoji('[title="smile"]', '😄')
      })

      it.skip(`Chat Features - Edit Messages on ${item.description}`, () => {
        cy.chatFeaturesEditMessage(randomMessage, randomNumber)
      })

      it(`Glyphs Modal on ${item.description}`, () => {
        //Go to last glyph and click on glyphs modal
        cy.goToLastGlyphOnChat().click()
        cy.validateGlyphsModal()
      })

      it(`Glyphs Modal - Coming Soon on ${item.description}`, () => {
        //Coming soon modal
        cy.contains('View Glyph Pack').click()
        cy.get('[data-cy=modal-cta]').should('be.visible')
        cy.closeModal('[data-cy=modal-cta]')
      })

      it(`Glyphs Pack Screen can be dismissed on ${item.description}`, () => {
        //Glyph Pack Screen can be dismissed
        cy.goToLastGlyphOnChat().click()
        cy.get('[data-cy=glyphs-modal]').should('be.visible')
        cy.closeModal('[data-cy=glyphs-modal]')
      })

      it(`Glyphs Selection - Coming Soon Modal on ${item.description}`, () => {
        //Glyph Selection - Coming Soon Modal
        cy.get('#glyph-toggle').click()
        cy.get('[data-cy=glyphs-marketplace]').click()
        cy.get('[data-cy=modal-cta]').should('be.visible')
        cy.closeModal('[data-cy=modal-cta]')
      })

      it(`Marketplace - Coming Soon Modal on ${item.description}`, () => {
        cy.get('[data-cy=toggle-sidebar]').click() // return to main screen
        cy.get('[data-cy=mobile-nav-marketplace]').click() // go to Marketplace icon
        cy.validateComingSoonModal()
      })

      it(`Marketplace - Coming Soon Modal URL on ${item.description}`, () => {
        cy.validateURLComingSoonModal()
      })

      it(`Marketplace - Coming Soon Modal can be dismissed on ${item.description}`, () => {
        cy.closeModal('[data-cy=modal-cta]')
      })

      it(`Swipe on Settings Screen on ${item.description}`, () => {
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

      it(`Swipe on Chat Screen on ${item.description}`, () => {
        // Return to chat screen, doing a swipe from main screen
        cy.get('body').realSwipe('toLeft')
        cy.get('[data-cy=editable-input]').should('be.visible')

        // From the chat screen, swipe to the right to return to main screen
        cy.get('body').realSwipe('toRight')
        cy.get('#mobile-nav').should('be.visible')
      })

      it.only(`Release Notes Screen on ${item.description}`, () => {
        cy.visitRootPage()
        cy.releaseNotesScreenValidation()
      })
    },
  )
})
