import 'cypress-file-upload'
import 'cypress-localstorage-commands'
import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command'

addMatchImageSnapshotCommand({
  customSnapshotsDir: '/cypress/snapshots',
})

const faker = require('faker')
const randomName = faker.internet.userName(name) // generate random name
const randomStatus = faker.lorem.word() // generate random status
const redirectedURL = 'http://localhost:3000/#/auth/unlock' // URL redirected from root

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
  cy.visit('/')
  // If Linking Satellites page is displayed, delete storage data and refresh
  cy.get('body').then(($body) => {
    if ($body.find('.page-loader-title').length > 0) {
      cy.deleteStorageAndRefresh()
    }
  })
  // If Decrypt account page is displayed, delete storage data and refresh
  cy.get('[data-cy=pin-label]').then(($label) => {
    if ($label.text() === 'Decrypt Account') {
      cy.deleteStorageAndRefresh()
    }
  })
})

Cypress.Commands.add('deleteStorageAndRefresh', () => {
  cy.window().then((win) => {
    win.sessionStorage.clear()
  })
  cy.clearCookies()
  cy.clearLocalStorage()
  cy.visit('/')
})

//Create Account Commands

Cypress.Commands.add('createAccount', (pin) => {
  cy.visitRootPage()
  cy.url().should('contain', '#/auth/unlock')
  cy.get('[data-cy=add-input]')
    .should('be.visible')
    .type(pin, { log: false }, { force: true })
  cy.get('[data-cy=submit-input]').click()
  cy.get('.is-primary > #custom-cursor-area').click()
  cy.get('.switch-button').each(($btn, index, $List) => {
    // Ignore locked switch toggle
    if (!$btn.hasClass('locked')) {
      if ($btn.hasClass('enabled')) {
        cy.wrap($btn).click().should('not.have.class', 'enabled')
      } else {
        cy.wrap($btn).click().should('have.class', 'enabled')
      }
    }
  })
  cy.get('#custom-cursor-area').click()
  cy.get('.title').should('contain', 'Recovery Seed')
  cy.contains('Continue').click()
  cy.contains('I Saved It').click()
  Cypress.on('uncaught:exception', (err, runnable) => false) // temporary until AP-48 gets fixed
  cy.get('[data-cy=username-input]', { timeout: 30000 })
    .should('be.visible')
    .type(randomName)
  cy.get('[data-cy=status-input]').should('be.visible').type(randomStatus)
  cy.get('[data-cy=sign-in-button]').click()
})

Cypress.Commands.add(
  'createAccountPINscreen',
  (pin, savePin = false, snapshot = false) => {
    cy.visitRootPage()
    cy.url().should('contain', '#/auth/unlock')
    if (snapshot === true) {
      cy.snapshotTestGet('.subtitle', 'Create Account Pin')
    }
    cy.get('[data-cy=add-input]')
      .should('be.visible')
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
  cy.get('.is-primary > #custom-cursor-area').click()
})

Cypress.Commands.add('createAccountPrivacyToggles', () => {
  cy.contains('Privacy Settings').should('be.visible')
  cy.contains(
    'Choose which features to enable to best suit your privacy preferences.',
  ).should('be.visible')
  cy.contains('Register Username Publicly').should('be.visible')
  cy.contains(
    'Publicly associate your account ID with a human readable username. Anyone can see this association.',
  ).should('be.visible')
  cy.contains(
    "Store your account pin locally so you don't have to enter it manually every time. This is not recommended.",
  ).should('be.visible')
  cy.contains('Display Current Activity').should('be.visible')
  cy.contains(
    "Allow Satellite to see what games you're playing and show them off on your profile so friends can jump in.",
  ).should('be.visible')
  cy.contains('Enable External Embeds').should('be.visible')
  cy.contains(
    'Allow Satellite to fetch data from external sites in order to expand links like Spotify, YouTube, and more.',
  ).should('be.visible')
  cy.get('.switch-button')
    .should('be.visible')
    .each(($btn, index, $List) => {
      if (!$btn.hasClass('locked')) {
        if ($btn.hasClass('enabled')) {
          cy.wrap($btn).click().should('not.have.class', 'enabled')
        } else {
          cy.wrap($btn).click().should('have.class', 'enabled')
        }
      }
    })
  cy.get('#custom-cursor-area').should('be.visible').click()
})

Cypress.Commands.add('createAccountPrivacyTogglesGoNext', () => {
  cy.contains('Privacy Settings').should('be.visible')
  cy.get('#custom-cursor-area').click()
})

Cypress.Commands.add('createAccountRecoverySeed', () => {
  cy.contains('Recovery Seed', { timeout: 15000 }).should('be.visible')
  cy.get('#custom-cursor-area').click()
  Cypress.on('uncaught:exception', (err, runnable) => false) // temporary until AP-48 gets fixed
})

