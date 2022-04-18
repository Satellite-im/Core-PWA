const faker = require('faker')
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
const recoverySeed =
  'skin hotel finger toe face pill rather age acid ticket demise insane'
const randomName = faker.internet.userName(name) // generate random name
const randomStatus = faker.lorem.word() // generate random status

describe.skip('Snapshots Testing', () => {
  //Import account and snapshot on each screen
  Cypress.on('uncaught:exception', (err, runnable) => false) // temporary until AP-48 gets fixed

  it('Import account - PIN screen', () => {
    cy.importAccountPINscreen(randomPIN, false, true)
  })

  it('Import account - Create or Import Account Selection screen', () => {
    cy.snapshotTestContains('Import Account')
    cy.get('[data-cy=import-account-button]', { timeout: 60000 }).click()
  })

  it('Import account - Enter passphrase screen', () => {
    cy.snapshotTestContains(
      'Enter your 12 word passphrase in exactly the same order your recovery seed was generated.',
    )
    cy.get('[data-cy=add-passphrase]')
      .should('be.visible')
      .click()
      .type(recoverySeed, { log: false }, { force: true })
    cy.get('[data-cy=add-passphrase]').type('{enter}')
  })

  it('Import account - Screen after adding recovery seed', () => {
    cy.snapshotTestContains('Recover Account', 20000)
    cy.contains('Recover Account').click()
  })

  it('Import account - Buffering screen', () => {
    cy.contains('Linking Satellites...').should('be.visible')
    cy.snapshotTestContains(
      'Aligning satellites to retrieve your account',
      60000,
    )
  })

  it('Import account - Main Screen Loaded', () => {
    cy.contains('Snap QA', { timeout: 180000 })
    cy.get('body').realClick({ position: 'topLeft' })
    cy.snapshotTestContains('Snap QA')
  })

  it('Import account - Go to files', () => {
    cy.get('.sidebar-nav > .is-dark > #custom-cursor-area').click()
    cy.snapshotTestGet('.switcher-container > .is-text', 'Files')
  })

  it('Import account - Go to friends', () => {
    cy.get(
      '[style="position: relative;"] > .sidebar-full-btn > #custom-cursor-area',
    ).click()
    cy.snapshotTestContains('Add Friend')
  })

  it('Import account - Go to a chat', () => {
    cy.get('[data-tooltip="Message"]').first().click()
    cy.snapshotTestContains('connected', 60000)
  })

  it('Import account - Click on emojis', () => {
    cy.get('#emoji-toggle').click()
    cy.snapshotTestGet(
      '.navbar > .button-group > .active > #custom-cursor-area',
      'Emoji',
    )
  })

  it('Import account - Click on glyphs', () => {
    cy.get('#emoji-toggle').click()
    cy.get('#glyph-toggle').click()
    cy.snapshotTestGet('.pack-list > .is-text', 'Try using some glyphs')
    cy.get('#glyph-toggle').click()
  })

  it('Import account - Settings - General - Personalize', () => {
    // Go to each settings option and snapshot each
    cy.get('[data-tooltip="Settings"] > .is-rounded > svg').click()
    cy.snapshotTestContains('Personalize Satellite')
  })

  it('Import account - Settings - General - Profile', () => {
    cy.openSettingsMenuOption('Profile')
    cy.get('.title').should('contain', 'Profile')
    cy.snapshotTestContains('Profile')
  })

  it('Import account - Settings - General - Audio & Video', () => {
    cy.openSettingsMenuOption('Audio & Video')
    cy.snapshotTestContains('Audio Input')
  })

  it('Import account - Settings - General - Keybinds', () => {
    cy.openSettingsMenuOption('Keybinds')
    cy.snapshotTestContains('Default Keybinds')
  })

  it('Import account - Settings - General - Accounts & Devices', () => {
    cy.openSettingsMenuOption('Accounts & Devices')
    cy.get('.column > .title').should('contain', 'Accounts & Devices')
    cy.snapshotTestContains('Accounts & Devices')
  })

  it('Import account - Settings - General - Privacy', () => {
    cy.openSettingsMenuOption('Privacy')
    cy.snapshotTestContains('Privacy Settings')
  })

  it('Import account - Settings - Realms & Security - Realms', () => {
    cy.openSettingsMenuOption('Realms')
    cy.get('.column > .title').should('contain', 'Realms')
    cy.snapshotTestContains('Realms')
  })

  it('Import account - Settings - Realms & Security - Storage', () => {
    cy.openSettingsMenuOption('Storage')
    cy.get('.column > .title').should('contain', 'Storage')
    cy.snapshotTestContains('Storage')
  })

  it('Import account - Settings - Realms & Security - Network', () => {
    cy.openSettingsMenuOption('Network')
    cy.get('.column > .title').should('contain', 'Network')
    cy.snapshotTestContains('Network')
  })

  it('Import account - Settings - Developer - App Info', () => {
    cy.openSettingsMenuOption('App Info')
    cy.snapshotTestContains('Application Info')
    cy.get('.ps-container > .close-button').click()
  })

  it('Create Account - PIN screen', () => {
    //Open URL and snapshot
    cy.createAccountPINscreen(randomPIN, false, true)
  })

  it('Create Account - Create or Import Account Selection screen', () => {
    cy.snapshotTestContains('Create Account')
    cy.createAccountSecondScreen()
  })

  it('Create Account - Privacy Settings screen', () => {
    cy.snapshotTestContains('Privacy Settings')
    cy.createAccountPrivacyTogglesGoNext()
  })

  it('Create Account - User Input Screen', () => {
    //Recovery Seed Screen then User Input Snapshot
    cy.createAccountRecoverySeed().then(() => {
      cy.validateUserInputIsDisplayed()
      cy.snapshotTestContains(
        'Customize how the world sees you, choose something memorable.',
        30000,
      )
    })
  })

  it('Create Account - Buffering screen after submission', () => {
    //User input fill and finishing account creation
    cy.createAccountUserInput(randomName, randomStatus)
    cy.createAccountSubmit()
    cy.snapshotTestContains(
      'Aligning satellites to retrieve your account...',
      20000,
    )
  })
})
