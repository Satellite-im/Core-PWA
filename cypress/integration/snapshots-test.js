const faker = require('faker')
const randomName = faker.internet.userName(name) // generate random name
const randomStatus = faker.lorem.word() // generate random status
const recoverySeed =
  'diet acquire phone casino sister scatter news notable sustain lift mercy right'

describe('Snapshots Testing', () => {
  it('Import account', () => {
    //Import account and snapshot on each screen
    //Enter PIN Screen
    cy.visit('/')
    cy.viewport(1400, 1000)
    cy.snapshotTestGet('.subtitle', 'Create Account Pin')
    cy.get('[data-cy=add-input]')
      .should('be.visible')
      .type('test001', { log: false })
    cy.get('[data-cy=submit-input]').should('be.visible').click()

    //Create or Import Account Selection Screen
    cy.snapshotTestContains('Import Account')
    cy.contains('Import Account').click()

    //Enter the passphrase screen
    cy.snapshotTestContains(
      'Enter your 12 word passphrase in exactly the same order your recovery seed was generated.',
    )
    cy.get('[data-cy=add-passphrase]')
      .should('be.visible')
      .type(recoverySeed, { log: false })
    cy.get('[data-cy=add-passphrase]').type('{enter}')

    //Snapshot after adding recovery seed
    cy.snapshotTestContains('Recover Account')
    cy.contains('Recover Account').click()
    Cypress.on('uncaught:exception', (err, runnable) => false) // temporary until AP-48 gets fixed

    //Snapshots on buffering screen and main screen
    cy.snapshotTestContains('Linking Satellites...', 20000)
    cy.snapshotTestContains('SnapQA', 30000)

    // Go to files
    cy.get('.sidebar-nav > .is-dark > #custom-cursor-area').click()
    cy.snapshotTestGet('.switcher-container > .is-text', 'Files')

    // Go to friends
    cy.get(
      '[style="position: relative;"] > .sidebar-full-btn > #custom-cursor-area',
    ).click()
    cy.snapshotTestContains('Add Friend')

    // Go to a chat
    cy.get('[data-tooltip="Message"]').click()
    cy.snapshotTestContains('connected', 20000)

    // Click on emojis
    cy.get('#emoji-toggle').click()
    cy.snapshotTestGet(
      '.navbar > .button-group > .active > #custom-cursor-area',
      'Emoji',
    )

    // Click on glyphs
    cy.get('#emoji-toggle').click()
    cy.get('#glyph-toggle').click()
    cy.snapshotTestGet('.pack-list > .is-text', 'Try using some glyphs')
    cy.get('#glyph-toggle').click()

    // Go to each settings option and snapshot each
    // Go to Settings - General - Personalize
    cy.get('[data-tooltip="Settings"] > .is-rounded > svg').click()
    cy.snapshotTestContains('Personalize Satellite')

    // Go to Settings - General - Profile
    cy.openSettingsMenuOption('Profile')
    cy.snapshotTestContains('Account Info')

    // Go to Settings - General - Audio & Video
    cy.openSettingsMenuOption('Audio & Video')
    cy.snapshotTestContains('Audio Input')

    // Go to Settings - General - Keybinds
    cy.openSettingsMenuOption('Keybinds')
    cy.snapshotTestContains('Default Keybinds')

    // Go to Settings - General - Accounts & Devices
    cy.openSettingsMenuOption('Accounts & Devices')
    cy.get('.column > .title').should('contain', 'Accounts & Devices')
    cy.snapshotTestContains('Accounts & Devices')

    // Go to Settings - General - Privacy
    cy.openSettingsMenuOption('Privacy')
    cy.snapshotTestContains('Privacy Settings')

    // Go to Settings - Realms & Security - Realms
    cy.openSettingsMenuOption('Realms')
    cy.get('.column > .title').should('contain', 'Realms')
    cy.snapshotTestContains('Realms')

    // Go to Settings - Realms & Security - Storage
    cy.openSettingsMenuOption('Storage')
    cy.get('.column > .title').should('contain', 'Storage')
    cy.snapshotTestContains('Storage')

    // Go to Settings - Realms & Security - Network
    cy.openSettingsMenuOption('Network')
    cy.get('.column > .title').should('contain', 'Network')
    cy.snapshotTestContains('Network')

    // Go to Settings - Developer - Notifications
    cy.openSettingsMenuOption('Notifications')
    cy.snapshotTestContains('Notifications Settings')

    // Go to Settings - Developer - App Info
    cy.openSettingsMenuOption('App Info')
    cy.snapshotTestContains('Application Info')
    cy.get('.ps-container > .close-button').click()
  })

  it('Create account', () => {
    //Open URL and snapshot
    cy.visit('/')
    cy.viewport(1400, 1000)
    cy.snapshotTestGet('.subtitle', 'Create Account Pin')
    cy.createAccountPINscreen('test001')

    //Create or Import account selection screen
    cy.snapshotTestContains('Create Account')
    cy.createAccountSecondScreen()

    //Privacy Settings screen
    cy.snapshotTestContains('Privacy Settings')
    cy.createAccountPrivacyToggles()

    //Recovery Seed Screen then User Input Snapshot
    cy.createAccountRecoverySeed().then(() => {
      cy.snapshotTestContains(
        'Customize how the world sees you, choose something memorable.',
        30000,
      )
    })

    //User input fill and finishing account creation
    cy.createAccountUserInput(randomName, randomStatus)
    cy.createAccountSubmit()
    cy.snapshotTestContains('Linking Satellites...', 20000)
  })
})