Cypress.Commands.add('createAccountUserInput', (username, status) => {
  cy.get('[data-cy=username-input]', { timeout: 30000 })
    .should('be.visible')
    .type(randomName)
  cy.get('[data-cy=status-input]', { timeout: 30000 })
    .should('be.visible')
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

//Import Account Commands

Cypress.Commands.add('importAccount', (pin, recoverySeed) => {
  cy.visitRootPage()
  cy.url().should('contain', '#/auth/unlock')
  cy.get('[data-cy=add-input]')
    .should('be.visible')
    .type(pin, { log: false }, { force: true })
  cy.get('[data-cy=submit-input]').click()
  cy.contains('Import Account', { timeout: 60000 }).click()
  cy.get('[data-cy=add-passphrase]')
    .should('be.visible')
    .type(recoverySeed, { log: false }, { force: true })
  cy.contains('Recover Account').click()
  Cypress.on('uncaught:exception', (err, runnable) => false) // temporary until AP-48 gets fixed
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
  cy.contains('Import Account', { timeout: 60000 }).click()
  cy.get('[data-cy=add-passphrase]')
    .should('be.visible')
    .type(userPassphrase, { log: false }, { force: true })
  cy.get('[data-cy=add-passphrase]').type('{enter}')

  cy.contains('Recover Account').click()
  Cypress.on('uncaught:exception', (err, runnable) => false) // temporary until AP-48 gets fixed
})

//Chat Features Commands

Cypress.Commands.add('chatFeaturesProfileName', (value) => {
  cy.get('[data-cy=user-state]', {
    timeout: 180000,
  })
  cy.contains(value).should('be.visible')
  cy.contains(value).click() // clicks on user name
})

Cypress.Commands.add('chatFeaturesSendMessage', (message) => {
  cy.get('.editable-input').should('be.visible').type(message)
  cy.get('.editable-input').type('{enter}') // sending text message
  cy.contains(message, { timeout: 15000 })
    .last()
    .scrollIntoView()
    .should('be.visible')
})

Cypress.Commands.add('chatFeaturesSendEmoji', (emojiLocator, emojiValue) => {
  cy.get('#emoji-toggle > .control-icon').click()
  cy.get(emojiLocator).click() // sending emoji
  cy.get('.editable-input').click()
  cy.get('.editable-input').type('{enter}')
  cy.contains(emojiValue).last().scrollIntoView().should('be.visible')
})

Cypress.Commands.add(
  'chatFeaturesEditMessage',
  (messageToEdit, messageEdited) => {
    cy.contains(messageToEdit)
      .last()
      .scrollIntoView()
      .should('be.visible')
      .rightclick()
    cy.contains('Edit Message').click()
    cy.get('.edit-message-body-input').should('be.visible').type(messageEdited) // editing message
    cy.get('.edit-message-body-input').type('{enter}')
    cy.contains(messageEdited).last().scrollIntoView().should('be.visible')
  },
)

Cypress.Commands.add('chatFeaturesSendGlyph', () => {
  cy.get('#glyph-toggle').click()
  cy.get('.pack-list > .is-text').should('contain', 'Try using some glyphs')
  cy.get('.glyph-item').first().click()
  cy.get('.editable-input').click().type('{enter}')
})

Cypress.Commands.add('chatFeaturesSendImage', (imagePath) => {
  cy.get('#quick-upload').selectFile(imagePath, {
    force: true,
  })
  cy.get('.file-item').should('be.visible')
  cy.get('.file-info > .title').should('contain', 'logo.png')
  cy.contains('Scanning', { timeout: 120000 }).should('not.exist')
  cy.get('.thumbnail').should('be.visible')
  cy.get('.editable-input').type('{enter}')
  cy.get('.thumbnail', { timeout: 120000 }).should('not.exist')
})

Cypress.Commands.add('chatFeaturesSendFile', (filePath) => {
  cy.get('#quick-upload').selectFile(filePath, {
    force: true,
  })
  cy.get('.file-item').should('be.visible')
  cy.get('.file-info > .title').should('contain', 'test-file.txt')
  cy.get('.preview', { timeout: 120000 }).should('exist')
  cy.get('.editable-input').type('{enter}')
  cy.get('.preview', { timeout: 120000 }).should('not.exist')
})

Cypress.Commands.add('waitForMessagesToLoad', () => {
  //Sometimes the friends page is displayed instead of chat, so this code will fix this and click on message icon if needed
  cy.get('body').then(($body) => {
    if ($body.find('#conversation').length === 0) {
      cy.get('[data-tooltip="Message"]').click()
    }
  })
  cy.get('[data-cy=chat-message]', { timeout: 30000 })
    .last()
    .scrollIntoView()
    .should('be.visible')
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
