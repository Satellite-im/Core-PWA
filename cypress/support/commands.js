import 'cypress-file-upload'
import 'cypress-localstorage-commands'
import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command'

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

Cypress.Commands.add('visitRootPage', () => {
  cy.deleteStorage()
  cy.wait(1000)
  cy.visit('/')
  cy.wait(1000)
  cy.get('body').then(($body) => {
    if (!($body.find('.create_pin_section').length > 0)) {
      cy.visitRootPage()
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

Cypress.Commands.add('createAccount', (pin) => {
  cy.clearDatabase()
  cy.visitRootPage()
  cy.url().should('contain', '#/auth/unlock')
  cy.get('[data-cy=add-input]')
    .should('be.visible')
    .trigger('input')
    .type(pin, { log: false }, { force: true })
  cy.get('[data-cy=submit-input]').click()
  cy.get('[data-cy=create-account-button]').click()
  cy.get('.title').should('contain', 'Recovery Seed')
  cy.contains('Continue').click()
  cy.contains('I Saved It').click()
  Cypress.on('uncaught:exception', (err, runnable) => false) // temporary until AP-48 gets fixed
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
  (pin, savePin = false, snapshot = false) => {
    cy.clearDatabase()
    cy.visitRootPage()
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
  cy.get('#custom-cursor-area').click()
  Cypress.on('uncaught:exception', (err, runnable) => false) // temporary until AP-48 gets fixed
})

Cypress.Commands.add('validateUserInputIsDisplayed', () => {
  cy.get('[data-cy=username-input]', { timeout: 120000 }).should('be.visible')
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
          cy.wrap($btn).should('have.class', 'enabled')
        } else {
          cy.wrap($btn).should('not.have.class', 'enabled')
        }
      })
  },
)

Cypress.Commands.add('validateSignalingServersValue', (expectedValue) => {
  cy.get('[data-cy=custom-select]').should('be.visible')
  cy.get('[data-cy=custom-select-value]').should('contain', expectedValue)
})

//Import Account Commands

Cypress.Commands.add('importAccount', (pin, recoverySeed) => {
  cy.clearDatabase()
  cy.visitRootPage()
  cy.url().should('contain', '#/auth/unlock')
  cy.get('[data-cy=add-input]')
    .should('be.visible')
    .trigger('input')
    .type(pin, { log: false }, { force: true })
  cy.get('[data-cy=submit-input]').click()
  cy.get('[data-cy=import-account-button]', { timeout: 60000 }).click()
  cy.get('[data-cy=add-passphrase]')
    .should('be.visible')
    .trigger('input')
    .type(recoverySeed, { log: false }, { force: true })
  cy.contains('Recover Account').click()
  Cypress.on('uncaught:exception', (err, runnable) => false) // temporary until AP-48 gets fixed
})

Cypress.Commands.add(
  'importAccountPINscreen',
  (pin, savePin = false, snapshot = false) => {
    cy.clearDatabase()
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
  Cypress.on('uncaught:exception', (err, runnable) => false) // temporary until AP-48 gets fixed
})

//Chat Features Commands

Cypress.Commands.add('chatFeaturesProfileName', (value) => {
  // clicks on user name
  cy.get('[data-cy=user-name]')
    .should('be.visible')
    .should('have.text', value)
    .click()
  cy.wait(1000)
})

Cypress.Commands.add('chatFeaturesSendMessage', (message) => {
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
  cy.contains(message, { timeout: 30000 })
    .last()
    .scrollIntoView()
    .should('exist')
})

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
    .parent()
    .parent()
    .find('[data-cy=reply-preview]')
    .as('reply-preview')
})

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

Cypress.Commands.add('chatFeaturesSendImage', (imagePath, filename) => {
  cy.get('#quick-upload').selectFile(imagePath, {
    force: true,
  })
  cy.get('.file-item', { timeout: 30000 }).should('exist')
  cy.get('.file-info > .title').should('contain', filename)
  cy.contains('Scanning', { timeout: 120000 }).should('not.exist')
  cy.get('.thumbnail').should('exist')
  cy.get('[data-cy=send-message]').click() //sending image message
  cy.get('.thumbnail', { timeout: 120000 }).should('not.exist')
})

Cypress.Commands.add('goToLastImageOnChat', () => {
  cy.get('[data-cy=chat-image]').last().scrollIntoView().should('exist')
})

Cypress.Commands.add('chatFeaturesSendFile', (filePath) => {
  cy.get('#quick-upload').selectFile(filePath, {
    force: true,
  })
  cy.get('.file-item').should('exist')
  cy.get('.file-info > .title').should('contain', 'test-file.txt')
  cy.get('.preview', { timeout: 120000 }).should('exist')
  cy.get('[data-cy=send-message]').click() //sending file message
  cy.get('.preview', { timeout: 120000 }).should('not.exist')
})

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

Cypress.Commands.add('clickOutside', () => {
  cy.get('body').click(0, 0) //0,0 here are the x and y coordinates
})

Cypress.Commands.add('validateChatPageIsLoaded', () => {
  cy.get('[data-cy=user-name]', { timeout: 360000 }).should('exist')
})

Cypress.Commands.add('goToConversation', (user, mobile = false) => {
  //If sidebar menu is collapsed, click on hamburger button to display it
  cy.get('#app-wrap').then(($appWrap) => {
    if (!$appWrap.hasClass('is-open')) {
      cy.get('[data-cy=hamburger-button]').click()
    }
  })

  //Click on Friends button only if its not already selected
  cy.get('[data-cy=sidebar-friends]').then(($btn) => {
    if ($btn.hasClass('is-dark')) {
      cy.wrap($btn).click()
    }
  })

  //On mobile viewports, we need to click on hamburger button to see the chat selected
  if (mobile === true) {
    cy.get('[data-cy=hamburger-button]').click()
  }

  //Find the friend and click on the message button associated
  cy.get('[data-cy=friend-name]', { timeout: 30000 })
    .contains(user)
    .as('friend')
  cy.get('@friend')
    .parent()
    .parent()
    .find('[data-cy=friend-send-message]')
    .as('friend-message')
  cy.get('@friend-message').click()

  //Wait until conversation is fully loaded
  cy.get('[data-cy=user-connected]', { timeout: 120000 })
    .should('be.visible')
    .should('have.text', user)
})

Cypress.Commands.add('hoverOnComingSoonIcon', (locator, expectedMessage) => {
  cy.get(locator)
    .realHover()
    .should('have.attr', 'data-tooltip', expectedMessage)
  cy.wait(1000)
  cy.get('body').realHover({ position: 'topLeft' })
})

Cypress.Commands.add('hoverOnActiveIcon', (locator) => {
  cy.get(locator).should('be.visible').realHover()
  cy.wait(1000)
  cy.get('body').realHover({ position: 'topLeft' })
})

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

Cypress.Commands.add('goToLastGlyphOnChat', () => {
  cy.get('[data-cy=chat-glyph]').last().scrollIntoView().should('exist')
})

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
