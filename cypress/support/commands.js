import 'cypress-file-upload'
import 'cypress-localstorage-commands'

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

//Create Account Commands

Cypress.Commands.add('createAccount', () => {
  cy.visit('/')
  cy.get('[data-cy=add-input]').type('test001', { log: false })
  cy.get('[data-cy=submit-input]').click()
  cy.get('.is-primary > #custom-cursor-area').click()
  cy.get('.switch-button').each(($btn, index, $List) => {
    if ($btn.hasClass('enabled')) {
      cy.wrap($btn).click().should('not.have.class', 'enabled')
    } else {
      cy.wrap($btn).click().should('have.class', 'enabled')
    }
  })
  cy.get('#custom-cursor-area').click()
  cy.get('.title').should('contain', 'Recovery Seed')
  cy.contains('Continue').click()
  cy.contains('I Saved It').click()
  Cypress.on('uncaught:exception', (err, runnable) => false) // temporary until AP-48 gets fixed
  cy.get('[data-cy=username-input]').type(randomName)
  cy.get('[data-cy=status-input]').type(randomStatus)
  cy.get('[data-cy=sign-in-button]').click()
})

Cypress.Commands.add('createAccountPINscreen', (pin) => {
  cy.url().should('contains', '/#/auth/unlock')
  cy.contains('Create Account Pin').should('be.visible')
  cy.contains("The pin can be anything you want, just don't forget it.").should(
    'be.visible',
  )
  cy.contains('Choose Your Pin').should('be.visible')
  cy.get('[data-cy=add-input]').should('be.visible').type(pin, { log: false })
  cy.contains('Store Pin? (Less Secure)').should('be.visible')
  cy.get('[data-cy=submit-input]').should('be.visible').click()
})

Cypress.Commands.add('createAccountSecondScreen', () => {
  cy.contains(
    "We're going to create an account for you. On the next screen, you'll see a set of words. Screenshot this or write it down. This is the only way to backup your account.",
  ).should('be.visible')
  cy.get('.is-primary > #custom-cursor-area').should('be.visible').click()
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
      if ($btn.hasClass('enabled')) {
        cy.wrap($btn).click().should('not.have.class', 'enabled')
      } else {
        cy.wrap($btn).click().should('have.class', 'enabled')
      }
    })
  cy.get('#custom-cursor-area').should('be.visible').click()
})

Cypress.Commands.add('createAccountRecoverySeed', () => {
  cy.get('.title').should('be.visible').should('contain', 'Recovery Seed')
  cy.contains('I Saved It').should('be.visible')
  cy.get('#custom-cursor-area').should('be.visible').click()
  Cypress.on('uncaught:exception', (err, runnable) => false) // temporary until AP-48 gets fixed
})

Cypress.Commands.add('createAccountUserInput', (username, status) => {
  cy.contains('Customize how the world sees you, choose something memorable.', {
    timeout: 10000,
  }).should('be.visible')
  cy.get('[data-cy=username-input]').should('be.visible').type(randomName)
  cy.get('[data-cy=status-input]').should('be.visible').type(randomStatus)
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

Cypress.Commands.add('importAccount', () => {
  cy.visit('/')
  cy.get('[data-cy=add-input]')
    .should('be.visible')
    .type('test001', { log: false })
  cy.get('[data-cy=submit-input]').should('be.visible').click()
  cy.contains('Import Account').should('be.visible').click()
  cy.contains(
    'Enter your 12 word passphrase in exactly the same order your recovery seed was generated.',
  ).should('be.visible')
  cy.get('[data-cy=add-passphrase]')
    .should('be.visible')
    .type(
      'boring over tilt regret diamond rubber example there fire roof sheriff always',
      { log: false },
    )
  cy.get('[data-cy=add-passphrase]').type('{enter}')
  cy.contains('Recover Account').should('be.visible').click()
  Cypress.on('uncaught:exception', (err, runnable) => false) // temporary until AP-48 gets fixed
})

//Chat Features Commands

Cypress.Commands.add('chatFeaturesProfileName', (value) => {
  cy.contains(value, { timeout: 60000 }).should('be.visible')
  cy.contains(value).click() // clicks on user name
})

Cypress.Commands.add('chatFeaturesSendMessage', (message) => {
  cy.get('.messageuser').type(message)
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
    cy.get('.edit-message-body-input').click()
    cy.get('.edit-message-body-input').type(messageEdited) // editing message
    cy.get('.edit-message-body-input').type('{enter}')
    cy.contains(messageEdited)
  },
)

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
      cy.document().toMatchImageSnapshot()
    })
})

Cypress.Commands.add('snapshotTestGet', (locator, text, timeout = 4000) => {
  cy.get(locator, { timeout: timeout })
    .should('contain', text)
    .then(() => {
      cy.document().toMatchImageSnapshot()
    })
})

//Settings Menu

Cypress.Commands.add('openSettingsMenuOption', (option) => {
  cy.get('.menu-list').contains(option).click()
})
