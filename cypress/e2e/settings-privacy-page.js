describe('Privacy Settings Page - Toggles Tests', () => {
  beforeEach(() => {
    //Setting a viewport visible for all toggles
    cy.viewport(1800, 1200)
  })

  it('Privacy Page - Import account and go to settings', () => {
    // Login with User A by restoring LocalStorage Snapshot
    cy.loginWithLocalStorage('Chat User A')

    //Going to Settings and Privacy screen
    cy.get('[data-cy=go-to-settings]', { timeout: 30000 }).click()

    //Ensure Settings Modal is displayed
    cy.get('[data-cy=settings-modal]').should('be.visible')
  })

  it('Validate existing toggles', () => {
    //Click on 'Privacy'
    cy.contains('Privacy & Permissions').click()

    //Validate contents on screen - Header
    cy.contains('Privacy & Permissions').should('be.visible')
    cy.contains(
      'Choose which features to enable to best suit your privacy preferences.',
    ).should('be.visible')

    //Validate contents on screen - Only for switch toggles

    cy.contains('Consent to File Scanning').should('be.visible')
    cy.contains('Block NSFW content').should('be.visible')
    cy.contains('Store Account Password').should('be.visible')
  })

  it('Privacy page - Verify all non-locked toggles can be switched to enable', () => {
    //Change all non-locked switches to enabled
    cy.privacyToggleSwitchAll('Privacy & Permissions', 'enabled')

    //Validate all non-locked switches are enabled
    cy.privacyToggleValidateAll('Privacy & Permissions', 'enabled')

    //Close modal
    cy.closeModal('[data-cy=settings-modal]')
  })

  it('Privacy page - Verify all non-locked toggles can be switched to disabled', () => {
    //Going to Settings and Privacy screen
    cy.get('[data-cy=go-to-settings]', { timeout: 30000 }).click()

    //Click on 'Privacy'
    cy.contains('Privacy & Permissions').click()

    //Change all non-locked switches to enabled
    cy.privacyToggleSwitchAll('Privacy & Permissions', 'disabled')

    //Validate all non-locked switches are enabled
    cy.privacyToggleValidateAll('Privacy & Permissions', 'disabled')

    //Close modal
    cy.closeModal('[data-cy=settings-modal]')
  })

  it('Privacy page - Validate that last values selected were saved correcty', () => {
    //Going to Settings and Privacy screen
    cy.get('[data-cy=go-to-settings]', { timeout: 30000 }).click()

    //Click on 'Privacy'
    cy.contains('Privacy & Permissions').click()

    //Validate default values for toggles are selected after creating an account
    cy.privacyToggleValidateValue('Store Account Password', false)
    cy.privacyToggleValidateValue('Consent to File Scanning', false)
    cy.privacyToggleValidateValue('Block NSFW content', false)

    //Close modal
    cy.closeModal('[data-cy=settings-modal]')
  })
})
