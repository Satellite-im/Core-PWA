import { dataRecovery } from '../fixtures/test-data-accounts.json'

const faker = require('faker')
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
const recoverySeed =
  dataRecovery.accounts
    .filter((item) => item.description === 'Only Text')
    .map((item) => item.recoverySeed) + '{enter}'
const randomName = faker.internet.userName(name) // generate random name
const randomStatus = faker.lorem.word() // generate random status

describe('Privacy Settings Page - Toggles Tests', () => {
  it('Privacy Page - Import account for testing', { retries: 2 }, () => {
    //Setting a viewport visible for all toggles
    cy.viewport(1200, 1200)

    //Import account
    cy.importAccount(randomPIN, recoverySeed)

    //Ensure messages are displayed before starting
    cy.validateChatPageIsLoaded()

    //Going to Settings and Privacy screen
    cy.get('[data-cy=settings]', { timeout: 30000 }).click()
  })

  it('Validate existing toggles', () => {
    //Setting a viewport visible for all toggles
    cy.viewport(1200, 1200)

    //Click on 'Privacy'
    cy.contains('Privacy').click()

    //Validate contents on screen
    cy.contains('Privacy Settings').should('be.visible')
    cy.contains(
      'Choose which features to enable to best suit your privacy preferences.',
    ).should('be.visible')

    cy.contains('Register Username Publicly', { timeout: 45000 }).should(
      'be.visible',
    )
    cy.contains(
      'Publicly associate your account ID with a human readable username. Anyone can see this association.',
    ).should('be.visible')

    cy.contains('Store Account Pin').should('be.visible')
    cy.contains(
      "Store your account pin locally so you don't have to enter it manually every time. This is not recommended.",
    ).should('be.visible')

    cy.contains('Enable External Embeds').should('be.visible')
    cy.contains(
      'Allow Satellite to fetch data from external sites to expand links like Spotify, YouTube, and more.',
    ).should('be.visible')

    cy.contains('Display Current Activity').should('be.visible')
    cy.contains(
      "Allow Satellite to see what games you're playing and show them off on your profile so friends can jump in.",
    ).should('be.visible')

    cy.contains('Consent to File Scanning').should('be.visible')
    cy.contains(
      'In order to share files/use the encrypted file storage I consent to have the hash of my files compared against the Microsoft PhotoDNA service to help prevent the spread of sexual abuse material.',
    ).should('be.visible')

    cy.contains('Block NSFW content').should('be.visible')
    cy.contains('If selected, NSFW content will be obscured.').should(
      'be.visible',
    )
  })

  it('Privacy Page - Verify register publicly toggle is locked and disabled', () => {
    //Setting a viewport visible for all toggles
    cy.viewport(1200, 1200)

    cy.get('[data-cy=switch-button]').each(($btn, index, $List) => {
      if ($btn.hasClass('locked')) {
        expect($btn).to.not.have.class('enabled')
        expect($btn).to.have.class('locked')
        cy.wrap($btn).realHover()
        // Move back cursor to top left again
        cy.get('body').realHover({ position: 'topLeft' })
      }
    })
  })

  it('Privacy page - Verify all non-locked toggles can be switched to enable', () => {
    //Setting a viewport visible for all toggles
    cy.viewport(1200, 1200)

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
    //Setting a viewport visible for all toggles
    cy.viewport(1200, 1200)

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

    //Close modal
    cy.closeModal('.modal-card-body')
  })

  it('Privacy page - Validate that last values selected were saved correcty', () => {
    //Setting a viewport visible for all toggles
    cy.viewport(1200, 1200)

    //Going to Settings and Privacy screen
    cy.get('[data-cy=settings]', { timeout: 30000 }).click()

    //Click on 'Privacy'
    cy.contains('Privacy').click()

    //Validate default values for toggles are selected after creating an account
    cy.privacyToggleValidateValue('Register Username Publicly', false)
    cy.privacyToggleValidateValue('Store Account Pin', false)
    cy.privacyToggleValidateValue('Enable External Embeds', false)
    cy.privacyToggleValidateValue('Display Current Activity', false)
    cy.privacyToggleValidateValue('Consent to File Scanning', false)
    cy.privacyToggleValidateValue('Block NSFW content', false)
  })
})
