const faker = require('faker')
const filepathCorrect = 'images/logo.png'
const filepathNsfw = 'images/negative-create-account-test.png'
const invalidImagePath = 'images/incorrect-image.png'
const randomName = faker.internet.userName(name) // generate random name
const randomStatus = faker.lorem.word() // generate random status
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN

describe('Create Account Validations', () => {
  it('Create Account', () => {
    //Enter PIN screen
    cy.createAccountPINscreen(randomPIN, false, false)

    //Create or Import account selection screen
    cy.contains(
      "We're going to create an account for you. On the next screen, you'll see a set of words. Screenshot this or write it down. This is the only way to backup your account.",
    ).should('be.visible')
    cy.get('[data-cy=create-account-button]').should('be.visible')
    cy.createAccountSecondScreen()

    //Recovery Seed Screen
    cy.get('.title').should('be.visible').should('contain', 'Recovery Seed')
    cy.contains('I Saved It').should('be.visible')
    cy.get('#custom-cursor-area').should('be.visible')
    cy.createAccountRecoverySeed()

    //Username and Status Input
    cy.validateUserInputIsDisplayed()
    cy.contains(
      'Customize how the world sees you, choose something memorable.',
      {
        timeout: 10000,
      },
    ).should('be.visible')
    cy.get('[data-cy=status-input]').should('be.visible')
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
  })

  it('Create account with non-NSFW after attempting to load a NSFW image', () => {
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
      'have.text',
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
  })

  it('Create account successfully without image after attempting to add a NSFW picture', () => {
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
      'have.text',
      'Unable to upload file/s due to NSFW status',
    )

    //User is still able to sign in and NSFW image will not be loaded
    cy.createAccountSubmit()

    //Validating profile picture is null and default satellite circle is displayed
    cy.validateChatPageIsLoaded()
    cy.get(
      '[data-cy=satellite-circle-profile] > [data-cy=circle-without-picture]',
    ).should('be.visible')
    cy.get(
      '[data-cy=satellite-circle-profile] > [data-cy=circle-has-picture]',
    ).should('not.exist')
  })

  it('Create account without image after attempting to add an invalid image file', () => {
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
      'have.text',
      'Please upload a valid image type such as JPG, PNG or SVG',
    )

    //User is still able to sign in and invalid image will not be loaded
    cy.createAccountSubmit()

    //Validating profile picture is null
    cy.validateChatPageIsLoaded()
    cy.get(
      '[data-cy=satellite-circle-profile] > [data-cy=circle-without-picture]',
    ).should('be.visible')
    cy.get(
      '[data-cy=satellite-circle-profile] > [data-cy=circle-has-picture]',
    ).should('not.exist')
  })

  it(
    'Create account with valid image after attempting to add an invalid image file',
    { retries: 2 },
    () => {
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
        'have.text',
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

      //Validating profile picture is Not null
      cy.validateChatPageIsLoaded()
      cy.get(
        '[data-cy=satellite-circle-profile] > [data-cy=circle-has-picture]',
      ).should('be.visible')
      cy.get(
        '[data-cy=satellite-circle-profile] > [data-cy=circle-without-picture]',
      ).should('not.exist')
    },
  )
})
