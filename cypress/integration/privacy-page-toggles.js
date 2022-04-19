const faker = require('faker')
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
const randomName = faker.internet.userName(name) // generate random name
const randomStatus = faker.lorem.word() // generate random status

//Creating two arrays to compare values displayed in toggle switches on both screens
let toggleStatusSaved = []
let toggleStatusProfile = []

describe('Privacy Page Toggles Tests', () => {
  Cypress.on('uncaught:exception', (err, runnable) => false) // to bypass Module build failed: Error: ENOENT: No such file or directory issue randomly presented

  it('Privacy page - Verify all non-locked toggles switches work as should', () => {
    //Adding pin to continue to toggles switches screen
    cy.createAccountPINscreen(randomPIN)

    //Create or Import account selection screen
    cy.createAccountSecondScreen()
    //Validating each toggle, checking status is correct after clicking them.
    //Finally, saving values into an array for later comparison
    cy.get('[data-cy=switch-button]', { timeout: 30000 }).each(
      ($btn, index, $List) => {
        if (!$btn.hasClass('locked')) {
          if ($btn.hasClass('enabled')) {
            cy.wrap($btn).click().should('not.have.class', 'enabled')
            toggleStatusSaved.push(false)
          } else {
            cy.wrap($btn).click().should('have.class', 'enabled')
            toggleStatusSaved.push(true)
          }
        }
      },
    )
  })

  it('Privacy page - Verify register publicly toggle is locked and disabled', () => {
    cy.get('[data-cy=switch-button]', { timeout: 30000 }).each(
      ($btn, index, $List) => {
        if ($btn.hasClass('locked')) {
          expect($btn).to.not.have.class('enabled')
          expect($btn).to.have.class('locked')
          cy.wrap($btn).realHover()
          // Move back cursor to top left again
          cy.get('body').realHover({ position: 'topLeft' })
        }
      },
    )
  })

  it.skip('Privacy page - Verify user can still proceed after adjusting switches', () => {
    //Click on next
    cy.get('[data-cy=privacy-continue-button]').click()

    //Recovery Seed Screen
    cy.createAccountRecoverySeed()

    //Username and Status Input
    cy.validateUserInputIsDisplayed()
    cy.createAccountUserInput(randomName, randomStatus)

    //Click on button, validate buffering screen and that user is redirected to friends/list
    cy.createAccountSubmit()
    cy.validateChatPageIsLoaded()
    //Going to Settings and Privacy screen
    cy.get('[data-cy=settings]', { timeout: 30000 }).click()
  })

  it.skip('Profile - Verify the toggles user added when signing up are on the same status when user goes to settings', () => {
    cy.contains('Privacy').click()
    //Storing the values from toggle switches status of Settings screen into an array
    cy.get('[data-cy=switch-button]')
      .each(($btn, index, $List) => {
        if (!$btn.hasClass('locked')) {
          if ($btn.hasClass('enabled')) {
            toggleStatusProfile.push(true)
          } else {
            toggleStatusProfile.push(false)
          }
        }
      })
      .then(() => {
        //Comparison of both arrays to ensure that are deep equal
        expect(toggleStatusProfile).to.deep.equal(toggleStatusSaved)
      })
  })

  it.skip('Profile - Verify user can’t update the register name publicly toggle on settings', () => {
    //Identify the first switch button and ensure that is locked
    cy.get('[data-cy=switch-button]').first().should('have.class', 'locked')
  })

  it('Privacy page - Verify all non-locked toggles can be switched to enable', () => {
    //Adding pin to continue to toggles switches screen
    cy.createAccountPINscreen(randomPIN)

    //Create or Import account selection screen
    cy.createAccountSecondScreen()

    //Switch all non-locked switched to enabled
    cy.get('[data-cy=switch-button]').each(($btn, index, $List) => {
      if (!$btn.hasClass('locked')) {
        if (!$btn.hasClass('enabled')) {
          cy.wrap($btn).click().should('have.class', 'enabled')
        } else {
          cy.wrap($btn).should('have.class', 'enabled')
        }
      }
    })
  })

  it('Privacy page - Verify all non-locked toggles can be switched to disabled', () => {
    //Switch all non-locked switched to disabled
    cy.get('[data-cy=switch-button]').each(($btn, index, $List) => {
      if (!$btn.hasClass('locked')) {
        if ($btn.hasClass('enabled')) {
          cy.wrap($btn).click().should('not.have.class', 'enabled')
        } else {
          cy.wrap($btn).should('not.have.class', 'enabled')
        }
      }
    })
  })

  it('Privacy page - Signup with Consents to having files scanned deactivated toggle', () => {
    //Switch toggle to disabled
    cy.privacyToggleClick('Consents to having files scanned', false)
  })

  it('Privacy page - Signup with Satellite and Public Signaling Servers', () => {
    //Keep default option of using Satellite and Public Signaling Servers selected
    cy.get('[data-cy=custom-select]').should('be.visible')
    cy.validateSignalingServersValue('Satellite + Public Signaling Servers')
  })

  it.skip('Settings - Consents to having files scanned toggle should be deactivated', () => {
    //Click on next
    cy.get('[data-cy=privacy-continue-button]').click()

    //Recovery Seed Screen
    cy.createAccountRecoverySeed()

    //Username and Status Input
    cy.validateUserInputIsDisplayed()
    cy.createAccountUserInput(randomName, randomStatus)

    //Click on button, validate buffering screen and that user is redirected to friends/list
    cy.createAccountSubmit()
    cy.validateChatPageIsLoaded()
    //Going to Settings and Privacy screen
    cy.get('[data-cy=settings]', { timeout: 30000 }).click()

    //Click on 'Privacy'
    cy.contains('Privacy').click()

    //Validate value from toggle is deactivated
    cy.privacyToggleValidateValue('Consents to having files scanned', false)
  })

  it.skip('Settings - Satellite and Public Signaling Servers should be selected', () => {
    cy.viewport(1200, 1200)
    //Validate value selected is Satellite and Public Signaling Servers
    cy.validateSignalingServersValue('Satellite + Public Signaling Servers')
  })

  it('Privacy page - Signup with Consents to having files scanned activated toggle', () => {
    //Adding pin to continue to toggles switches screen
    cy.createAccountPINscreen(randomPIN)

    //Create or Import account selection screen
    cy.createAccountSecondScreen()

    //Switch toggle to enabled
    cy.privacyToggleClick('Consents to having files scanned', true)
  })

  it('Privacy page - Signup with only Public Signaling Servers', () => {
    //Change option of to use only Public Signaling Servers
    cy.get('[data-cy=custom-select]').should('be.visible').click()
    cy.get('[data-cy=custom-select-option-text]')
      .contains('Only Public Signaling Servers')
      .click()
    cy.validateSignalingServersValue('Only Public Signaling Servers')
  })

  it.skip('Settings - Consents to having files scanned toggle should be enabled', () => {
    //Click on next
    cy.get('[data-cy=privacy-continue-button]').scrollIntoView().click()

    //Recovery Seed Screen
    cy.createAccountRecoverySeed()

    //Username and Status Input
    cy.validateUserInputIsDisplayed()
    cy.createAccountUserInput(randomName, randomStatus)

    //Click on button, validate buffering screen and that user is redirected to friends/list
    cy.createAccountSubmit()
    cy.validateChatPageIsLoaded()
    //Going to Settings and Privacy screen
    cy.get('[data-cy=settings]', { timeout: 30000 }).click()

    //Click on 'Privacy'
    cy.contains('Privacy').click()

    //Validate value from toggle is deactivated
    cy.privacyToggleValidateValue('Consents to having files scanned', true)
  })

  it.skip('Settings - Only Public Signaling Servers should be selected', () => {
    cy.viewport(1200, 1200)
    //Validate value selected is Only Public Signaling Servers
    cy.validateSignalingServersValue('Only Public Signaling Servers')
  })
})
