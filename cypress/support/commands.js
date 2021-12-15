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

Cypress.Commands.add('createAccount', () => {
  cy.visit('/')
  cy.get('[data-cy=add-input]').type('22,A9ZJ[F\t5g', { log: false })
  cy.get('[data-cy=submit-input]').click()
  cy.get('.is-primary > #custom-cursor-area').click()
  cy.contains('Continue').click()
  cy.contains('I Saved It').click()
  Cypress.on('uncaught:exception', (err, runnable) => false) // temporary until AP-48 gets fixed
  cy.get('[data-cy=username-input]').type(randomName)
  cy.get('[data-cy=status-input]').type(randomStatus)
  cy.get('[data-cy=sign-in-button]').click()
})

Cypress.Commands.add('importAccount', () => {
  cy.visit('/')
  cy.get('[data-cy=add-input]').type('test001', { log: false })
  cy.get('[data-cy=submit-input]').click()
  cy.contains('Import Account').click()
  cy.contains(
    'Enter your 12 word passphrase in exactly the same order your recovery seed was generated.',
  )
  cy.get('[data-cy=add-passphrase]').type(
    'boring over tilt regret diamond rubber example there fire roof sheriff always',
    { log: false },
  )
  cy.get('[data-cy=add-passphrase]').type('{enter}')
  cy.contains('Recover Account').click()
  cy.contains('Working on the space station', { timeout: 30000 }).should(
    'be.visible',
  )
})

import 'cypress-file-upload'
