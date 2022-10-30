const faker = require('faker')
const filepathCorrect = 'images/logo.png'
const filepathNsfw = 'images/negative-create-account-test.png'
const invalidImagePath = 'images/incorrect-image.png'
const randomName = faker.internet.password(12, true) // Generate username with 12 characters
const randomStatus = faker.lorem.word() // generate random status
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN

describe('Create Account Validations', () => {
  it('Create Account without profile picture', () => {
    //PIN Info Modal
    cy.visit('/')
    cy.get('[data-cy=info-icon-button]').should('be.visible').click()
    cy.contains('Create Account Password')
    cy.contains(
      "Create a Password to protect your account. The Password can be anything you want, just don't forget it.",
    )
    cy.closeModal('[data-cy=confirmation-modal]')

    //Enter PIN screen
    cy.createAccountPINscreen(randomPIN)

    //Create or Import account selection screen
    cy.contains(
      "We're going to create an account for you. On the next screen, you'll see a set of words. Screenshot this or write it down. This is the only way to backup your account.",
    ).should('be.visible')
    cy.createAccountSecondScreen()

    //Recovery Seed Screen
    cy.contains(
      'Write this down in the order that they appear here. Having the correct order is very important when you are recovering your account.',
    ).should('be.visible')
    cy.createAccountRecoverySeed()

    //Username and Status Input
    cy.validateUserInputIsDisplayed()
    cy.contains(
      'Customize how the world sees you, choose something memorable.',
      {
        timeout: 10000,
      },
    ).should('be.visible')
    cy.createAccountUserInput(randomName, randomStatus)

    //Finishing Account Creation
    cy.createAccountSubmit()
    cy.welcomeModal(randomName)

    cy.contains('Early Access').should('be.visible')

    cy.contains('Please report any bugs or issues at').should('be.visible')

    cy.contains('https://issues.satellite.im')
      .click()
      .should('have.attr', 'href', 'https://issues.satellite.im')
      .should('have.attr', 'target', '_blank')
  })

  //Skipped since loading profile picture is disabled now
  it.skip('Create Account with profile picture', () => {
    //Enter PIN screen
    cy.createAccountPINscreen(randomPIN)

    //Create or Import account selection screen
    cy.contains(
      "We're going to create an account for you. On the next screen, you'll see a set of words. Screenshot this or write it down. This is the only way to backup your account.",
    ).should('be.visible')
    cy.createAccountSecondScreen()

    //Recovery Seed Screen
    cy.contains(
      'Write this down in the order that they appear here. Having the correct order is very important when you are recovering your account.',
    ).should('be.visible')
    cy.createAccountRecoverySeed()

    //Username and Status Input
    cy.validateUserInputIsDisplayed()
    cy.contains(
      'Customize how the world sees you, choose something memorable.',
      {
        timeout: 10000,
      },
    ).should('be.visible')
    cy.createAccountUserInput(randomName, randomStatus)

    //User Image Input
    cy.createAccountAddImage(filepathCorrect)
    cy.get('[data-cy=cropper-container]', { timeout: 60000 })
      .should('be.visible')
      .then(() => {
        cy.contains('Crop', { timeout: 30000 }).should('be.visible').click()
      })

    //Finishing Account Creation
    cy.createAccountSubmit()
    cy.welcomeModal(randomName)
  })

  //Skipped since loading profile picture is disabled now
  it.skip('Create account with non-NSFW after attempting to load a NSFW image', () => {
    //Skipped because profile picture upload is disabled now
    //Creating pin
    cy.createAccountPINscreen(randomPIN)

    //Clicking on buttons to continue to user data screen
    cy.createAccountSecondScreen()
    cy.createAccountRecoverySeed()

    //Adding random data in user input fields
    cy.validateUserInputIsDisplayed()
    cy.createAccountUserInput(randomName, randomStatus)

    //Attempting to add NSFW image and validating error message is displayed
    cy.createAccountAddImage(filepathNsfw)
    cy.get('[data-cy=error-message]', { timeout: 60000 }).should(
      'contain',
      'Unable to upload file/s due to NSFW status',
    )

    //Now adding a non-NSFW image and validating user can pass to next step
    cy.createAccountAddImage(filepathCorrect)
    cy.get('[data-cy=cropper-container]', { timeout: 60000 })
      .should('be.visible')
      .then(() => {
        cy.contains('Crop', { timeout: 30000 }).should('be.visible').click()
      })
    cy.get('[data-cy=error-message]').should('not.exist')

    //Finishing Account Creation
    cy.createAccountSubmit()
    cy.welcomeModal(randomName)
  })

  //Skipped since loading profile picture is disabled now
  it.skip('Create account successfully without image after attempting to add a NSFW picture', () => {
    //Skipped because profile picture upload is disabled now
    //Creating pin
    cy.createAccountPINscreen(randomPIN)

    //Clicking on buttons to continue to user data screen

    cy.createAccountSecondScreen()
    cy.createAccountRecoverySeed()

    //Adding random data in user input fields
    cy.validateUserInputIsDisplayed()
    cy.createAccountUserInput(randomName, randomStatus)

    //Attempting to add NSFW image and validating error message is displayed
    cy.createAccountAddImage(filepathNsfw)
    cy.get('[data-cy=error-message]', { timeout: 30000 }).should(
      'contain',
      'Unable to upload file/s due to NSFW status',
    )

    //User is still able to sign in and NSFW image will not be loaded
    cy.createAccountSubmit()
    cy.welcomeModal(randomName)

    //Validating profile picture is null and default satellite circle is displayed
    cy.validateChatPageIsLoaded()
    cy.get(
      '[data-cy=satellite-circle-profile] > [data-cy=circle-without-picture]',
    ).should('be.visible')
    cy.get(
      '[data-cy=satellite-circle-profile] > [data-cy=circle-has-picture]',
    ).should('not.exist')
  })

  //Skipped since loading profile picture is disabled now
  it.skip('Create account without image after attempting to add an invalid image file', () => {
    //Skipped because profile picture upload is disabled now
    //Creating pin
    cy.createAccountPINscreen(randomPIN)

    //Clicking on buttons to continue to user data screen
    cy.createAccountSecondScreen()
    cy.createAccountRecoverySeed()

    //Adding random data in user input fields
    cy.validateUserInputIsDisplayed()
    cy.createAccountUserInput(randomName, randomStatus)

    //Attempting to add an invalid image and validating error message is displayed
    cy.createAccountAddImage(invalidImagePath)
    cy.get('[data-cy=error-message]', { timeout: 60000 }).should(
      'contain',
      'Please upload a valid image type such as JPG, PNG or SVG',
    )

    //User is still able to sign in and invalid image will not be loaded
    cy.createAccountSubmit()
    cy.welcomeModal(randomName)

    //Validating profile picture is null
    cy.validateChatPageIsLoaded()
    cy.get(
      '[data-cy=satellite-circle-profile] > [data-cy=circle-without-picture]',
    ).should('be.visible')
    cy.get(
      '[data-cy=satellite-circle-profile] > [data-cy=circle-has-picture]',
    ).should('not.exist')
  })

  //Skipped since loading profile picture is disabled now
  it.skip('Create account with valid image after attempting to add an invalid image file', () => {
    //Skipped because profile picture upload is disabled now
    //Creating pin
    cy.createAccountPINscreen(randomPIN)

    //Clicking on buttons to continue to user data screen
    cy.createAccountSecondScreen()
    cy.createAccountRecoverySeed()

    //Adding random data in user input fields
    cy.validateUserInputIsDisplayed()
    cy.createAccountUserInput(randomName, randomStatus)

    //Attempting to add an invalid image and validating error message is displayed
    cy.createAccountAddImage(invalidImagePath)
    cy.get('[data-cy=error-message]', { timeout: 60000 }).should(
      'contain',
      'Please upload a valid image type such as JPG, PNG or SVG',
    )

    //Now adding a valid image and validating user can pass to next step
    cy.createAccountAddImage(filepathCorrect)
    cy.get('[data-cy=cropper-container]', { timeout: 60000 })
      .should('be.visible')
      .then(() => {
        cy.contains('Crop', { timeout: 30000 }).should('be.visible').click()
      })
    cy.get('[data-cy=error-message]').should('not.exist')

    //User is able to sign in after adding a correct image
    cy.createAccountSubmit()
    cy.welcomeModal(randomName)

    //Validating profile picture is Not null
    cy.validateChatPageIsLoaded()
    cy.get(
      '[data-cy=satellite-circle-profile] > [data-cy=circle-has-picture]',
    ).should('be.visible')
    cy.get(
      '[data-cy=satellite-circle-profile] > [data-cy=circle-without-picture]',
    ).should('not.exist')
  })
})
