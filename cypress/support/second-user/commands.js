import 'cypress-file-upload'
import 'cypress-localstorage-commands'
import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command'

addMatchImageSnapshotCommand({
  customSnapshotsDir: '/cypress/snapshots',
})

const COMMAND_DELAY = 2000 // to run tests slower

for (const command of [
  'visit',
  'click',
  'trigger',
  'type',
  'clear',
  'reload',
  'contains',
]) {
  Cypress.Commands.overwrite(command, (originalFn, ...args) => {
    const origVal = originalFn(...args)

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(origVal)
      }, COMMAND_DELAY)
    })
  })
}

//Commands to retry visiting root page when previous PIN data is not cleared correctly

Cypress.Commands.add('visitRootPage', () => {
  //Clear localstorage, cookies, sessionstorage and indexedDB before starting
  cy.clearLocalStorage()
  cy.clearCookies()
  cy.window().then((win) => {
    win.sessionStorage.clear()
  })

  //Clear indexed DB if browser is chrome
  if (Cypress.isBrowser('!firefox')) {
    cy.window().then((win) => {
      win.indexedDB.databases().then((r) => {
        for (var i = 0; i < r.length; i++)
          win.indexedDB.deleteDatabase(r[i].name)
      })
    })
  }

  // Visit root page and ensure that Choose Your Password is displayed
  cy.visit('/')
  cy.contains('Choose Your Password').should('be.visible')
})

//Create Account Commands

Cypress.Commands.add('createAccount', (pin, username, savePin = false) => {
  cy.visit('/')
  cy.contains('Choose Your Password').should('be.visible')
  cy.url().should('contain', '#/auth/unlock')
  cy.get('[data-cy=input-group]')
    .should('be.visible')
    .trigger('input')
    .type(pin, { log: false }, { force: true })
  if (savePin === true) {
    cy.get('.switch-button').click().should('have.class', 'enabled')
  } else {
    cy.get('.switch-button').should('not.have.class', 'enabled')
  }
  cy.get('[data-cy=submit-input]').click()
  cy.get('[data-cy=create-account-button]').click()
  cy.get('.font-heading').should('contain', 'Recovery Seed')
  cy.contains('I Saved It').click()
  cy.validateUserInputIsDisplayed()
  cy.get('[data-cy=username-input]')
    .should('be.visible')
    .trigger('input')
    .type(username)
  cy.get('[data-cy=status-input]')
    .should('be.visible')
    .trigger('input')
    .type('testing')
  cy.get('[data-cy=sign-in-button]').click()
  cy.welcomeModal(username)
})

Cypress.Commands.add(
  'createAccountPINscreen',
  (pin, savePin = false, snapshot = false) => {
    cy.visitRootPage()
    cy.url().should('contain', '#/auth/unlock')
    if (snapshot === true) {
      cy.snapshotTestGet(
        '[data-cy="pin-label"] > .font-weight-normal',
        'Choose Your Password',
      )
    }
    cy.contains('Store Password? (Less Secure)').should('be.visible')
    cy.contains('Choose Your Password').should('be.visible')
    cy.get('[data-cy=input-group]')
      .should('be.visible')
      .trigger('input')
      .type(pin, { log: false }, { force: true })
    if (savePin === true) {
      cy.get('.switch-button').click().should('have.class', 'enabled')
    } else {
      cy.get('.switch-button').should('not.have.class', 'enabled')
    }
    cy.get('[data-cy=submit-input]').should('be.visible').click()
  },
)

Cypress.Commands.add('createAccountSecondScreen', () => {
  cy.contains('Account Creation').should('be.visible')
  cy.get('[data-cy=create-account-button]').click()
})

Cypress.Commands.add('createAccountRecoverySeed', () => {
  cy.contains('Recovery Seed', { timeout: 15000 }).should('be.visible')
  cy.contains('I Saved It').click()
})

Cypress.Commands.add('validateUserInputIsDisplayed', () => {
  cy.get('[data-cy=username-input]', { timeout: 150000 }).should('be.visible')
})

Cypress.Commands.add('createAccountUserInput', (username, status) => {
  cy.get('[data-cy=username-input]')
    .should('be.visible')
    .trigger('input')
    .type(username)
  cy.get('[data-cy=status-input]', { timeout: 30000 })
    .should('be.visible')
    .trigger('input')
    .type(status)
})

Cypress.Commands.add('createAccountAddImage', (filepath) => {
  cy.get('.header-content > .button').should('be.visible').click()
  cy.get('.input-file').attachFile(filepath)
})

Cypress.Commands.add('createAccountSubmit', () => {
  cy.get('[data-cy=sign-in-button]').should('be.visible').click()
})

