import { dataRecovery } from '../fixtures/test-data-accounts.json'

const faker = require('faker')
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
const recoverySeed =
  dataRecovery.accounts
    .filter((item) => item.description === 'Only Text')
    .map((item) => item.recoverySeed) + '{enter}'

describe('Verify passphrase does not get stored in localstorage', () => {
  it('Passphrase in localstorage does not exist before creating account', () => {
    cy.visitRootPage().then(() => {
      cy.contains('Create Account Pin', { timeout: 30000 }).then(() => {
        cy.validatePassphraseLocalStorage()
      })
    })
  })

  it.skip('Create Account and validate localstorage values are as expected', () => {
    //Skipped because we are going to ask if it is needed to store the passphrase or not in localstorage
    // Create Account process executed
    cy.createAccount(randomPIN)

    //Wait until main page is loaded after creating account
    cy.validateChatPageIsLoaded()

    // Go to main URL and validate that previous passphrase is not stored in localstorage
    cy.visit('/').then(() => {
      cy.validatePassphraseLocalStorage()
    })
  })

  it('Passphrase in localstorage does not exist before importing an account', () => {
    cy.visitRootPage().then(() => {
      cy.contains('Create Account Pin', { timeout: 30000 }).then(() => {
        cy.validatePassphraseLocalStorage()
      })
    })
  })

  it.skip('Import Account and verify passphrase is not saved in localstorage', () => {
    // Import Account process executed
    //Skipped because we are going to ask if it is needed to store the passphrase or not in localstorage
    cy.importAccount(randomPIN, recoverySeed)

    //Wait until main page is loaded after importing account
    cy.validateChatPageIsLoaded()

    // Go to URL and validate that previous passphrase is not stored in localstorage
    cy.visit('/').then(() => {
      cy.validatePassphraseLocalStorage()
    })
  })

  it('Logout user on /unlock page', () => {
    //Enter a random PIN
    cy.createAccountPINscreen(randomPIN)

    //Click on Create Account and then on I Saved It
    cy.createAccountSecondScreen()
    cy.createAccountRecoverySeed()

    //Ensure that User Input Screen is displayed and go to root page again
    cy.validateUserInputIsDisplayed()
    cy.visit('/')

    //Not you? Create or import an account text is displayed and user clicks on it
    cy.contains('Not you? Create or import an account').click()

    //Now user is prompted to start again creating the pin
    cy.contains('Not you? Create or import an account', {
      timeout: 30000,
    }).should('not.exist')
    cy.contains('Choose Your Pin').should('be.visible')
  })
})
