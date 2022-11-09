const expectedThemeOptions = ['Default', 'Moonless Night']
const expectedFlairOptions = [
  'Satellite',
  'Peach',
  'Pink',
  'Lime',
  'Purple',
  'Lavender',
  'Sunflower',
  'Deep Blue',
  'Void',
]
describe('Settings - Personalize Features Tests', () => {
  beforeEach(() => {
    //Setting a viewport visible for all toggles
    cy.viewport(1800, 1200)
  })

  it('Settings - Personalize - Themes default selection', () => {
    // Login with User A by restoring LocalStorage Snapshot
    cy.loginWithLocalStorage('Chat User A')

    // Go to settings
    cy.get('[data-cy=go-to-settings]').click()

    // Ensure Settings Modal is displayed
    cy.get('[data-cy=settings-modal]').should('be.visible')

    // Ensure that personalize tab is displayed
    cy.contains('Personalize Satellite')

    //Validate that "Default" is current theme displayed in Application and the option selected in dropdown list
    cy.validateAppTheme('Default')

    // Validate that when Color Theme is "Default", Flair selector is deactivated
    cy.get('[data-cy=settings-flair-selector]')
      .find('[data-cy=list-container-button]')
      .should('have.attr', 'disabled', 'disabled')

    // Validate that when Color Theme is "Default", Flair value selected is "Satellite" and this is the current flair displayed in Application
    cy.validateAppFlair('Satellite')
  })

  it('Settings - Personalize - Change theme to Moonless Night', () => {
    // Click on Color Theme selector to see the options
    // Validate the correct two options are contained in Color Theme Selector
    cy.validateListOptions('theme', expectedThemeOptions)

    // Change Theme to "Moonless Night"
    cy.selectThemeOrFlair('theme', 'Moonless Night')

    // Validate that Color Theme selected is now "Moonless Night" and it is the current theme displayed in Application
    cy.validateAppTheme('Moonless Night')
  })

  it('Settings - Personalize - Flair options for Moonless Night Theme', () => {
    // Click on Flair selector to see the options
    // Validate the correct nine options are contained in Flair Selector
    cy.validateListOptions('flair', expectedFlairOptions)
  })

  it('Settings - Personalize - Change Flair to "Lime"', () => {
    // Click on "Flair" and change the selected value to "Lime"
    cy.selectThemeOrFlair('flair', 'Lime')

    // Validate that Flair selected is now "Lime" and this is the current flair color displayed in Application
    cy.validateAppFlair('Lime')

    //Close modal
    cy.closeModal('[data-cy=settings-modal]')
  })
})