Cypress.Commands.add('welcomeModal', (username) => {
  cy.get('.modal-dialog', { timeout: 30000 }).should('exist')
  cy.contains('Welcome, ' + username + '!').should('exist')
  cy.contains(
    'Thank you so much for joining us in our Early Access. Things are changing rapidly, so please be patient with us and check back regularly for updates and improvements.',
  ).should('exist')
  cy.contains('Got It!').should('exist')
  cy.get('.action').click()
})

//Import Account Commands

Cypress.Commands.add('loginWithLocalStorage', (username) => {
  //Execute the following steps before starting
  //Clear localstorage
  cy.clearLocalStorage()

  //Clear cookies
  cy.clearCookies()

  //Clear Session Storage and IndexedDB if test is executed on Chrome
  if (Cypress.browser.name === 'chrome') {
    cy.window().then((win) => {
      win.sessionStorage.clear()
      win.indexedDB.databases().then((r) => {
        for (var i = 0; i < r.length; i++)
          win.indexedDB.deleteDatabase(r[i].name)
      })
    })
  }

  //Restore profile passed for localstorage
  cy.restoreLocalStorage(username)

  //Visit rootpage
  cy.visit('/')

  //Ensure chatpage is loaded
  cy.validateChatPageIsLoaded()
})

Cypress.Commands.add('importAccount', (pin, recoverySeed, savePin = false) => {
  cy.visitRootPage()
  cy.url().should('contain', '#/auth/unlock')
  cy.get('[data-cy=add-input]')
    .should('be.visible')
    .trigger('input')
    .type(pin, { log: false }, { force: true })
  if (savePin === true) {
    cy.get('[data-cy=switch-button]').click().should('have.class', 'enabled')
  } else {
    cy.get('[data-cy=switch-button]').should('not.have.class', 'enabled')
  }
  cy.get('[data-cy=submit-input]').click()
  cy.get('[data-cy=import-account-button]', { timeout: 60000 }).click()
  cy.get('[data-cy=add-passphrase]')
    .should('be.visible')
    .trigger('input')
    .type(recoverySeed, { log: false }, { force: true })
  cy.contains('Recover Account').click()
})

Cypress.Commands.add(
  'importAccountPINscreen',
  (pin, savePin = false, snapshot = false) => {
    cy.visitRootPage()
    cy.url().should('contain', '#/auth/unlock')
    if (snapshot === true) {
      cy.snapshotTestGet('.subtitle', 'Create Account Pin')
    }
    cy.get('[data-cy=add-input]')
      .should('be.visible')
      .trigger('input')
      .type(pin, { log: false }, { force: true })
    cy.contains('Create Account Pin').should('be.visible')
    cy.contains(
      "The pin can be anything you want, just don't forget it.",
    ).should('be.visible')
    cy.contains('Choose Your Pin').should('be.visible')
    cy.get('[data-cy=add-input]').should('be.visible')
    cy.contains('Store Pin? (Less Secure)').should('be.visible')
    cy.get('[data-cy=submit-input]').should('be.visible')
    if (savePin === true) {
      cy.get('.switch-button').click().should('have.class', 'enabled')
    } else {
      cy.get('.switch-button').should('not.have.class', 'enabled')
    }
    cy.get('[data-cy=submit-input]').click()
  },
)

Cypress.Commands.add('importAccountEnterPassphrase', (userPassphrase) => {
  cy.get('[data-cy=import-account-button]', { timeout: 60000 }).click()
  cy.get('[data-cy=add-passphrase]')
    .should('be.visible')
    .trigger('input')
    .type(userPassphrase, { log: false }, { force: true })
  cy.get('[data-cy=add-passphrase]').type('{enter}')

  cy.contains('Recover Account').click()
})

//Chat - Basic Commands for Text and Emojis

Cypress.Commands.add('chatFeaturesProfileName', () => {
  // clicks on user name
  cy.get('[data-cy=user-name]').should('be.visible').click()
  cy.wait(1000)
})

Cypress.Commands.add('copyUserIDFromProfile', () => {
  let userID

  // Allowing Chrome Browser to have read and write access to clipboard
  cy.wrap(
    Cypress.automation('remote:debugger:protocol', {
      command: 'Browser.grantPermissions',
      params: {
        permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'],
        //make the permission trigger by allowing the current origin only
        origin: window.location.origin,
      },
    }),
  )

  //Ensuring permissions for read were granted
  cy.window()
    .its('navigator.permissions')
    .invoke('query', { name: 'clipboard-read' })
    .its('state')
    .should('equal', 'granted')

  // Clicks on user name
  cy.get('[data-cy=user-name]').should('be.visible').click()

  //Validating that text messsage copied matches with actual clipboard value
  cy.window()
    .its('navigator.clipboard')
    .invoke('readText')
    .then((clipboardText) => {
      userID = clipboardText
    })

  return userID
})

