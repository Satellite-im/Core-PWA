const faker = require('faker')
const filepathCorrect = 'images/logo.png'
const filepathNsfw = 'images/negative-create-account-test.png'
const randomName = faker.internet.userName(name) // generate random name
const randomStatus = faker.lorem.word() // generate random status
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN

describe('Create Account Validations', () => {
  Cypress.on('uncaught:exception', (err, runnable) => false) // temporary until AP-48 gets fixed
  it('Create Account', () => {
    //Enter PIN screen
    cy.createAccountPINscreen(randomPIN, false, true, false)

    //Create or Import account selection screen
    cy.contains(
      "We're going to create an account for you. On the next screen, you'll see a set of words. Screenshot this or write it down. This is the only way to backup your account.",
    ).should('be.visible')
    cy.get('.is-primary > #custom-cursor-area').should('be.visible')
    cy.createAccountSecondScreen()

    //Privacy Settings screen
    cy.createAccountPrivacyToggles()

    //Recovery Seed Screen
    cy.get('.title').should('be.visible').should('contain', 'Recovery Seed')
    cy.contains('I Saved It').should('be.visible')
    cy.get('#custom-cursor-area').should('be.visible')
    cy.createAccountRecoverySeed()

    //Username and Status Input
    cy.contains(
      'Customize how the world sees you, choose something memorable.',
      {
        timeout: 10000,
      },
    ).should('be.visible')
    cy.get('[data-cy=username-input]').should('be.visible')
    cy.get('[data-cy=status-input]').should('be.visible')
    cy.createAccountUserInput(randomName, randomStatus)

    //User Image Input
    cy.createAccountAddImage(filepathCorrect)
    cy.get('.cropper-container', { timeout: 30000 })
      .should('be.visible')
      .then(() => {
        cy.contains('Crop', { timeout: 30000 }).should('be.visible').click()
      })

    //Finishing Account Creation
    cy.createAccountSubmit()
  })

  it('Create account with non-NSFW after attempting to load a NSFW image', () => {
    //Creating pin
    cy.createAccountPINscreen(randomPIN)

    //Clicking on buttons to continue to user data screen
    cy.createAccountSecondScreen()
    cy.createAccountPrivacyTogglesGoNext()
    cy.createAccountRecoverySeed()

    //Adding random data in user input fields
    cy.createAccountUserInput(randomName, randomStatus)

    //Attempting to add NSFW image and validating error message is displayed
    cy.createAccountAddImage(filepathNsfw)
    cy.get('.red', { timeout: 30000 }).should(
      'have.text',
      'Unable to upload file/s due to NSFW status',
    )

    //Now adding a non-NSFW image and validating user can pass to next step
    cy.createAccountAddImage(filepathCorrect)
    cy.get('.cropper-container', { timeout: 30000 })
      .should('be.visible')
      .then(() => {
        cy.contains('Crop', { timeout: 30000 }).should('be.visible').click()
      })
    cy.get('.red').should('not.exist')

    //Finishing Account Creation
    cy.createAccountSubmit()
  })

  it('Create account successfully without image after attempting to add a NSFW picture', () => {
    //Creating pin
    cy.createAccountPINscreen(randomPIN)

    //Clicking on buttons to continue to user data screen

    cy.createAccountSecondScreen()
    cy.createAccountPrivacyTogglesGoNext()
    cy.createAccountRecoverySeed()

    //Adding random data in user input fields
    cy.createAccountUserInput(randomName, randomStatus)

    //Attempting to add NSFW image and validating error message is displayed
    cy.createAccountAddImage(filepathNsfw)
    cy.get('.red', { timeout: 30000 }).should(
      'have.text',
      'Unable to upload file/s due to NSFW status',
    )

    //User is still able to sign in and NSFW image will not be loaded
    cy.createAccountSubmit()

    //Validating profile picture is null and default satellite circle is displayed
    cy.get('.user-state > .is-rounded > .satellite-circle', {
      timeout: 120000,
    })
      .scrollIntoView()
      .should('exist')
  })
})
