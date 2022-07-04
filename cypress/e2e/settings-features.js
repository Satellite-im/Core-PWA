import { dataRecovery } from '../fixtures/test-data-accounts.json'

const faker = require('faker')
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
const recoverySeed =
  dataRecovery.accounts
    .filter((item) => item.description === 'Only Text')
    .map((item) => item.recoverySeed) + '{enter}'

describe('Settings Features Tests', () => {
  it('Settings - Assert content', () => {
    // Import account
    cy.importAccount(randomPIN, recoverySeed)

    // Validate profile name displayed
    cy.validateChatPageIsLoaded()

    // Go to settings
    cy.get('[data-cy=settings]', { timeout: 30000 }).click()

    // Go to personalize tab
    cy.contains('Personalize Satellite')
    cy.contains('Make it your own and choose custom colors & themes.')

    // Go to profile tab
    // cy.contains('Profile').click()
    // cy.contains('Update your profile photo, status, banners and more.')

    // Go to Audio & Video tab
    cy.contains('Audio & Video').click()
    cy.contains('Audio Input')
    cy.contains(
      "Select which input device you'd like people to hear your silky smooth voice from.",
    )
    cy.contains('Audio Output')
    cy.contains(
      "Select the device that you'd like to deliver sound to your ear holes with.",
    )
    cy.contains('Input Volume')
    cy.contains('Output Volume')
    cy.contains('Video Input')
    cy.contains(
      "Select which video device you'd like to share your beautiful smile from.",
    )
    cy.contains('Notifications Settings')

    //Go to Keybinds tab
    cy.contains('Keybinds').click()
    cy.contains('Default Keybinds')
    cy.contains(
      'A list of the default keybinds for quickly navigating and using Satellite.',
    )

    // Go to Accounts & Devices tab
    cy.contains('Accounts & Devices').click()
    cy.contains(
      "Select which account you'd prefer to default transactions from",
    )
    cy.contains('Connected Devices')
    cy.contains('No connected devices found.')
    cy.contains('Recovery Phrase')
    cy.contains(
      'Do not share this phrase with anyone. This phrase is used to recover your account. Anyone with access to this has access to your account.',
    )

    // Go to Privacy tab
    cy.contains('Privacy').click()
    cy.contains('Privacy Settings')
    cy.contains(
      'Choose which features to enable to best suit your privacy preferences.',
    )

    //Go to Realms tab
    cy.get(':nth-child(2) > .menu-list > :nth-child(1) > .is-inactive').click() //remove this and add a data-cy label using y.contains('Realms').click() doesn't work
    cy.contains(
      "Change the realm Satellite lives in. Changing a realm will mean you can only communicate with others in the same realm as you. Please only change if you know what you're doing.",
    )

    // Go to Storage tab
    cy.contains('Storage').click()
    cy.contains(
      'Control how your data is stored. You can export your local storage information (coming soon) as well as reset Satellite here. Be careful resetting your local storage will clear out your account.',
    )
    cy.contains('Clear Storage')

    // Go to network tab
    cy.contains('Network').click()
    cy.contains(
      "Change network options, please note that switching from 'Testnet' to 'Mainnet' can trigger errors and additional charges during the alpha period.",
    )

    // Go to app info tab
    cy.contains('App Info').click()
    cy.contains('Application Info')
    cy.contains(
      'Below is information that may be helpful to you when creating bug reports or developing on our application.',
    )
  })
})

describe('Settings Features Tests', () => {
  it('Settings - Clear Local Storage', () => {
    // Import account
    cy.importAccount(randomPIN, recoverySeed)

    // Validate profile name displayed
    cy.validateChatPageIsLoaded()

    // Go to Settings
    cy.get('[data-cy=settings]', { timeout: 30000 }).click()

    // Go to Storage tab
    cy.contains('Storage').click()
    cy.contains(
      'Control how your data is stored. You can export your local storage information (coming soon) as well as reset Satellite here. Be careful resetting your local storage will clear out your account.',
    )
    cy.contains('Clear Storage')
    cy.contains('Clear Local Storage').click()
    cy.contains('Are you absolutely sure?')
    cy.contains(
      'If you do not have your recovery seed your account will be gone forever.',
    )
    cy.contains('Yes, Really, Clear Local Storage').click()
    cy.contains('Create Account Pin', { timeout: 30000 })
  })
})
