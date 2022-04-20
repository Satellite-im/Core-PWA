const faker = require('faker')
const filepathCorrect = 'images/logo.png'
const filepathNsfw = 'images/negative-create-account-test.png'
const invalidImagePath = 'images/incorrect-image.png'
const randomName = faker.internet.userName(name) // generate random name
const randomStatus = faker.lorem.word() // generate random status
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN

describe('Create Account Validations', () => {
  Cypress.on('uncaught:exception', (err, runnable) => false) // temporary until AP-48 gets fixed
  it('Create Account', () => {
    //Testing in a viewport that does not require to scroll
    cy.viewport(1000, 1200)
    //Enter PIN screen
    cy.createAccountPINscreen(randomPIN, false, false)

    //Create or Import account selection screen
    cy.contains(
      "We're going to create an account for you. On the next screen, you'll see a set of words. Screenshot this or write it down. This is the only way to backup your account.",
    ).should('be.visible')
    cy.get('[data-cy=create-account-button]').should('be.visible')
    cy.createAccountSecondScreen()

    //Privacy Settings screen - Adding text validations below instead of using a command
    //Title and subtitle are visible
    cy.contains('Privacy Settings').should('be.visible')
    cy.contains(
      'Choose which features to enable to best suit your privacy preferences.',
    ).should('be.visible')
    //First toggle and description is visible
    cy.contains('Register Username Publicly').should('be.visible')
    cy.contains(
      'Publicly associate your account ID with a human readable username. Anyone can see this association.',
    ).should('be.visible')
    //Second toggle and description is visible
    cy.contains('Store Account Pin').should('be.visible')
    cy.contains(
      "Store your account pin locally so you don't have to enter it manually every time. This is not recommended.",
    ).should('be.visible')
    //Third toggle and description is visible
    cy.contains('Enable External Embeds').should('be.visible')
    cy.contains(
      'Allow Satellite to fetch data from external sites in order to expand links like Spotify, YouTube, and more.',
    ).should('be.visible')
    //Fourth toggle and description is visible
    cy.contains('Display Current Activity').should('be.visible')
    cy.contains(
      "Allow Satellite to see what games you're playing and show them off on your profile so friends can jump in.",
    ).should('be.visible')
    //Fifth toggle and description is visible
    cy.contains('Consents to having files scanned').should('be.visible')
    cy.contains(
      'In order to share files/use the encrypted file storage I consent to having my files auto-scanned against the Microsoft PhotoDNA service to help prevent the spread of sexual abuse material',
    ).should('be.visible')
    //Option for Signaling Servers
    cy.contains('Signaling Servers').should('be.visible')
    cy.contains(
      "Choose which signaling server group you want to use. If you use 'Satellite + Public Signaling Servers', you are using public servers and Satellite hosted servers to connect with your friends. We do not track connections. We only track server utilization (memory and cpu usage) to know if we need to turn on more signaling servers. If you opt to use 'Only Public Signaling Servers', those are totally outside of Satellite control, so we can not see or have any insight into their operation, logging, or data sharing practices, and you may experience difficulties connecting with friends if the signaling servers are overloaded.",
    ).should('be.visible')

    cy.get('.switch-button')
      .should('be.visible')
      .each(($btn, index, $List) => {
        if (!$btn.hasClass('locked')) {
          if ($btn.hasClass('enabled')) {
            cy.wrap($btn).click().should('not.have.class', 'enabled')
          } else {
            cy.wrap($btn).click().should('have.class', 'enabled')
          }
        }
      })
    cy.get('[data-cy=privacy-continue-button]').should('be.visible').click()

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
    cy.createAccountPrivacyTogglesGoNext()
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
    cy.createAccountPrivacyTogglesGoNext()
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
    cy.createAccountPrivacyTogglesGoNext()
    cy.createAccountRecoverySeed()

    //Adding random data in user input fields
    cy.validateUserInputIsDisplayed()
    cy.createAccountUserInput(randomName, randomStatus)

    //Attempting to add an invalid image and validating error message is displayed
    cy.createAccountAddImage(invalidImagePath)
    cy.get('[data-cy=error-message]', { timeout: 60000 }).should(
      'have.text',
      'Unable to upload, invalid file.',
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

  it('Create account with valid image after attempting to add an invalid image file', () => {
    //Creating pin
    cy.createAccountPINscreen(randomPIN)

    //Clicking on buttons to continue to user data screen
    cy.createAccountSecondScreen()
    cy.createAccountPrivacyTogglesGoNext()
    cy.createAccountRecoverySeed()

    //Adding random data in user input fields
    cy.validateUserInputIsDisplayed()
    cy.createAccountUserInput(randomName, randomStatus)

    //Attempting to add an invalid image and validating error message is displayed
    cy.createAccountAddImage(invalidImagePath)
    cy.get('[data-cy=error-message]', { timeout: 60000 }).should(
      'have.text',
      'Unable to upload, invalid file.',
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
  })
})
