import { dataRecovery } from '../fixtures/test-data-accounts.json'

const faker = require('faker')
const userPassphrase = dataRecovery.accounts
  .filter((item) => item.description === 'cypress')
  .map((item) => item.recoverySeed)
  .toString()
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN

describe('Unlock pin should be persisted when store pin is enabled', () => {
  it('Create Account with store pin disabled', () => {
    //Go to URL, add a PIN and make sure that toggle for save pin is disabled
    cy.createAccountPINscreen(randomPIN, false, false)

    //Follow the next steps to create an account
    cy.createAccountSecondScreen()
    cy.createAccountRecoverySeed()
    cy.validateUserInputIsDisplayed()
    cy.createAccountUserInput()
    cy.createAccountSubmit()

    //Wait until main page is loaded after creating account
    cy.validateChatPageIsLoaded()

    // Go to main URL again and validate that user is prompt to enter pin again
    cy.visit('/').then(() => {
      cy.contains('Decrypt Account').should('be.visible')
    })
  })

  it('Create Account with store pin enabled', () => {
    //Go to URL, add a PIN and make sure that toggle for save pin is enabled
    cy.createAccountPINscreen(randomPIN, true, false)

    //Follow the next steps to create an account
    cy.createAccountSecondScreen()
    cy.createAccountRecoverySeed()
    cy.validateUserInputIsDisplayed()
    cy.createAccountUserInput()
    cy.createAccountSubmit()

    //Wait until main page is loaded after creating account
    cy.validateChatPageIsLoaded()

    // Go to main URL again and validate that user is redirected to chat screen and pin was saved
    cy.visit('/').then(() => {
      cy.validateChatPageIsLoaded()
    })
  })

  it('Import Account with store pin disabled', () => {
    //Go to URL, add a PIN and make sure that toggle for save pin is disabled
    cy.importAccountPINscreen(randomPIN, false, false)

    //Follow the next steps to import an account
    cy.importAccountEnterPassphrase(userPassphrase)

    //Wait until main page is loaded after importing account
    cy.validateChatPageIsLoaded()

    // Go to main URL again and validate that user is prompt to enter pin again
    cy.visit('/').then(() => {
      cy.contains('Decrypt Account').should('be.visible')
    })
  })

  it('Import Account with store pin enabled', () => {
    //Go to URL, add a PIN and make sure that toggle for save pin is enabled
    cy.importAccountPINscreen(randomPIN, true, false)

    //Follow the next steps to import an account
    cy.importAccountEnterPassphrase(userPassphrase)

    //Wait until main page is loaded after importing account
    cy.validateChatPageIsLoaded()

    // Go to main URL again and validate that user is redirected to chat screen and pin was saved
    cy.visit('/').then(() => {
      cy.validateChatPageIsLoaded()
    })
  })
})
