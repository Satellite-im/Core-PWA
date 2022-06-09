const faker = require('faker')
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
const randomName = faker.internet.userName(name) // generate random name
const randomStatus = faker.lorem.word() // generate random status
const filepathNsfw = 'images/negative-create-account-test.png'

describe('Create Account - Negative Tests', () => {
  it('Try to create account with PIN less than 5 digits', () => {
    //Enter PIN screen and add an invalid pin
    cy.createAccountPINscreen('1')

    //Error message will be displayed
    cy.contains('Pin must be at least 5 characters.')
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

  it('Try to create account with NSFW image', () => {
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
      'have.text',
      'Unable to upload file/s due to NSFW status',
    )
  })

  it.skip('Logout user on /unlock page', () => {
    // skipped due to textile/solana issues
    cy.visit('/')
    cy.get('[data-cy=add-input]').type('22,A9ZJ[F\t5g', { log: false })
    cy.get('[data-cy=submit-input]').click()
    cy.get('[data-cy=create-account-button]').click()
    cy.contains('I Saved It').click()
    cy.get('[data-cy=username-input]')
      .should('be.visible')
      .trigger('input')
      .type(randomName)
    cy.intercept(
      {
        method: 'POST',
        url: 'faucet.satellite.one/*',
      },
      (req) => {
        req.destroy()
      },
    )
    cy.get('[data-cy=sign-in-button]').click()
    cy.intercept(
      {
        method: 'POST',
        url: 'faucet.satellite.one/*',
      },
      (req) => {
        req.destroy()
      },
    )
    cy.intercept(
      {
        method: 'POST',
        url: 'https://solana--devnet.datahub.figment.io/*',
      },
      (req) => {
        req.destroy()
      },
    )
    cy.contains('Oops! Please Stand By', { timeout: 90000 }).should(
      'be.visible',
    )
    cy.contains('Try Again').click()
    cy.validateChatPageIsLoaded()
  })
})
