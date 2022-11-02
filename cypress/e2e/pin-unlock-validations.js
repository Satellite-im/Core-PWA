import { dataRecovery } from '../fixtures/test-data-accounts.json'

const faker = require('faker')
const userPassphrase = dataRecovery.accounts
  .filter((item) => item.description === 'Only Text')
  .map((item) => item.recoverySeed)
  .toString()
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
const firstUserName = faker.internet.password(12, true) // Generate username with 12 characters
const secondUserName = faker.internet.password(12, true) // Generate username with 12 characters
const thirdUserName = faker.internet.password(12, true) // Generate username with 12 characters

describe('Unlock pin should be persisted when store pin is enabled', () => {
  it('Create Account with store pin disabled', () => {
    //Run create account command passing randomPin, randomName and savePin=false
    cy.createAccount(randomPIN, firstUserName, false)

    // Go to main URL again and validate that user is prompt to enter pin again
    cy.visit('/')
    cy.contains('Decrypt Account').should('be.visible')
  })

  it('Create Account with store pin enabled', () => {
    //Run create account command passing randomPin, randomName and savePin=true
    cy.createAccount(randomPIN, secondUserName, true)

    // Go to main URL again and validate that user is redirected to chat screen since pin was saved
    cy.visit('/')
    cy.validateChatPageIsLoaded()
  })

  //Skipped since Import Account is not currently working
  it.skip('Import Account with store pin disabled', { retries: 2 }, () => {
    //Go to URL, add a PIN and make sure that toggle for save pin is disabled
    cy.importAccountPINscreen(randomPIN)

    //Follow the next steps to import an account
    cy.importAccountEnterPassphrase(userPassphrase)

    //Wait until main page is loaded after importing account
    cy.validateChatPageIsLoaded()

    // Go to main URL again and validate that user is prompt to enter pin again
    cy.visit('/').then(() => {
      cy.contains('Decrypt Account').should('be.visible')
    })
  })

  //Skipped since Import Account is not currently working
  it.skip('Import Account with store pin enabled', { retries: 2 }, () => {
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

  it('Logout user on /unlock page', () => {
    //Run create account command passing randomPin and randomName
    cy.createAccount(randomPIN, thirdUserName)

    //Visit root page again
    cy.visit('/')
    cy.contains('Decrypt Account').should('be.visible')

    //Not you? Create or import an account text is displayed and user clicks on it
    cy.contains('Not you? Create or import an account').click()

    //Confirmation modal is displayed
    cy.get('[data-cy=confirmation-modal]').should('be.visible')
    cy.contains('This will clear your account').should('be.visible')
    cy.contains(
      'Are you sure you want to clear your account and all data?',
    ).should('be.visible')

    //Click on confirm
    cy.get('[data-cy=confirm-button]').click()

    //Now user is prompted to start again creating the pin
    cy.contains('Choose Your Password').should('be.visible')
  })
})
