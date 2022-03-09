const faker = require('faker')
const randomName = faker.internet.userName(name) // generate random name
const randomStatus = faker.lorem.word() // generate random status
const filepathCorrect = 'images/logo.png'
const filepathNsfw = 'images/negative-create-account-test.png'

it('Create Account', () => {
  cy.visit('/')
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

it('Create account with non-NSFW after attempting to load a NSFW image', () => {
  cy.visit('/')
  //Creating pin, clicking on buttons to continue to user data screen
  cy.createAccountPINscreen('test001')
  cy.createAccountSecondScreen()
  cy.createAccountPrivacyToggles()
  cy.createAccountRecoverySeed()

  //Adding random data in user input fields
  cy.createAccountUserInput(randomName, randomStatus)

  //Attempting to add NSFW image and validating error message is displayed
  cy.createAccountAddImage(filepathNsfw)
  cy.get('.red', { timeout: 30000 }).should(
    'have.text',
    'Unable to upload file/s due to NSFW status',
  )

  //Now adding a non-NSFW image and validating user can pass to next step
  cy.createAccountAddImage(filepathCorrect)
  cy.contains('Crop', { timeout: 10000 }).click()
  cy.get('.red').should('not.exist')

  //Finishing Account Creation
  cy.createAccountSubmit()
})

it('Create account successfully without image after attempting to add a NSFW picture', () => {
  cy.visit('/')
  //Creating pin, clicking on buttons to continue to user data screen
  cy.createAccountPINscreen('test001')
  cy.createAccountSecondScreen()
  cy.createAccountPrivacyToggles()
  cy.createAccountRecoverySeed()

  //Adding random data in user input fields
  cy.createAccountUserInput(randomName, randomStatus)

  //Attempting to add NSFW image and validating error message is displayed
  cy.createAccountAddImage(filepathNsfw)
  cy.get('.red', { timeout: 30000 }).should(
    'have.text',
    'Unable to upload file/s due to NSFW status',
  )

  //User is still able to sign in and NSFW image will not be loaded
  cy.createAccountSubmit()

  //Validating profile picture is null and default satellite circle is displayed
  cy.get('.user-state > .is-rounded > .satellite-circle', {
    timeout: 40000,
  }).should('exist')
})
