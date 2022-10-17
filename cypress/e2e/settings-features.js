describe('Settings Features Tests', () => {
  beforeEach(() => {
    //Setting a viewport visible for all toggles
    cy.viewport(1800, 1200)
  })

  it('Settings - Assert content', () => {
    // Login with User A by restoring LocalStorage Snapshot
    cy.loginWithLocalStorage('Chat User A')

    // Go to settings
    cy.get('[data-cy=go-to-settings]').click()

    //Ensure Settings Modal is displayed
    cy.get('[data-cy=settings-modal]').should('be.visible')

    // Go to personalize tab
    cy.contains('Personalize Satellite')
    cy.contains('Make it your own and choose custom colors & themes.')

    // Go to profile tab
    cy.contains('Profile').click()
    cy.contains('Update your profile photo, status, banners, and more.')
    cy.contains('About Me')
    cy.contains(
      'Let your friends know who you are! Your about me will display on your profile.',
    )
    cy.contains('Your Accounts (Coming Soon)')
    cy.contains('Share your blog, website, or portfolio URL.')
    cy.contains(
      'Link your accounts to display on your profile and have easier access to them while using Satellite.im.',
    )

    // Go to Audio & Video tab
    cy.contains('Audio & Video').click()
    cy.contains('Configure your audio and video devices.')
    cy.contains('Audio Input')
    cy.contains(
      "Select which input device you'd like people to hear your silky smooth voice from.",
    )
    cy.contains('Audio Output')
    cy.contains(
      "Select the device that you'd like to deliver sound to your ear holes with.",
    )
    cy.contains('Video Input')
    cy.contains(
      "Select which video device you'd like to share your beautiful smile from.",
    )

    cy.contains('Mirror Video')
    cy.contains('Gaze upon your reflection with mirrored video enabled.')

    cy.contains('Notifications Settings')
    cy.contains('Sounds')
    cy.contains('Message')
    cy.contains('Call')
    cy.contains('Mute')
    cy.contains('Deafen')
    cy.contains('Upload')
    cy.contains('Connected')

    // Go to app info tab
    cy.contains('App Info').click()
    cy.contains('Application Info')
    cy.contains(
      'Below is information that may be helpful to you when creating bug reports or developing on our application.',
    )

    // Go to Storage tab
    cy.contains('Storage').click()
    cy.contains(
      'Control how your data is stored. You can export your local storage information (coming soon) and reset Satellite here. Be careful resetting your local storage will clear out your account.',
    )
    cy.contains('Clear Storage')
    cy.contains(
      'Reset Satellite. This will clear any saved accounts. Do not do this without backing up your account first.',
    )
    cy.contains('Clear Local Storage')

    //Go to Keybinds tab
    cy.contains('Keybinds').click()
    cy.contains('Configure keyboard shortcuts.')
    cy.contains('Toggle Mute')
    cy.contains('Toggle Deafen')
    cy.contains('Open Settings')
    cy.contains('Call Active Chat')

    // Go to Accounts & Devices tab
    cy.contains('Accounts & Devices').click()
    cy.contains(
      "Select which account you'd prefer to default transactions from",
    )
    cy.contains('Active Account')
    cy.contains('Active Account Decentralized Identifier (did)')
    cy.contains('Connected Devices')
    cy.contains('No connected devices found.')
    cy.contains('Recovery Phrase')
    cy.contains(
      'Do not share this phrase with anyone. This phrase is used to recover your account. Anyone with access to this has access to your account.',
    )
    cy.contains('Reveal Phrase')
    cy.contains('Copy Phrase')

    // Go to Privacy tab
    cy.contains('Privacy & Permissions').click()

    //Validate contents on screen - Header
    cy.contains('Privacy & Permissions').should('be.visible')
    cy.contains(
      'Choose which features to enable to best suit your privacy preferences.',
    ).should('be.visible')

    //Validate contents on screen - Permissions
    cy.contains(
      'Allow Satellite to send you notifications when you receive new messages, friend requests, etc.',
    ).should('be.visible')

    cy.contains('Microphone').should('be.visible')
    cy.contains(
      'Allow Satellite to use input from your microphone in voice and video calls.',
    ).should('be.visible')

    cy.contains('Camera').should('be.visible')
    cy.contains(
      'Allow Satellite to see your beautiful face and show it in video calls.',
    ).should('be.visible')

    cy.contains('Screen Sharing').should('be.visible')
    cy.contains(
      'Show the other users your screen during voice and video calls.',
    ).should('be.visible')
    cy.contains(
      "Screen sharing is an operating system setting labeled as 'Screen Recording', to allow access, you will need to enable browser access to screen recording in your OS",
    ).should('be.visible')

    //Validate contents on screen - File Sharing

    cy.contains('Consent to File Scanning').should('be.visible')
    cy.contains(
      'To share files/use the encrypted file storage, I consent to have the hash of my files compared against the Microsoft PhotoDNA service to help prevent the spread of sexual abuse material. Files will not leave the Satellite infrastructure. Only the hash of files will be checked against the third party database.',
    ).should('be.visible')

    cy.contains('Block NSFW content').should('be.visible')
    cy.contains(
      'If selected, we will use AI to try and detect and obscure NSFW content.',
    ).should('be.visible')

    //Validate contents on screen - Other
    cy.contains('Store Account Password').should('be.visible')
    cy.contains(
      "Store your account password locally, so you don't have to enter it manually every time. This is not recommended.",
    ).should('be.visible')

    //Close modal
    cy.closeModal('[data-cy=settings-modal]')
  })

  it('Settings - Clear Local Storage', () => {
    // Go to Settings
    cy.get('[data-cy=go-to-settings]').click()

    //Ensure Settings Modal is displayed
    cy.get('[data-cy=settings-modal]').should('be.visible')

    // Go to Storage tab and validate contents displayed
    cy.contains('Storage').click()

    // Click on Clear Local Storage
    cy.contains('Clear Local Storage').click()
    cy.contains('Are you absolutely sure?')
    cy.contains(
      'If you do not have your recovery seed, your account will be gone forever.',
    )
    cy.contains('Yes, Really, Clear Local Storage').click()
    cy.contains('Choose Your Password', { timeout: 30000 }).should('be.visible')
  })
})
