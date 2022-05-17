import { dataRecovery } from '../fixtures/test-data-accounts.json'
import { data } from '../fixtures/mobile-devices.json'

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
      it(`Create Account on ${item.description}`, () => {
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
        cy.importAccount(randomPIN, recoverySeed, true)
        //Validate profile name displayed
        cy.validateChatPageIsLoaded(true)

        //Go to conversation
        cy.goToConversation('cypress friend', true)
      })

      it(`Chat Features - Send Messages on ${item.description}`, () => {
        // Click to hamburger button to display chat if app wrap is open (chat not displayed)
        cy.get('#app-wrap').then(($appWrap) => {
          if ($appWrap.hasClass('is-open')) {
            cy.get('[data-cy=hamburger-button]').click()
          }
        })

        //Validate message and emojis are sent
        cy.chatFeaturesSendMessage(randomMessage)
      })

      it(`Chat Features - Send Emoji on ${item.description}`, () => {
        cy.chatFeaturesSendEmoji('[title="smile"]', '😄')
      })

      it.skip(`Chat Features - Edit Messages on ${item.description}`, () => {
        cy.chatFeaturesEditMessage(randomMessage, randomNumber)
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

      it.skip(`Glyphs Modal on ${item.description}`, () => {
        //Go to last glyph and click on glyphs modal
        cy.goToLastGlyphOnChat().click()
        cy.validateGlyphsModal()
      })

      it.skip(`Glyphs Modal - Coming Soon on ${item.description}`, () => {
        //Coming soon modal
        cy.contains('View Glyph Pack').click()
        cy.get('[data-cy=modal-cta]').should('be.visible')
        cy.closeModal('[data-cy=modal-cta]')
      })

      it.skip(`Glyphs Pack Screen can be dismissed on ${item.description}`, () => {
        //Glyph Pack Screen can be dismissed
        cy.goToLastGlyphOnChat().click()
        cy.get('[data-cy=glyphs-modal]').should('be.visible')
        cy.closeModal('[data-cy=glyphs-modal]')
      })

      it(`Glyphs Selection - Coming Soon Modal on ${item.description}`, () => {
        //Glyph Selection - Coming Soon Modal
        cy.goToConversation('cypress friend', true)
        cy.get('#glyph-toggle').click()
        cy.get('[data-cy=glyphs-marketplace]').click()
        cy.get('[data-cy=modal-cta]').should('be.visible')
        cy.closeModal('[data-cy=modal-cta]')
      })

      it(`Swipe on Settings Screen on ${item.description}`, () => {
        //Swipe on Settings Screen
        cy.get('[data-cy=toggle-sidebar]').click() //Show main screen again
        cy.get('#mobile-nav').should('be.visible')
        cy.get('[data-cy=mobile-nav-settings]').click() //Click on settings
        cy.contains('Settings').should('be.visible')
        cy.get('#settings').realSwipe('toRight') // Swipe to the right, to go back to the left part of the screen
        cy.contains('Personalize').should('be.visible')
        cy.get('#settings').realSwipe('toLeft') // Swipe to the left, to go to the right part of the screen
        cy.contains('Settings').should('be.visible')
        cy.get('.close-button').click()
      })

      it(`Swipe on Chat Screen on ${item.description}`, () => {
        //Swipe on Chat screen to Main screen
        cy.goToConversation('cypress friend', true)
        cy.get('[data-cy=editable-input]').should('be.visible')
        cy.get('body').realSwipe('toRight') // Swipe to the right, to return to main page
        cy.get('#mobile-nav').should('be.visible')
      })

      it(`Release Notes Screen on ${item.description}`, () => {
        cy.visitRootPage()
        cy.releaseNotesScreenValidation()
      })
    },
  )
})
