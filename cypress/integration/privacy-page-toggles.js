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
    cy.get('.switch-button', { timeout: 30000 }).each(($btn, index, $List) => {
      if (!$btn.hasClass('locked')) {
        if ($btn.hasClass('enabled')) {
          cy.wrap($btn).click().should('not.have.class', 'enabled')
          toggleStatusSaved.push(false)
        } else {
          cy.wrap($btn).click().should('have.class', 'enabled')
          toggleStatusSaved.push(true)
        }
      }
    })
  })

  it('Privacy page - Verify register publicly toggle is locked and disabled', () => {
    cy.get('.switch-button', { timeout: 30000 }).each(($btn, index, $List) => {
      if ($btn.hasClass('locked')) {
        expect($btn).to.not.have.class('enabled')
        expect($btn).to.have.class('locked')
        cy.wrap($btn).realHover()
        // Move back cursor to top left again
        cy.get('body').realHover({ position: 'topLeft' })
      }
    })
  })

  it.skip('Privacy page - Verify user can still proceed after adjusting switches', () => {
    //Click on next
    cy.get('#custom-cursor-area').click()

    //Recovery Seed Screen
    cy.createAccountRecoverySeed()

    //Username and Status Input
    cy.createAccountUserInput(randomName, randomStatus)

    //Click on button, validate buffering screen and that user is redirected to friends/list
    cy.createAccountSubmit()
    cy.get('[data-cy=user-state]', {
      timeout: 120000,
    }).should('be.visible')
    //Going to Settings and Privacy screen
    cy.get('[data-tooltip="Settings"] > .is-rounded > svg', {
      timeout: 30000,
    }).click()
  })

  it.skip('Profile - Verify the toggles user added when signing up are on the same status when user goes to settings', () => {
    cy.contains('Privacy').click()
    //Storing the values from toggle switches status of Settings screen into an array
    cy.get('.switch-button')
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
    cy.get('.switch-button').first().should('have.class', 'locked')
  })

  it('Privacy page - Verify all non-locked toggles can be switched to enable', () => {
    //Adding pin to continue to toggles switches screen
    cy.createAccountPINscreen(randomPIN)

    //Create or Import account selection screen
    cy.createAccountSecondScreen()

    //Switch all non-locked switched to enabled
    cy.get('.switch-button').each(($btn, index, $List) => {
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
    cy.get('.switch-button').each(($btn, index, $List) => {
      if (!$btn.hasClass('locked')) {
        if ($btn.hasClass('enabled')) {
          cy.wrap($btn).click().should('not.have.class', 'enabled')
        } else {
          cy.wrap($btn).should('not.have.class', 'enabled')
        }
      }
    })
  })
})
