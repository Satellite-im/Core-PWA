import { data } from '../fixtures/mobile-devices.json'

const faker = require('faker')
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
const randomName = faker.internet.userName(name) // generate random name
const randomStatus = faker.lorem.word() // generate random status
const filepathCorrect = 'images/logo.png'
const randomNumber = faker.datatype.number() // generate random number
const randomMessage = faker.lorem.sentence() // generate random sentence
const recoverySeed =
  'boring over tilt regret diamond rubber example there fire roof sheriff always{enter}'

describe.skip('Run responsiveness tests on several devices', () => {
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
      cy.get('.cropper-container', { timeout: 30000 })
        .should('be.visible')
        .then(() => {
          cy.contains('Crop', { timeout: 30000 }).should('be.visible').click()
        })

      //Finishing Account Creation
      cy.createAccountSubmit()
    })

    it(`Import Account on ${item.description}`, () => {
      cy.viewport(item.width, item.height)
      cy.importAccount(randomPIN, recoverySeed)
    })

    it(`Chat Features on ${item.description}`, () => {
      //Setting viewport
      cy.viewport(item.width, item.height)

      //Validate profile name displayed
      cy.chatFeaturesProfileName('sadad')

      // Click on hamburger menu if width < height
      cy.get('.toggle-sidebar').should('be.visible').click()

      //Validate message and emojis are sent
      cy.waitForMessagesToLoad()
      cy.chatFeaturesSendMessage(randomMessage)
      cy.chatFeaturesSendEmoji('[title="smile"]', '😄')

      //Validate message can be edited
      cy.chatFeaturesEditMessage(randomMessage, randomNumber)
    })

    it(`Release Notes Screen on ${item.description}`, () => {
      cy.visit('/').then(() => {
        cy.viewport(item.width, item.height)
      })
      cy.releaseNotesScreenValidation()
    })
  })
})
