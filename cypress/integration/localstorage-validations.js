const faker = require('faker')
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
const recoverySeed =
  'boring over tilt regret diamond rubber example there fire roof sheriff always{enter}'

describe('Verify passphrase does not get stored in localstorage', () => {
  it('Passphrase in localstorage does not exist before creating account', () => {
    cy.visitRootPage().then(() => {
      cy.contains('Create Account Pin', { timeout: 30000 }).then(() => {
        cy.validatePassphraseLocalStorage()
      })
    })
  })

  it.skip('Create Account and validate localstorage values are as expected', () => {
    // Create Account process executed
    cy.createAccount(randomPIN)

    //Wait until main page is loaded after creating account
    cy.get('[data-cy=user-state]', {
      timeout: 120000,
    })
      .scrollIntoView()
      .should('be.visible')

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
    cy.importAccount(randomPIN, recoverySeed)

    //Wait until main page is loaded after importing account
    cy.contains('sadad', { timeout: 60000 }).should('be.visible')

    // Go to URL and validate that previous passphrase is not stored in localstorage
    cy.visit('/').then(() => {
      cy.validatePassphraseLocalStorage()
    })
  })
})
