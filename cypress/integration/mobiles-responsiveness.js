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

describe.skip('Run responsiveness tests on several devices', () => {
  Cypress.config('pageLoadTimeout', 180000) //adding more time for pageLoadTimeout only for this spec
  data.allDevices.forEach((item) => {
    beforeEach(() => {
      cy.viewport(item.width, item.height)
    })

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

    it(`Chat Features - Messages on ${item.description}`, () => {
      //Validate message and emojis are sent
      cy.chatFeaturesSendMessage(randomMessage)
      cy.chatFeaturesSendEmoji('[title="smile"]', '😄')

      //Validate message can be edited - Commenting this since editMessages is not working
      //cy.chatFeaturesEditMessage(randomMessage, randomNumber)

      //Marketplace - Coming Soon Modal
      cy.get('[data-cy=toggle-sidebar]').click() // return to main screen
      cy.get('[data-cy=mobile-nav-marketplace]').click() // go to Marketplace icon
      cy.validateComingSoonModal()

      //Validate URL on coming soon modal
      cy.validateURLComingSoonModal()

      //Coming soon modal can be dismissed
      cy.closeModal('[data-cy=modal-cta]')

      //Go to last glyph and click on glyphs modal
      cy.goToLastGlyphOnChat().click()
      cy.validateGlyphsModal()

      //Coming soon modal
      cy.contains('View Glyph Pack').click()
      cy.get('[data-cy=modal-cta]').should('be.visible')
      cy.closeModal('[data-cy=modal-cta]')

      //Glyph Pack Screen can be dismissed
      cy.goToLastGlyphOnChat().click()
      cy.get('[data-cy=glyphs-modal]').should('be.visible')
      cy.closeModal('[data-cy=glyphs-modal]')

      //Glyph Selection - Coming Soon Modal
      cy.get('#glyph-toggle').click()
      cy.get('[data-cy=glyphs-marketplace]').click()
      cy.get('[data-cy=modal-cta]').should('be.visible')
      cy.closeModal('[data-cy=modal-cta]')
    })

    it(`Release Notes Screen on ${item.description}`, () => {
      cy.visitRootPage()
      cy.releaseNotesScreenValidation()
    })
  })
})
