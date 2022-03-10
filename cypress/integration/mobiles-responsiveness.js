import { data } from '../fixtures/mobile-devices.json'

const faker = require('faker')
const randomName = faker.internet.userName(name) // generate random name
const randomStatus = faker.lorem.word() // generate random status
const filepathCorrect = 'images/logo.png'
const randomNumber = faker.datatype.number() // generate random number
const randomMessage = faker.lorem.sentence() // generate random sentence

describe('Run responsiveness tests on several devices', () => {
  data.allDevices.forEach((item) => {
    it(`Create Account on ${item.description}`, () => {
      //Visiting main page and changing viewport
      cy.visit('/')
      cy.viewport(item.width, item.height)

      //Enter PIN screen
      cy.createAccountPINscreen('test001')

      //Create or Import account selection screen
      cy.createAccountSecondScreen()

      //Privacy Settings screen
      cy.createAccountPrivacyToggles()

      //Recovery Seed Screen
      cy.createAccountRecoverySeed()

      //Username and Status Input
      cy.createAccountUserInput(randomName, randomStatus)

      //User Image Input
      cy.createAccountAddImage(filepathCorrect)
      cy.contains('Crop', { timeout: 20000 }).should('be.visible').click()

      //Finishing Account Creation
      cy.createAccountSubmit()
    })

    it(`Import Account on ${item.description}`, () => {
      cy.viewport(item.width, item.height)
      cy.importAccount()
    })

    it(`Chat Features on ${item.description}`, () => {
      //Setting viewport
      cy.viewport(item.width, item.height)

      //Validate profile name displayed
      cy.chatFeaturesProfileName('asdad')

      // Click on hamburger menu if width < height
      cy.get('.toggle-sidebar').should('be.visible').click()

      //Validate message and emojis are sent
      cy.chatFeaturesSendMessage(randomMessage)
      cy.chatFeaturesSendEmoji('[title="smile"]', '😄')

      //Validate message can be edited
      cy.chatFeaturesEditMessage(randomMessage, randomNumber)
    })

    it(`Release Notes Screen on ${item.description}`, () => {
      cy.viewport(item.width, item.height)
      cy.visit('/')
      cy.releaseNotesScreenValidation()
    })
  })
})
