import { dataRecovery } from '../fixtures/test-data-accounts.json'

const faker = require('faker')
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
const randomName = faker.internet.password(12, true) // Generate username with 12 characters
const recoverySeed =
  dataRecovery.accounts
    .filter((item) => item.description === 'Only Text')
    .map((item) => item.recoverySeed) + '{enter}'

describe('Verify passphrase does not get stored in localstorage', () => {
  it('Passphrase in localstorage does not exist before creating account', () => {
    cy.visitRootPage()
    cy.contains('Choose Your Password').should('be.visible')
    cy.validateEmptyLocalStorage()
  })

  it('Create Account and validate localstorage values are as expected', () => {
    // Create Account process executed
    cy.createAccount(randomPIN, randomName)

    //Wait until main page is loaded after creating account
    cy.validateChatPageIsLoaded()

    // Go to main URL and validate that passphrase is stored in localstorage with a username and encrypted passphrase
    cy.visit('/')
    cy.contains('Decrypt Account').should('be.visible')
    cy.validatePopulatedLocalStorage(randomName)
  })

  it('Passphrase in localstorage does not exist before importing an account', () => {
    cy.visitRootPage()
    cy.contains('Choose Your Password').should('be.visible')
    cy.validateEmptyLocalStorage()
  })

  //Skipped because import account is not currently working
  it.skip('Import Account and verify passphrase is not saved in localstorage', () => {
    // Import Account process executed
    cy.importAccount(randomPIN, recoverySeed)

    //Wait until main page is loaded after importing account
    cy.validateChatPageIsLoaded()

    // Go to main URL and validate that passphrase is stored in localstorage with a username and encrypted passphrase
    cy.visit('/')
    cy.validatePopulatedLocalStorage()
  })
})