Cypress.Commands.add(
  'chatFeaturesSendMessage',
  (message, assertMessage = true) => {
    //Type message
    cy.get('[data-cy=editable-input]')
      .should('be.visible')
      .trigger('input')
      .type(message)
    //Assert message is displayed in editable input bar and click on send message
    cy.get('[data-cy=editable-input]')
      .should('have.text', message)
      .then(() => {
        cy.get('[data-cy=send-message]').click() //sending text message
      })
    // If Assert message is true, validate it was sent
    if (assertMessage) {
      cy.contains(message).last().scrollIntoView().should('exist')
    }
  },
)

Cypress.Commands.add('chatFeaturesSendEmoji', (emojiLocator, emojiValue) => {
  cy.get('[data-cy=send-emoji]').click()
  cy.get(emojiLocator).click() // sending emoji
  cy.get('[data-cy=send-message]').click() //sending emoji message
  cy.contains(emojiValue)
    .last()
    .scrollIntoView({ timeout: 20000 })
    .should('exist')
})

Cypress.Commands.add(
  'chatFeaturesEditMessage',
  (messageToEdit, messageEdited, action = 'rightClick') => {
    //Retrieve message to edit
    cy.get('[data-cy=chat-message]')
      .contains(messageToEdit)
      .last()
      .scrollIntoView()
      .as('messageToEdit')
    //Select Edit Message option by Right Click or by Hovering Message
    if (action === 'rightClick') {
      cy.get('@messageToEdit').should('exist').rightclick()
      cy.get('[data-cy=context-menu-option]').contains('Edit Message').click()
    } else if (action === 'hover') {
      cy.get('@messageToEdit')
        .should('exist')
        .realHover()
        .siblings('[data-cy=message-actions]')
        .find('[data-cy=message-action-edit]')
        .click()
      cy.get('body').realHover({ position: 'topLeft' })
    }
    // Editing message
    cy.get('[data-cy=edit-message-input]')
      .scrollIntoView()
      .should('exist')
      .trigger('input')
      .type(messageEdited + '{enter}')
    //Ensure message was edited
    cy.get('[data-cy=chat-message]')
      .contains(messageToEdit + messageEdited)
      .last()
      .scrollIntoView()
      .should('exist')
  },
)
Cypress.Commands.add('validateCharlimit', (text, error) => {
  cy.get('[data-cy=chatbar-footer]')
    .children()
    .should('contain', text)
    .then(($selector) => {
      if (error === true) {
        cy.wrap($selector).should('have.class', 'font-color-danger')
        cy.get('[data-cy=chatbar-wrap]').should('have.class', 'is-error')
      } else {
        cy.wrap($selector).should('have.class', 'font-color-dark')
        cy.get('[data-cy=chatbar-wrap]').should('not.have.class', 'is-error')
      }
    })
})

// Chat - Replies Commands

Cypress.Commands.add(
  'chatFeaturesReplyMessage',
  (receiver, selector, message) => {
    cy.selectContextMenuOption(selector, 'Reply')
    cy.get('.is-chatbar-reply')
      .should('exist')
      .should('include.text', 'Reply to')
      .should('include.text', receiver)
      .then(() => {
        cy.get('[data-cy=editable-input]')
          .should('be.visible')
          .trigger('input')
          .type(message)
        cy.get('[data-cy=send-message]').click() // sending text message
      })
  },
)

Cypress.Commands.add('getReply', (messageReplied) => {
  cy.get('[data-cy=chat-message]')
    .contains(messageReplied)
    .last()
    .parent()
    .parent()
    .find('[data-cy=reply-preview]')
    .as('reply-preview')
})

// Chat - Glyphs Commands

Cypress.Commands.add(
  'chatFeaturesSendGlyph',
  (packIndex = 0, itemIndex = 0) => {
    cy.get('[data-cy=send-glyph]').click()
    cy.get('[data-cy=glyphs-picker]').should('be.visible')
    cy.get('[data-cy=glyph-pack]').eq(packIndex).as('glyph-pack')
    cy.get('@glyph-pack')
      .scrollIntoView()
      .find('[data-cy=pack-glyph-item]')
      .eq(itemIndex)
      .scrollIntoView()
      .click()
  },
)

Cypress.Commands.add('goToLastGlyphOnChat', () => {
  cy.get('[data-cy=chat-glyph]').last().scrollIntoView().should('be.visible')
})

// Chat - Images Commands

Cypress.Commands.add('chatFeaturesSendImage', (imagePath, filename) => {
  cy.get('[data-cy=chat-file-upload]').selectFile(imagePath, {
    force: true,
  })
  cy.get('[data-cy=file-item]', { timeout: 60000 }).should('exist')
  cy.get('[data-cy=file-item-filename]').should('contain', filename)
  cy.get('[data-cy=send-message]').click() //sending image message
  cy.get('[data-cy=file-loader-container]', { timeout: 60000 }).should(
    'not.exist',
  )
})

