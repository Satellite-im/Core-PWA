import 'cypress-file-upload'
import 'cypress-localstorage-commands'
import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command'
import { date } from 'fp-ts'

addMatchImageSnapshotCommand({
  customSnapshotsDir: '/cypress/snapshots',
})

const faker = require('faker')
const randomName = faker.internet.userName(name) // generate random name
const randomStatus = faker.lorem.word() // generate random status

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

Cypress.Commands.add('visitRootPage', (isMobile = false) => {
  cy.deleteStorage()
  cy.wait(1000)
  // Pass arguments depending if the test is on mobile or desktop browser
  if (isMobile === false) {
    cy.visit('/')
  } else if (isMobile === true) {
    // Pass user agent with data for a mobile device
    cy.on('window:before:load', (win) => {
      Object.defineProperty(win.navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
      })
    })
    // Use visit Mobile command instead of visit for mobile devices
    cy.visit('/')
  }
  cy.wait(1000)
  cy.get('body').then(($body) => {
    if (!($body.find('.create_pin_section').length > 0)) {
      cy.visitRootPage(isMobile)
    }
  })
})

Cypress.Commands.add('deleteStorage', () => {
  cy.removeLocalStorage('Satellite-Store')
  cy.window().then((win) => {
    win.sessionStorage.clear()
  })
  cy.clearCookies()
})

Cypress.Commands.add(
  'clearDatabase',
  () =>
    new Cypress.Promise(async (resolve) => {
      const req = indexedDB.deleteDatabase('SatelliteDB')
      req.onsuccess = function () {
        resolve()
      }
    }),
)

//Create Account Commands

Cypress.Commands.add('createAccount', (pin, isMobile = false) => {
  cy.clearDatabase()
  cy.visitRootPage(isMobile)
  cy.url().should('contain', '#/auth/unlock')
  cy.get('[data-cy=add-input]')
    .should('be.visible')
    .trigger('input')
    .type(pin, { log: false }, { force: true })
  cy.get('[data-cy=submit-input]').click()
  cy.get('[data-cy=create-account-button]').click()
  cy.get('.title').should('contain', 'Recovery Seed')
  cy.contains('I Saved It').click()
  cy.validateUserInputIsDisplayed()
  cy.get('[data-cy=username-input]')
    .should('be.visible')
    .trigger('input')
    .type(randomName)
  cy.get('[data-cy=status-input]')
    .should('be.visible')
    .trigger('input')
    .type(randomStatus)
  cy.get('[data-cy=sign-in-button]').click()
})

Cypress.Commands.add(
  'createAccountPINscreen',
  (pin, savePin = false, snapshot = false, isMobile = false) => {
    cy.clearDatabase()
    cy.visitRootPage(isMobile)
    cy.url().should('contain', '#/auth/unlock')
    if (snapshot === true) {
      cy.snapshotTestGet('.subtitle', 'Create Account Pin')
    }
    cy.get('[data-cy=add-input]')
      .should('be.visible')
      .trigger('input')
      .type(pin, { log: false }, { force: true })
    cy.contains('Store Pin? (Less Secure)').should('be.visible')
    if (savePin === true) {
      cy.get('.switch-button').click().should('have.class', 'enabled')
    } else {
      cy.get('.switch-button').should('not.have.class', 'enabled')
    }
    cy.contains('Create Account Pin').should('be.visible')
    cy.contains(
      "The pin can be anything you want, just don't forget it.",
    ).should('be.visible')
    cy.contains('Choose Your Pin').should('be.visible')
    cy.get('[data-cy=add-input]').should('be.visible')
    cy.contains('Store Pin? (Less Secure)').should('be.visible')
    cy.get('[data-cy=submit-input]').should('be.visible')
    cy.get('[data-cy=submit-input]').click()
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
    .type(randomName)
  cy.get('[data-cy=status-input]', { timeout: 30000 })
    .should('be.visible')
    .trigger('input')
    .type(randomStatus)
})

Cypress.Commands.add('createAccountAddImage', (filepath) => {
  cy.get('.is-outlined > #custom-cursor-area').should('be.visible').click()
  cy.get('.input-file').attachFile(filepath)
})

