const faker = require('faker')
const userPassphrase =
  'veteran intact there despair unique trouble season rebel sort file unit hard'
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN

describe('Unlock pin should be persisted when store pin is enabled', () => {
  it('Create Account with store pin disabled', () => {
    //Go to URL, add a PIN and make sure that toggle for save pin is disabled
    cy.createAccountPINscreen(randomPIN, false, false)

    //Follow the next steps to create an account
    cy.createAccountSecondScreen()
    cy.createAccountPrivacyTogglesGoNext()
    cy.createAccountRecoverySeed()
    cy.createAccountUserInput()
    cy.createAccountSubmit()

    //Wait until main page is loaded after creating account
    cy.get('[data-cy=user-state]', {
      timeout: 120000,
    }).should('be.visible')

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
    cy.createAccountPrivacyTogglesGoNext()
    cy.createAccountRecoverySeed()
    cy.createAccountUserInput()
    cy.createAccountSubmit()

    //Wait until main page is loaded after creating account
    cy.get('[data-cy=user-state]', {
      timeout: 120000,
    }).should('be.visible')

    // Go to main URL again and validate that user is redirected to chat screen and pin was saved
    cy.visit('/').then(() => {
      cy.get('#status > .user-state > .is-rounded > .satellite-circle', {
        timeout: 120000,
      }).should('be.visible')
    })
  })

  it('Import Account with store pin disabled', () => {
    //Go to URL, add a PIN and make sure that toggle for save pin is disabled
    cy.importAccountPINscreen(randomPIN, false, false)

    //Follow the next steps to import an account
    cy.importAccountEnterPassphrase(userPassphrase)

    //Wait until main page is loaded after importing account
    cy.get('[data-cy=user-state]', {
      timeout: 120000,
    }).should('be.visible')

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
    cy.get('[data-cy=user-state]', {
      timeout: 120000,
    }).should('be.visible')

    // Go to main URL again and validate that user is redirected to chat screen and pin was saved
    cy.visit('/').then(() => {
      cy.get('#status > .user-state > .is-rounded > .satellite-circle', {
        timeout: 120000,
      }).should('be.visible')
    })
  })
})
