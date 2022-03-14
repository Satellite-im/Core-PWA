import 'cypress-file-upload'
import 'cypress-localstorage-commands'
import { addMatchImageSnapshotCommand } from "../../node_modules/cypress-image-snapshot/command"

addMatchImageSnapshotCommand()

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

//Command to retry visiting root page when previous PIN data is not cleared correctly

Cypress.Commands.add('visitRootPage', () => {
  cy.window().then((win) => {
    win.sessionStorage.clear()
  })
  cy.clearCookies()
  cy.clearLocalStorage()
  cy.visit('/')
  cy.url().then(($url) => {
    if (!($url === redirectedURL)) {
      cy.window().then((win) => {
        win.sessionStorage.clear()
      })
      cy.clearCookies()
      cy.clearLocalStorage()
      cy.visit('/')
    }
  })
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
  (pin, savePin = false, visualValidations = false, snapshot = false) => {
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
    if (visualValidations === true) {
      cy.contains('Create Account Pin').should('be.visible')
      cy.contains(
        "The pin can be anything you want, just don't forget it.",
      ).should('be.visible')
      cy.contains('Choose Your Pin').should('be.visible')
      cy.get('[data-cy=add-input]').should('be.visible')
      cy.contains('Store Pin? (Less Secure)').should('be.visible')
      cy.get('[data-cy=submit-input]').should('be.visible')
    }
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
  (pin, savePin = false, visualValidations = false, snapshot = false) => {
    cy.visitRootPage()
    cy.url().should('contain', '#/auth/unlock')
    if (snapshot === true) {
      cy.snapshotTestGet('.subtitle', 'Create Account Pin')
    }
    cy.get('[data-cy=add-input]')
      .should('be.visible')
      .type(pin, { log: false }, { force: true })
    if (visualValidations === true) {
      cy.contains('Create Account Pin').should('be.visible')
      cy.contains(
        "The pin can be anything you want, just don't forget it.",
      ).should('be.visible')
      cy.contains('Choose Your Pin').should('be.visible')
      cy.get('[data-cy=add-input]').should('be.visible')
      cy.contains('Store Pin? (Less Secure)').should('be.visible')
      cy.get('[data-cy=submit-input]').should('be.visible')
    }
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
  cy.contains(value, { timeout: 180000 }).should('be.visible')
  cy.contains(value).click() // clicks on user name
})

Cypress.Commands.add('chatFeaturesSendMessage', (message) => {
  cy.get('.messageuser').should('be.visible').type(message)
  cy.get('.messageuser').type('{enter}') // sending text message
  cy.contains(message)
})

Cypress.Commands.add('chatFeaturesSendEmoji', (emojiLocator, emojiValue) => {
  cy.get('#emoji-toggle > .control-icon').click()
  cy.get(emojiLocator).click() // sending emoji
  cy.get('.messageuser').click()
  cy.get('.messageuser').type('{enter}')
  cy.contains(emojiValue)
})

Cypress.Commands.add(
  'chatFeaturesEditMessage',
  (messageToEdit, messageEdited) => {
    cy.contains(messageToEdit).rightclick()
    cy.contains('Edit Message').click()
    cy.get('.edit-message-body-input').should('be.visible').type(messageEdited) // editing message
    cy.get('.edit-message-body-input').type('{enter}')
    cy.contains(messageEdited)
  },
)

Cypress.Commands.add('chatFeaturesSendGlyph', () => {
  cy.get('#glyph-toggle').click()
  cy.get('.pack-list > .is-text').should('contain', 'Try using some glyphs')
  cy.get('.glyph-item').first().click()
  cy.get('.messageuser').click().type('{enter}')
})

Cypress.Commands.add('chatFeaturesSendImage', (imagePath) => {
  cy.get('#quick-upload').selectFile(imagePath, {
    force: true,
  })
  cy.get('.file-item').should('be.visible')
  cy.get('.file-info > .title').should('contain', 'logo.png')
  cy.contains('Scanning', { timeout: 120000 }).should('not.exist')
  cy.get('.thumbnail').should('be.visible')
  cy.get('.messageuser').type('{enter}')
  cy.get('.thumbnail', { timeout: 120000 }).should('not.exist')
})

Cypress.Commands.add('chatFeaturesSendFile', (filePath) => {
  cy.get('#quick-upload').selectFile(filePath, {
    force: true,
  })
  cy.get('.file-item').should('be.visible')
  cy.get('.file-info > .title').should('contain', 'test-file.txt')
  cy.get('.preview', { timeout: 120000 }).should('exist')
  cy.get('.messageuser').type('{enter}')
  cy.get('.preview', { timeout: 120000 }).should('not.exist')
})

//Version Release Notes Commands

Cypress.Commands.add('releaseNotesScreenValidation', () => {
  cy.get('[data-cy=version]').should('be.visible').click()
  cy.contains('Update').should('be.visible')
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