Cypress.Commands.add('createAccountSubmit', () => {
  cy.get('[data-cy=sign-in-button]').should('be.visible').click()
  cy.contains('Linking Satellites...').should('be.visible')
})

Cypress.Commands.add(
  'privacyToggleClick',
  (switchText, expectedValue = true) => {
    cy.contains(switchText)
      .scrollIntoView()
      .parent()
      .find('[data-cy=switch-button]')
      .then(($btn) => {
        if (expectedValue === true) {
          if (!$btn.hasClass('enabled')) {
            cy.wrap($btn).click().should('have.class', 'enabled')
          } else {
            cy.wrap($btn).should('have.class', 'enabled')
          }
        } else {
          if (!$btn.hasClass('locked')) {
            if ($btn.hasClass('enabled')) {
              cy.wrap($btn).click().should('not.have.class', 'enabled')
            } else {
              cy.wrap($btn).should('not.have.class', 'enabled')
            }
          }
        }
      })
  },
)

Cypress.Commands.add(
  'privacyToggleValidateValue',
  (switchText, expectedValue = true) => {
    cy.contains(switchText)
      .scrollIntoView()
      .parent()
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

//Import Account Commands

Cypress.Commands.add(
  'importAccount',
  (pin, recoverySeed, isMobile = false, savePin = false) => {
    cy.clearDatabase()
    cy.visitRootPage(isMobile)
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
  },
)

Cypress.Commands.add(
  'importAccountPINscreen',
  (pin, savePin = false, snapshot = false, isMobile = false) => {
    cy.clearDatabase()
    cy.visitRootPage(isMobile)
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

Cypress.Commands.add('chatFeaturesProfileName', (value) => {
  // clicks on user name
  cy.get('[data-cy=user-name]')
    .should('be.visible')
    .should('have.text', value)
    .click()
  cy.wait(1000)
})

Cypress.Commands.add(
  'chatFeaturesSendMessage',
  (message, assertMessage = true) => {
    cy.get('[data-cy=editable-input]')
      .should('be.visible')
      .trigger('input')
      .paste({
        pasteType: 'text',
        pastePayload: message,
      })
    cy.get('[data-cy=editable-input]')
      .should('have.text', message)
      .then(() => {
        cy.get('[data-cy=send-message]').click() //sending text message
      })
    // Wait until loading indicator disappears
    cy.get('[data-cy=loading-indicator]', { timeout: 60000 }).should(
      'not.exist',
    )
    // Assert message
    if (assertMessage) {
      cy.contains(message, { timeout: 30000 })
        .last()
        .scrollIntoView()
        .should('exist')
    }
  },
)

Cypress.Commands.add('chatFeaturesSendEmoji', (emojiLocator, emojiValue) => {
  cy.get('#emoji-toggle > .control-icon').click()
  cy.get(emojiLocator).click() // sending emoji
  cy.get('[data-cy=send-message]').click() //sending emoji message
  cy.contains(emojiValue)
    .last()
    .scrollIntoView({ timeout: 20000 })
    .should('exist')
})

Cypress.Commands.add(
  'chatFeaturesEditMessage',
  (messageToEdit, messageEdited) => {
    cy.get('[data-cy=chat-message]')
      .contains(messageToEdit)
      .last()
      .scrollIntoView()
      .should('exist')
      .rightclick()
    cy.contains('Edit Message').click()
    cy.get('[data-cy=edit-message-input]')
      .scrollIntoView()
      .should('exist')
      .trigger('input')
      .type(messageEdited) // editing message
    cy.get('[data-cy=edit-message-input]').type('{enter}')
    cy.contains(messageToEdit + messageEdited, { timeout: 30000 })
      .last()
      .scrollIntoView()
      .should('exist')
  },
)
Cypress.Commands.add('validateCharlimit', (text, assert) => {
  cy.get('.charlimit')
    .should('be.visible')
    .should('contain', text)
    .then(($selector) => {
      if (assert === true) {
        cy.wrap($selector).should('have.class', 'is-error')
      } else {
        cy.wrap($selector).should('not.have.class', 'is-error')
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
    cy.get('#glyph-toggle').click()
    cy.get('#glyphs').should('be.visible')
    cy.get('[data-cy=glyph-pack]').eq(packIndex).as('glyph-pack')
    cy.get('@glyph-pack')
      .scrollIntoView()
      .find('[data-cy=pack-glyph-item]')
      .eq(itemIndex)
      .scrollIntoView()
      .click()
    cy.get('[data-cy=send-message]').click() //sending glyph message
  },
)

Cypress.Commands.add('goToLastGlyphOnChat', () => {
  cy.get('[data-cy=chat-glyph]').last().scrollIntoView().should('be.visible')
})

// Chat - Images Commands

Cypress.Commands.add('chatFeaturesSendImage', (imagePath, filename) => {
  cy.get('#quick-upload').selectFile(imagePath, {
    force: true,
  })
  cy.get('[data-cy=file-item]', { timeout: 60000 }).should('exist')
  cy.get('[data-cy=file-item-filename]').should('contain', filename)
  cy.get('[data-cy=send-message]').click() //sending image message
  cy.get('[data-cy=file-item]', { timeout: 120000 }).should('not.exist')
})

Cypress.Commands.add('goToLastImageOnChat', (waitTime = 30000) => {
  cy.get('[data-cy=chat-image]', { timeout: waitTime })
    .last()
    .scrollIntoView()
    .should('be.visible')
})

// Chat - Send Files Commands

Cypress.Commands.add('chatFeaturesSendFile', (filePath, filename) => {
  cy.get('#quick-upload').selectFile(filePath, {
    force: true,
  })
  cy.get('[data-cy=file-item]', { timeout: 30000 }).should('exist')
  cy.get('[data-cy=file-item-filename]').should('contain', filename)
  cy.get('[data-cy=send-message]').click() //sending image message
  cy.get('[data-cy=file-item]', { timeout: 120000 }).should('not.exist')
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
  cy.contains(optionText).click()
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

Cypress.Commands.add('validateChatPageIsLoaded', (isMobile = false) => {
  if (isMobile === false) {
    cy.get('[data-cy=user-name]', { timeout: 120000 }).should('exist')
  } else if (isMobile === true) {
    cy.get('#mobile-nav', { timeout: 120000 }).should('exist')
  }
})

Cypress.Commands.add('goToConversation', (user, isMobile = false) => {
  cy.get('#app-wrap').then(($appWrap) => {
    if (!$appWrap.hasClass('is-open')) {
      cy.get('[data-cy=toggle-sidebar]').click()
    }
  })

  //Find the friend and click on the message button associated
  cy.get('[data-cy=sidebar-user-name]', { timeout: 60000 })
    .contains(user)
    .then(($el) => {
      cy.getAttached($el).click()
    })

  // Hide sidebar if not on mobile browser
  if (isMobile === false) {
    cy.get('[data-cy=hamburger-button]').click()

    //Navigate through several pages before going to conversation
    //As a workaround for the issue of message containers taking a lot of time to be loaded
    cy.workaroundChatLoad(user)
  }

  //Wait until conversation is fully loaded
  cy.get('[data-cy=message-container]', { timeout: 120000 })
    .last()
    .should('exist')
})

Cypress.Commands.add('workaroundChatLoad', (user) => {
  //Note: This workaround only works for non mobile tests. Mobiles tests will be skipped for now

  cy.get('[data-cy=toggle-sidebar]').click() //Click on toggle sidebar to display sidebar menu
  cy.get('[data-cy=sidebar-files]').click() //Go to files page
  cy.get('[data-cy=sidebar-friends]').click() //Go to friends page
  cy.get('[data-cy=sidebar-files]').click() // Return to files page
  //Click on the conversation again
  cy.get('[data-cy=sidebar-user-name]', { timeout: 30000 })
    .contains(user)
    .click()
  cy.get('[data-cy=hamburger-button]').click() // Hide sidebar if not on mobile browser
})

// Chat - Hover on Icon Commands

Cypress.Commands.add('hoverOnComingSoonIcon', (locator, expectedMessage) => {
  cy.get(locator).should('be.visible').find('.coming-soon').should('exist')
  cy.get(locator).realHover()
  cy.contains(expectedMessage).should('be.visible')
})

Cypress.Commands.add('hoverOnActiveIcon', (locator, expectedMessage) => {
  cy.get(locator).should('be.visible').realHover()
  cy.contains(expectedMessage).should('be.visible')
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
    .should('have.class', 'main-title')
  cy.contains('Stay tuned for these upcoming features:')
    .should('be.visible')
    .should('have.class', 'sub')
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
  cy.window().then((win) => {
    cy.stub(win, 'open').as('open')
  })
  cy.contains('Keep Me Posted').click()
  cy.get('@open').should(
    'have.been.calledOnceWithExactly',
    'https://twitter.com/satellite_im',
    '_blank',
  )
})

Cypress.Commands.add('validateGlyphsModal', () => {
  cy.get('[data-cy=glyphs-modal]').should('be.visible')
  cy.get('[data-cy=glyphs-modal-title]')
    .should('be.visible')
    .invoke('text')
    .then(($text) => {
      expect($text).to.be.oneOf(['Astrobunny', 'Genshin Impact 2'])
    })
  cy.get('.img-container').children().should('have.length', 3)
  cy.contains('View Glyph Pack').should('be.visible')
})

Cypress.Commands.add('closeModal', (locator) => {
  cy.get(locator).find('.close-button').click()
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
  cy.get('[data-cy=files-screen]', { timeout: 60000 }).should('exist')
})

Cypress.Commands.add('renameFileOrFolder', (newName, type = 'folder') => {
  //Click on list view
  cy.get('[data-cy=files-view-list]').click()
  cy.get('[data-cy=files-table]').should('be.visible')
  //Assert on file or folder icon depending on parameters
  if (type === 'file') {
    cy.get('[data-cy=file-icon]').first().as('itemLocator')
  } else {
    cy.get('[data-cy=folder-icon]').first().as('itemLocator')
  }
  //Get the file/folder with same name from parameters and click on options
  cy.get('@itemLocator')
    .parents('[data-cy=files-item]')
    .find('[data-cy=file-item-options]')
    .click()

  //Click on Rename from Context menu
  cy.get('[data-cy=context-menu]').children().contains('Rename').click()

  //Change name from file or folder and submit
  cy.get('[data-cy=files-rename]')
    .should('exist')
    .find('[data-cy=input-group]')
    .type(newName)
  cy.get('[data-cy=files-rename]').find('[data-cy=submit-input]').click()

  //Assert that file or folder name was changed
  cy.contains(newName, { timeout: 30000 }).should('be.visible')
})

// Chat - Markdown Commands

Cypress.Commands.add('sendMessageWithMarkdown', (text, markdown) => {
  let textMarkdown = markdown + text + markdown
  // Write the text message
  cy.get('[data-cy=editable-input]')
    .should('be.visible')
    .trigger('input')
    .paste({
      pasteType: 'text',
      pastePayload: textMarkdown,
    })
  // Assert the text message is displayed before sending
  cy.get('[data-cy=editable-input]')
    .should('have.text', textMarkdown)
    .then(() => {
      cy.get('[data-cy=send-message]').click() //sending text message
    })
  // Wait until loading indicator disappears
  cy.get('[data-cy=loading-indicator]', { timeout: 60000 }).should('not.exist')
  // Depending on the markdown passed, assert the text from the corresponding HTML tag
  if (markdown === '*' || markdown === '_') {
    cy.get('em').last().should('have.text', text)
  } else if (markdown === '**') {
    cy.get('strong').last().should('have.text', text)
  } else if (markdown === '__') {
    cy.get('u').last().should('have.text', text)
  } else if (markdown === '`') {
    cy.get('code').last().should('have.text', text)
  } else if (markdown === '***') {
    cy.get('strong')
      .last()
      .should('have.text', text)
      .parent('em') // Assert that text have a parent EM HTML tag
      .should('exist')
  } else if (markdown === '~~') {
    cy.get('del').last().should('have.text', text)
  } else if (markdown === '||') {
    cy.get('.spoiler-container')
      .last()
      .should('not.have.class', 'spoiler-open')
      .click() // Assert that after clicking the spoiler, text is displayed
      .should('have.class', 'spoiler-open')
      .find('.spoiler')
      .should('have.text', text)
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

// LocalStorage Validations

Cypress.Commands.add('validatePassphraseLocalStorage', () => {
  cy.getLocalStorage('Satellite-Store').then((value) => {
    let valueObject = JSON.parse(value)
    expect(valueObject.accounts.phrase).to.eq('')
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
