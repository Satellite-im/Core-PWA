import { dataRecovery } from '../fixtures/test-data-accounts.json'

const faker = require('faker')
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
const recoverySeed =
  dataRecovery.accounts
    .filter((item) => item.description === 'Only Text')
    .map((item) => item.recoverySeed) + '{enter}'

describe('Verify passphrase does not get stored in localstorage', () => {
  before(() => {
    cy.clearDatabase()
  })
  it('Passphrase in localstorage does not exist before creating account', () => {
    cy.visitRootPage().then(() => {
      cy.contains('Create Account Pin', { timeout: 30000 }).then(() => {
        cy.validatePassphraseLocalStorage()
      })
    })
  })

  it.skip('Create Account and validate localstorage values are as expected', () => {
    // skipped due to test needs to be updated - AP-1669
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
    cy.clearDatabase()
    cy.visitRootPage().then(() => {
      cy.contains('Create Account Pin', { timeout: 30000 }).then(() => {
        cy.validatePassphraseLocalStorage()
      })
    })
  })

  it.skip('Import Account and verify passphrase is not saved in localstorage', () => {
    // skipped due to test needs to be updated - AP-1669
    // Import Account process executed
    cy.importAccount(randomPIN, recoverySeed)

    //Wait until main page is loaded after importing account
    cy.validateChatPageIsLoaded()

    // Go to URL and validate that previous passphrase is not stored in localstorage
    cy.visit('/').then(() => {
      cy.validatePassphraseLocalStorage()
    })
  })

  it('Logout user on /unlock page', () => {
    cy.visit('/')
    cy.get('[data-cy=add-input]').type('22,A9ZJ[F\t5g', { log: false })
    cy.get('[data-cy=submit-input]').click()
    cy.get('[data-cy=create-account-button]').click()
    cy.contains('I Saved It').click()
    cy.visit('/')
    cy.contains('Not you? Create or import an account').click()
    cy.contains('Not you? Create or import an account', {
      timeout: 30000,
    }).should('not.exist')
  })
})