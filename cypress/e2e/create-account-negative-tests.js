const faker = require('faker')
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
const randomName = faker.internet.password(12, true) // Generate username with 12 characters
const randomStatus = faker.lorem.word() // generate random status
const filepathNsfw = 'images/negative-create-account-test.png'

describe('Create Account - Negative Tests', () => {
  it('Try to create account with PIN less than 5 digits', () => {
    //Enter PIN screen and add an invalid pin
    cy.createAccountPINscreen('1')

    //Error message will be displayed
    cy.contains('Password must be at least 5 characters.').should('be.visible')
  })

  it('Try to create account without username', () => {
    //Enter PIN screen
    cy.createAccountPINscreen(randomPIN)

    //Create or Import account selection screen
    cy.createAccountSecondScreen()

    //Recovery Seed Screen
    cy.createAccountRecoverySeed()

    //Clicking without adding a username will throw an error message
    cy.validateUserInputIsDisplayed()
    cy.get('[data-cy=sign-in-button]').click()
    cy.contains('Enter a username of at least 5 characters, up to 32')
  })

  it.skip('Try to create account with NSFW image', () => {
    //Skipped since loading profile picture is disabled now
    //Enter PIN screen
    cy.createAccountPINscreen(randomPIN)

    //Create or Import account selection screen
    cy.createAccountSecondScreen()

    //Recovery Seed Screen
    cy.createAccountRecoverySeed()

    //Username and Status Input
    cy.validateUserInputIsDisplayed()
    cy.createAccountUserInput(randomName, randomStatus)

    //Attempting to add NSFW image and validating error message is displayed
    cy.createAccountAddImage(filepathNsfw)
    cy.get('[data-cy=error-message]', { timeout: 30000 }).should(
      'contain',
      'Unable to upload file/s due to NSFW status',
    )
  })
})
