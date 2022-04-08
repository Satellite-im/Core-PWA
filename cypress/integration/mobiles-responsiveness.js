import { data } from '../fixtures/mobile-devices.json'

const faker = require('faker')
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
const randomName = faker.internet.userName(name) // generate random name
const randomStatus = faker.lorem.word() // generate random status
const filepathCorrect = 'images/logo.png'
const randomNumber = faker.datatype.number() // generate random number
const randomMessage = faker.lorem.sentence() // generate random sentence
const recoverySeed =
  'useful wedding venture reopen forest lawsuit essence hamster kitchen bundle level tower{enter}'

describe('Run responsiveness tests on several devices', () => {
  Cypress.config('pageLoadTimeout', 180000) //adding more time for pageLoadTimeout only for this spec
  Cypress.on('uncaught:exception', (err, runnable) => false) // to bypass Module build failed: Error: ENOENT: No such file or directory issue randomly presented
  data.allDevices.forEach((item) => {
    it(`Create Account on ${item.description}`, () => {
      cy.viewport(item.width, item.height)
      cy.createAccountPINscreen(randomPIN)

      //Create or Import account selection screen
      cy.createAccountSecondScreen()

      //Privacy Settings screen
      cy.createAccountPrivacyTogglesGoNext()

      //Recovery Seed Screen
      cy.createAccountRecoverySeed()

      //Username and Status Input
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

    it(`Import Account on ${item.description}`, () => {
      cy.viewport(item.width, item.height)
      cy.importAccount(randomPIN, recoverySeed)
      //Validate profile name displayed
      cy.contains('cypress', { timeout: 240000 }).should('be.visible')
    })

    it.skip(`Chat Features on ${item.description}`, () => {
      //Setting viewport
      cy.viewport(item.width, item.height)

      //Go to conversation
      cy.get('[data-cy=hamburger-button]').click()
      cy.get('[data-cy=user-connected]', { timeout: 60000 })
        .should('be.visible')
        .should('have.text', 'cypress friend')

      //Validate message and emojis are sent
      cy.chatFeaturesSendMessage(randomMessage)
      cy.chatFeaturesSendEmoji('[title="smile"]', '😄')

      //Validate message can be edited
      cy.chatFeaturesEditMessage(randomMessage, randomNumber)
    })

    it.skip(`Chat - Marketplace - Coming Soon modal content on ${item.description}`, () => {
      cy.viewport(item.width, item.height)
      cy.get('[data-cy=toolbar-marketplace]').click()
      cy.validateComingSoonModal()
    })

    it.skip(`Chat - Marketplace - Coming Soon modal button URL on ${item.description}`, () => {
      cy.viewport(item.width, item.height)
      cy.validateURLComingSoonModal()
    })

    it.skip(`Chat - Marketplace - Coming Soon modal can be dismissed on ${item.description}`, () => {
      cy.viewport(item.width, item.height)
      cy.closeModal('[data-cy=modal-cta]')
    })

    it.skip(`Chat - Glyph Pack screen is displayed on ${item.description}`, () => {
      cy.viewport(item.width, item.height)
      cy.chatFeaturesSendGlyph()
      cy.goToLastGlyphOnChat().click()
      cy.validateGlyphsModal()
    })

    it.skip(`Chat - Glyph Pack - Coming Soon modal on ${item.description}`, () => {
      cy.viewport(item.width, item.height)
      cy.contains('View Glyph Pack').click()
      cy.get('[data-cy=modal-cta]').should('be.visible')
      cy.closeModal('[data-cy=modal-cta]')
    })

    it.skip(`Chat - Glyph Pack screen can be dismissed on ${item.description}`, () => {
      cy.viewport(item.width, item.height)
      cy.goToLastGlyphOnChat().click()
      cy.get('[data-cy=glyphs-modal]').should('be.visible')
      cy.closeModal('[data-cy=glyphs-modal]')
    })

    it.skip(`Chat - Glyphs Selection - Coming soon modal on ${item.description}`, () => {
      cy.viewport(item.width, item.height)
      cy.get('#glyph-toggle').click()
      cy.get('[data-cy=glyphs-marketplace]').click()
      cy.get('[data-cy=modal-cta]').should('be.visible')
      cy.closeModal('[data-cy=modal-cta]')
    })

    it(`Release Notes Screen on ${item.description}`, () => {
      cy.visitRootPage().then(() => {
        cy.viewport(item.width, item.height)
      })
      cy.releaseNotesScreenValidation()
    })
  })
})
