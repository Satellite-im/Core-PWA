import { dataRecovery } from '../fixtures/test-data-accounts.json'

const faker = require('faker')
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
const recoverySeed = dataRecovery.accounts
  .filter((item) => item.description === 'Snap QA')
  .map((item) => item.recoverySeed)
  .toString()
const randomName = faker.internet.userName(name) // generate random name
const randomStatus = faker.lorem.word() // generate random status

describe.skip('Snapshots Testing', () => {
  //Skipping snapshots tests because cursor behavior makes tests to fail
  //Import account and snapshot on each screen
  it('Import account - PIN screen', () => {
    cy.importAccountPINscreen(randomPIN, false, true, false)
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

  it('Import account - Main Screen Loaded', () => {
    cy.validateChatPageIsLoaded()
    cy.get('body').realClick({ position: 'topLeft' })
    cy.snapshotTestContains('Snap QA')
  })

  it('Import account - Go to files', () => {
    cy.get('[data-cy=sidebar-files]').click()
    cy.snapshotTestContains('Quick Access')
  })

  it('Import account - Go to friends', () => {
    cy.get('[data-cy=sidebar-friends]').click()
    cy.snapshotTestContains('Add Friend')
  })

  it('Import account - Go to a chat', () => {
    cy.goToConversation('Snap Friend')
    cy.snapshotTestContains('connected')
  })

  it('Import account - Click on emojis', () => {
    cy.get('#emoji-toggle').click()
    cy.snapshotTestGet(
      '.navbar > .button-group > .styled-button > .content',
      'Emoji',
    )
    cy.get('#emoji-toggle').click()
  })

  it('Import account - Settings - General - Personalize', () => {
    //Click on toggle-sidebar
    cy.get('[data-cy=toggle-sidebar]').click()
    // Go to settings
    cy.get('[data-cy=settings]', { timeout: 30000 }).click()
    cy.snapshotTestContains('Personalize Satellite')
  })

  it.skip('Import account - Settings - General - Profile', () => {
    // Skipped because Profile section is a feature to be implemented yet
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

  it('Import account - Settings - Realms', () => {
    cy.openSettingsMenuOption('Realms')
    cy.get('.column > .title').should('contain', 'Realms')
    cy.snapshotTestContains('Realms')
  })

  it('Import account - Settings - Storage', () => {
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
  })

  it('Create Account - PIN screen', () => {
    //Open URL and snapshot
    cy.createAccountPINscreen(randomPIN, false, true, false)
  })

  it('Create Account - Create or Import Account Selection screen', () => {
    cy.snapshotTestContains('Create Account')
    cy.createAccountSecondScreen()
  })

  it.skip('Create Account - User Input Screen', () => {
    //Skipped because account creation fails due to Solana issues
    //Recovery Seed Screen then User Input Snapshot
    cy.createAccountRecoverySeed().then(() => {
      cy.validateUserInputIsDisplayed()
      cy.snapshotTestContains(
        'Customize how the world sees you, choose something memorable.',
        30000,
      )
    })
  })
})