Cypress.Commands.add('goToLastImageOnChat', (waitTime = 30000) => {
  cy.get('[data-cy=chat-image]', { timeout: waitTime })
    .last()
    .scrollIntoView()
    .should('be.visible')
})

// Chat - Send Files Commands

Cypress.Commands.add('chatFeaturesSendFile', (filePath, filename) => {
  cy.get('[data-cy=chat-file-upload]').selectFile(filePath, {
    force: true,
  })
  cy.get('[data-cy=file-item]', { timeout: 30000 }).should('exist')
  cy.get('[data-cy=file-item-filename]').should('contain', filename)
  cy.get('[data-cy=send-message]').click() //sending image message
  cy.get('[data-cy=file-loader-container]', { timeout: 60000 }).should(
    'not.exist',
  )
})

// Chat - Context Menu Commands

Cypress.Commands.add(
  'validateOptionNotInContextMenu',
  (locator, optionText) => {
    cy.get(locator).last().scrollIntoView().rightclick()
    cy.get('[data-cy=context-menu]')
      .children()
      .should('not.contain', optionText)
    cy.wait(1000)
    cy.clickOutside().then(() => {
      cy.get('[data-cy=context-menu]').should('not.exist')
    })
  },
)

Cypress.Commands.add('selectContextMenuOption', (locator, optionText) => {
  cy.get(locator).scrollIntoView().rightclick()
  cy.get('[data-cy=context-menu]')
    .find('[data-cy=context-menu-option]')
    .contains(optionText)
    .click()
})

Cypress.Commands.add(
  'validateAllOptionsInContextMenu',
  (locator, expectedOptions) => {
    cy.get(locator).scrollIntoView().rightclick()
    cy.get('[data-cy=context-menu]').should('be.visible')
    cy.get('[data-cy=context-menu-option]').each(($option, $index, $list) => {
      expect($option.text().trim()).to.be.eq(expectedOptions[$index])
    })
    cy.wait(1000)
    cy.clickOutside().then(() => {
      cy.get('[data-cy=context-menu]').should('not.exist')
    })
  },
)

Cypress.Commands.add('clickOutside', () => {
  cy.get('body').click(0, 0) //0,0 here are the x and y coordinates
})

// Chat - Page Load Commands

Cypress.Commands.add('validateChatPageIsLoaded', () => {
  cy.get('[data-cy=user-name]', { timeout: 30000 }).should('exist')
})

Cypress.Commands.add('goToConversation', (user, isMobile = false) => {
  //If sidebar is hidden, click on hamburger menu
  cy.get('#app').then(($app) => {
    if ($app.hasClass('hide-sidebars')) {
      cy.get('[data-cy=hamburger-button]').click()
    }
  })

  // Go to friend by choosing it from sidebar
  cy.get('[data-cy=sidebar-user-name]', { timeout: 60000 })
    .contains(user)
    .click()

  // If mobile viewport is passed, then click on hamburger button to display conversation
  if (isMobile === true) {
    cy.get('[data-cy=hamburger-button]').click()
  }

  //Wait until chat page is loaded
  cy.get('#conversation-container', { timeout: 30000 }).should('exist')
})

// Chat - Hover on Icon Commands

Cypress.Commands.add(
  'hoverOnComingSoonIcon',
  (locator, expectedMessage, parent = false) => {
    if (parent) {
      cy.get(locator)
        .should('be.visible')
        .parents('.coming-soon')
        .should('exist')
    } else {
      cy.get(locator).should('be.visible').find('.coming-soon').should('exist')
    }
    cy.get(locator).realHover()
    cy.contains(expectedMessage).should('be.visible')
    cy.wait(1000)
    cy.get('body').realHover({ position: 'topLeft' })
  },
)

Cypress.Commands.add('hoverOnActiveIcon', (locator, expectedMessage) => {
  cy.get(locator).should('be.visible').realHover()
  cy.contains(expectedMessage).should('be.visible')
  cy.wait(1000)
  cy.get('body').realHover({ position: 'topLeft' })
})

// Chat - URL Commands

Cypress.Commands.add('validateURLOnClick', (expectedURL) => {
  let locatorURL = 'a[href="' + expectedURL + '"]'
  cy.get(locatorURL)
    .last()
    .scrollIntoView()
    .should('have.attr', 'href', expectedURL)
    .should('have.attr', 'target', '_blank')
    .then((link) => {
      cy.request(link.prop('href')).its('status').should('eq', 200)
    })
})

// Chat - Modals Commands

