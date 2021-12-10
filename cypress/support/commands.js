const faker = require('faker')
const randomName = faker.internet.userName(name) // generate random name
const randomStatus = faker.lorem.word() // generate random status

Cypress.Commands.add('createAccount', () => {
  cy.visit('/')
  cy.get('[data-cy=add-input]').type('22,A9ZJ[F\t5g', { log: false })
  cy.get('[data-cy=submit-input]').click()
  cy.get('.is-primary > #custom-cursor-area').click()
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
    'Enter your 12 word pass phrase in exactly the same order your recovery seed was generated.',
  )
  cy.get('[data-cy=add-passphrase]').type(
    'boring over tilt regret diamond rubber example there fire roof sheriff always',
    { log: false },
  )
  cy.get('[data-cy=add-pass-phrase]').type('{enter}')
  cy.contains('Recover Account').click()
})

import 'cypress-file-upload'
