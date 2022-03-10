const faker = require('faker')
const randomName = faker.internet.userName(name) // generate random name
const randomStatus = faker.lorem.word() // generate random status

it('Try to create account with PIN less than 5 digits', () => {
  cy.visit('/')
  //Enter PIN screen and add an invalid pin
  cy.createAccountPINscreen('1')

  //Error message will be displayed
  cy.contains('Pin must be at least 5 characters.')
})

it('Try to create account without username', () => {
  //Enter PIN screen
  cy.visit('/')
  cy.createAccountPINscreen('test001')

  //Create or Import account selection screen
  cy.createAccountSecondScreen()

  //Privacy Settings screen
  cy.createAccountPrivacyToggles()

  //Recovery Seed Screen
  cy.createAccountRecoverySeed()

  //Clicking without adding a username will throw an error message
  cy.get('[data-cy=sign-in-button]').click()
  cy.contains('Username must be at least 5 characters.')
})

it('Try to create account with NSFW image', () => {
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

  //Attempting to add NSFW image and validating error message is displayed
  const filepathNsfw = 'images/negative-create-account-test.png'
  cy.createAccountAddImage(filepathNsfw)
  cy.get('.red', { timeout: 10000 }).should(
    'have.text',
    'Unable to upload file/s due to NSFW status',
  )
})