Cypress.Commands.add('validateComingSoonModal', () => {
  cy.get('[data-cy=modal-cta]').should('be.visible')
  cy.get('.sat-icon').should('be.visible')
  cy.contains('Coming Soon')
    .should('be.visible')
    .should('have.class', 'heading')
  cy.contains('Stay tuned for these upcoming features:').should('be.visible')
  cy.contains('Watch Parties').should('be.visible')
  cy.contains('Servers').should('be.visible')
  cy.contains('Community Servers Core').should('be.visible')
  cy.contains('Community Servers File Sharing').should('be.visible')
  cy.contains(
    'Community Servers Voice, Video, Screen Sharing, and more',
  ).should('be.visible')
  cy.contains(
    "We're currently in our Alpha stage and working hard on building more features. Follow us on social media for updates on our launch.",
  ).should('be.visible')
  cy.contains('Keep Me Posted').should('be.visible')
})

Cypress.Commands.add('validateURLComingSoonModal', () => {
  cy.get('[data-cy=btn-call-to-action]')
    .should('have.attr', 'href', 'https://twitter.com/satellite_im')
    .should('have.attr', 'target', '_blank')
})

Cypress.Commands.add('validateGlyphsModal', () => {
  cy.get('[data-cy=glyphs-modal]').should('be.visible')
  cy.get('[data-cy=glyphs-modal-title]')
    .should('be.visible')
    .invoke('text')
    .then(($text) => {
      expect($text).to.be.oneOf(['Genshin Impact 2', 'Astrobunny'])
    })
  cy.get('[data-cy=glyphs-modal-container]').children().should('have.length', 3)
  cy.get('[data-cy=glyphs-modal-view-btn]')
    .should('be.visible')
    .and('contain', 'View Glyph Pack')
})

Cypress.Commands.add('closeModal', (locator) => {
  cy.get('body').type('{esc}')
  cy.get(locator).should('not.exist')
})

// Chat - Reaction Commands

Cypress.Commands.add('reactToChatElement', (elementLocator, emojiLocator) => {
  cy.selectContextMenuOption(elementLocator, 'Add Reaction')
  cy.get(emojiLocator).click()
})

Cypress.Commands.add(
  'validateChatReaction',
  (elementLocator, emojiValue, timeout = 30000) => {
    cy.get(elementLocator)
      .scrollIntoView()
      .parents('[data-cy=message-container]')
      .find('[data-cy=emoji-reaction-value]', { timeout: timeout })
      .should('contain', emojiValue)
  },
)

// Chat - Profile Notes Commands

Cypress.Commands.add(
  'addOrAssertProfileNote',
  (noteText, action = 'assert') => {
    cy.get('[data-cy=friend-chat-circle]').click()
    cy.get('[data-cy=profile]', { timeout: 30000 }).should('be.visible')
    cy.contains('Add Note').should('be.visible')
    cy.get('[data-cy=profile-add-note] > .cte-input').as('noteInput')
    if (action === 'add') {
      cy.get('@noteInput')
        .click()
        .clear()
        .type(noteText + '{enter}')
    } else {
      cy.get('@noteInput')
        .should('contain', noteText)
        .click()
        .clear()
        .type('{enter}')
    }
    cy.get('[data-cy=profile]').find('.close-button').click()
  },
)

// Chat - Search Commands

Cypress.Commands.add('searchFromTextInChat', (text) => {
  cy.get('[data-cy=chat-search-input]')
    .click()
    .clear()
    .type(text + '{enter}')
  cy.get('[data-cy=chat-search-result]').should('be.visible')
})

Cypress.Commands.add('assertFirstMatchOnSearch', (text) => {
  cy.get('[data-cy=chat-search-result-text]')
    .contains(text)
    .first()
    .should('exist')
})

Cypress.Commands.add('navigateThroughSearchResults', () => {
  //Get locators for first and last button in search pagination
  cy.get('[data-cy=chat-search-result-pagination]')
    .children()
    .last()
    .as('lastButton')
  cy.get('[data-cy=chat-search-result-pagination]')
    .children()
    .first()
    .as('firstButton')

  //Navigate through all results sorted by New - Default View
  cy.get('@lastButton')
    .prev()
    .invoke('text')
    .then(($max) => {
      for (let i = 1; i < $max; i++) {
        cy.get('@lastButton').click()
      }
      for (let i = 1; i < $max; i++) {
        cy.get('@firstButton').click()
      }
    })
})

// Chat - Files Commands

Cypress.Commands.add('openFilesScreen', () => {
  cy.get('[data-cy=sidebar-files]').click()
  cy.get('[data-cy=files-screen]').should('be.visible')
})

Cypress.Commands.add('renameFileOrFolder', (existingName, newName) => {
  //Click on list view
  cy.get('[data-cy=files-view-list]').click()
  cy.get('[data-cy=files-table]').should('be.visible')

  //Find the file or folder to rename by looking for its existing name
  cy.get('[data-cy=file-item-name]')
    .contains(existingName)
    .parents('[data-cy=files-item]')
    .as('itemLocator')

  //Get the file/folder with same name, right click on it and select Rename
  cy.selectContextMenuOption('@itemLocator', 'Rename')

  //Change name from file or folder and submit
  cy.get('[data-cy=files-rename]')
    .should('exist')
    .find('[data-cy=input-group]')
    .trigger('input')
    .type(newName)
  cy.get('[data-cy=files-rename]').find('[data-cy=submit-input]').click()
  cy.closeModal('[data-cy=files-rename]')

  //Assert that file or folder name was changed
  cy.get('[data-cy=file-item-name]').contains(newName).should('be.visible')
})

Cypress.Commands.add('filesSectionUploadFile', (imagePath, filename) => {
  cy.get('[data-cy=files-upload-hidden-input]').selectFile(imagePath, {
    force: true,
  })
  cy.get('[data-cy=file-upload-status]')
    .should('be.visible')
    .and('contain', 'Uploading ' + filename)
  cy.get('[data-cy=file-item-name]').contains(filename).should('be.visible')
})

Cypress.Commands.add('filesSectionCreateFolder', (folderName) => {
  cy.get('[data-cy=files-folder-name]')
    .find('[data-cy=input-group]')
    .trigger('input')
    .type(folderName)
  cy.get('[data-cy=files-folder-name]').find('[data-cy=submit-input]').click()
  cy.get('[data-cy=file-item-name]').contains(folderName).should('be.visible')
})

Cypress.Commands.add('consentFileScanning', () => {
  cy.get('[data-cy=confirmation-modal]')
    .find('[data-cy=confirmation-modal-header]')
    .should('have.text', 'Consent to File Scanning')
    .and('be.visible')
  cy.get('[data-cy=confirmation-modal]')
    .find('[data-cy=confirm-button]')
    .click()
})

// Chat - Markdown Commands

Cypress.Commands.add('sendMessageWithMarkdown', (text, markdown) => {
  let textMarkdown = markdown + text + markdown
  // Write the text message
  cy.get('[data-cy=editable-input]')
    .should('be.visible')
    .trigger('input')
    .type(textMarkdown)
  // Assert the text message is displayed before sending
  cy.get('[data-cy=editable-input]')
    .should('have.text', textMarkdown)
    .then(() => {
      cy.get('[data-cy=send-message]').click() //sending text message
    })

  // Depending on the markdown passed, assert the text from the corresponding HTML tag
  switch (markdown) {
    case '*':
    case '_':
      cy.get('em').last().should('have.text', text)
      break
    case '**':
      cy.get('strong').last().should('have.text', text)
      break
    case '__':
      cy.get('u').last().should('have.text', text)
      break
    case '`':
      cy.get('code').last().should('have.text', text)
      break
    case '***':
      cy.get('strong')
        .last()
        .should('have.text', text)
        .parent('em') // Assert that text have a parent EM HTML tag
        .should('exist')
      break
    case '~~':
      cy.get('del').last().should('have.text', text)
      break
    case '||':
      cy.get('.spoiler-container')
        .last()
        .should('not.have.class', 'spoiler-open')
        .click() // Assert that after clicking the spoiler, text is displayed
        .should('have.class', 'spoiler-open')
        .find('.spoiler')
        .should('have.text', text)
      break
    default:
      cy.get('[data-cy=chat-message]').contains(text)
  }
})

//Chat - Get Time

Cypress.Commands.add('getTimestamp', (value = 'now') => {
  let date
  if (value === 'now') {
    date = new Date()
  } else if (value === 'past') {
    date = new Date(Date.now() - 60000)
  }
  let hours = date.getHours()
  let minutes = date.getMinutes()
  let ampm = hours >= 12 ? ' PM' : ' AM'
  hours = hours % 12
  hours = hours ? hours : 12
  minutes = minutes.toString().padStart(2, '0')
  let strTime = hours + ':' + minutes + ampm
  return strTime
})

//Version Release Notes Commands

Cypress.Commands.add('releaseNotesScreenValidation', () => {
  cy.get('[data-cy=version]').should('be.visible').click()
  cy.contains('Update', { timeout: 30000 }).should('be.visible')
  cy.contains('is Here!').should('be.visible')
  cy.contains('Got It!').should('be.visible').click()
})

//Snapshot Testing

Cypress.Commands.add('snapshotTestContains', (text, timeout = 4000) => {
  cy.contains(text, { timeout: timeout })
    .should('be.visible')
    .then(() => {
      cy.matchImageSnapshot()
    })
})

Cypress.Commands.add('snapshotTestGet', (locator, text, timeout = 4000) => {
  cy.get(locator, { timeout: timeout })
    .should('contain', text)
    .then(() => {
      cy.matchImageSnapshot()
    })
})

//Settings Menu

Cypress.Commands.add('openSettingsMenuOption', (option) => {
  cy.get('.menu-list').contains(option).click()
})

Cypress.Commands.add(
  'privacyToggleValidateValue',
  (switchText, expectedValue = true) => {
    cy.contains(switchText)
      .scrollIntoView()
      .parents('[data-cy=settings-unit]')
      .find('[data-cy=switch-button]')
      .then(($btn) => {
        if (expectedValue === true) {
          cy.wrap($btn, { timeout: 30000 }).should('have.class', 'enabled')
        } else {
          cy.wrap($btn, { timeout: 30000 }).should('not.have.class', 'enabled')
        }
      })
  },
)

Cypress.Commands.add(
  'privacyToggleSwitchAll',
  (settingsPage, expectedValue) => {
    // Navigate through switches and click if required
    cy.get('h2')
      .contains(settingsPage)
      .parents('[data-cy=settings-page]')
      .find('[data-cy=switch-button]')
      .should('not.have.class', 'locked')
      .each(($btn) => {
        if (expectedValue === 'enabled' && !$btn.hasClass('enabled')) {
          cy.wrap($btn).click()
        } else if (expectedValue === 'disabled' && $btn.hasClass('enabled')) {
          cy.wrap($btn).click()
        }
      })
  },
)

Cypress.Commands.add(
  'privacyToggleValidateAll',
  (settingsPage, expectedValue) => {
    // Validate toggle values are correct
    cy.get('h2')
      .contains(settingsPage)
      .parents('[data-cy=settings-page]')
      .find('[data-cy=switch-button]')
      .should('not.have.class', 'locked')
      .each(($btn) => {
        if (expectedValue === 'enabled') {
          cy.wrap($btn).should('have.class', 'enabled')
        } else if (expectedValue === 'disabled') {
          cy.wrap($btn).should('not.have.class', 'enabled')
        }
      })
  },
)

// LocalStorage Validations

Cypress.Commands.add('validatePopulatedLocalStorage', (username = 'qa123') => {
  cy.getLocalStorage('Satellite-Store').then((value) => {
    let valueObject = JSON.parse(value)
    expect(valueObject.accounts.encryptedPhrase).not.to.be.eq('')
    expect(valueObject.accounts.details.name).to.eq(username)
    expect(valueObject.accounts.pinHash).not.to.be.eq('')
  })
})

Cypress.Commands.add('validateEmptyLocalStorage', () => {
  cy.getLocalStorage('Satellite-Store').then((value) => {
    let valueObject = JSON.parse(value)
    expect(valueObject.accounts.encryptedPhrase).to.be.eq('')
    expect(valueObject.accounts.pinHash).to.be.eq('')
  })
})

// Paste Command

Cypress.Commands.add(
  'paste',
  { prevSubject: true },
  function (subject, pasteOptions) {
    const { pastePayload, pasteType } = pasteOptions
    const data =
      pasteType === 'application/json'
        ? JSON.stringify(pastePayload)
        : pastePayload
    // https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer
    const clipboardData = new DataTransfer()
    clipboardData.setData(pasteType, data)
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/paste_event
    const pasteEvent = new ClipboardEvent('paste', {
      bubbles: true,
      cancelable: true,
      dataType: pasteType,
      data,
      clipboardData,
    })
    subject[0].dispatchEvent(pasteEvent)

    return subject
  },
)

// Get element attached to DOM

Cypress.Commands.add('getAttached', (selector) => {
  const getElement =
    typeof selector === 'function' ? selector : ($d) => $d.find(selector)
  let $el = null
  return cy
    .document()
    .should(($d) => {
      $el = getElement(Cypress.$($d))
      expect(Cypress.dom.isDetached($el)).to.be.false
    })
    .then(() => cy.wrap($el))
})

// Friend Requests Commands

Cypress.Commands.add('sendFriendRequest', (friendID, friendName) => {
  cy.get('[data-cy=add-friend-page]')
    .find('[data-cy=input-group]')
    .click()
    .trigger('input')
    .type(friendID)
  cy.get('[data-cy=add-friend-page]')
    .find('[data-cy=friend]')
    .should('be.visible')
    .then(() => {
      cy.get('[data-cy=friend-name]').should('contain', friendName)
      cy.get('[data-cy=add-friend-page]')
        .find('[data-cy=friend-confirm-button]')
        .click()
    })
  cy.contains('Friend request successfully sent!').should('be.visible')
})

Cypress.Commands.add(
  'acceptUpcomingFriendRequest',
  (upcomingFriendName, pendingReqs = 1) => {
    cy.get('[data-cy=friend-requests-page]')
      .find('[data-cy=friend-name]')
      .contains(upcomingFriendName)
      .parents('[data-cy=friend]')
      .find('[data-cy=friend-confirm-button]')
      .click()
    if (pendingReqs === 1) {
      cy.contains('No requests found').should('be.visible')
      cy.contains('You have no pending friend requests').should('be.visible')
    }
  },
)

Cypress.Commands.add(
  'validateRequestsBadge',
  (pendingReqs = '1', customTimeout = 30000) => {
    cy.get('[data-cy=sidebar-friends]')
      .find('.tag', { timeout: customTimeout })
      .should('contain', pendingReqs)
  },
)

Cypress.Commands.add('goToFriendsPage', (page) => {
  cy.get('[data-cy=sidebar-friends]').click()
  cy.get('[data-cy=tab-element]').contains(page).click()
})

Cypress.Commands.add('validateFriendIsActive', (friendName) => {
  //After going to friends page, validate that new friend is online
  cy.get('[data-cy=friend-page-list]')
    .find('[data-cy=friend-name]')
    .contains(friendName)
    .parents('[data-cy=friend]')
    .as('friend')

  cy.get('@friend').find('rect').should('have.class', '.is-online')

  cy.get('@friend').find('[data-cy=friend-confirm-button]').click()

  //Wait until chat page is loaded
  cy.get('#conversation-container', { timeout: 30000 }).should('exist')
})

//Videocall Commands

Cypress.Commands.add(
  'validateVideoPresentOnCall',
  (type = 'local', available = true, customTimeout = 10000) => {
    if (type === 'local' && available) {
      cy.get('[data-cy=local-video-stream]', { timeout: customTimeout }).should(
        'exist',
      )
    } else if (type === 'local' && !available) {
      cy.get('[data-cy=local-video-stream]', { timeout: customTimeout }).should(
        'not.exist',
      )
    } else if (type === 'remote' && available) {
      cy.get('[data-cy=remote-video-stream]', {
        timeout: customTimeout,
      }).should('exist')
    } else if (type === 'remote' && !available) {
      cy.get('[data-cy=remote-video-stream]', {
        timeout: customTimeout,
      }).should('not.exist')
    }
  },
)

Cypress.Commands.add(
  'validateScreenSharePresentOnCall',
  (type = 'local', available = true, customTimeout = 10000) => {
    if (type === 'local' && available) {
      cy.get('[data-cy=local-screen-stream]', {
        timeout: customTimeout,
      }).should('exist')
    } else if (type === 'local' && !available) {
      cy.get('[data-cy=local-screen-stream]', {
        timeout: customTimeout,
      }).should('not.exist')
    } else if (type === 'remote' && available) {
      cy.get('[data-cy=remote-screen-stream]', {
        timeout: customTimeout,
      }).should('exist')
    } else if (type === 'remote' && !available) {
      cy.get('[data-cy=remote-screen-stream]', {
        timeout: customTimeout,
      }).should('not.exist')
    }
  },
)

Cypress.Commands.add(
  'validateAudioPresentOnCall',
  (username, muted = true, customTimeout = 10000) => {
    if (muted) {
      cy.get(
        '[title="' +
          username +
          '"] > [data-cy=indicators] > [data-cy=muted-indicator]',
        { timeout: customTimeout },
      ).should('exist')
    } else if (!muted) {
      cy.get(
        '[title="' +
          username +
          '"] > [data-cy=indicators] > [data-cy=muted-indicator]',
        { timeout: customTimeout },
      ).should('not.exist')
    }
  },
)

Cypress.Commands.add('answerVideocall', (customTimeout = 15000) => {
  //Accept incoming video call
  cy.get('[data-cy=incoming-call]', { timeout: customTimeout }).should(
    'be.visible',
  )
  cy.get('[data-cy=incoming-call-accept]').click()
  cy.get('[data-cy=mediastream]').should('be.visible')
})

Cypress.Commands.add('callUser', (customTimeout = 15000) => {
  cy.get('[data-cy=toolbar-enable-audio]', { timeout: customTimeout }).click()
  cy.get('[data-cy=mediastream]').should('be.visible')
})

Cypress.Commands.add('finishCall', (customTimeout = 15000) => {
  cy.get('[data-cy=call-hangup]', { timeout: customTimeout }).click()
  cy.get('[data-cy=mediastream]').should('not.exist')
})

Cypress.Commands.add('waitUntilRemoteCallEnds', (customTimeout = 15000) => {
  cy.get('[data-cy=mediastream]', { timeout: customTimeout }).should(
    'not.exist',
  )
})
