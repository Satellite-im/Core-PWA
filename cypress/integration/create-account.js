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

it('Create Account', () => {
  cy.visit('/')
  cy.url().should('contains', '/#/auth/unlock')
  cy.contains('Create Account Pin')
  cy.contains("The pin can be anything you want, just don't forget it.")
  cy.contains('Choose Your Pin')
  cy.get('[data-cy=add-input]').type('22,A9ZJ[F\t5g', { log: false })
  cy.contains('Store Pin? (Less Secure)')
  cy.get('[data-cy=submit-input]').click()
  cy.contains(
    "We're going to create an account for you. On the next screen, you'll see a set of words. Screenshot this or write it down. This is the only way to backup your account.",
  )
  cy.get('.is-primary > #custom-cursor-area').click()
  cy.contains('Privacy Settings')
  cy.contains(
    'Choose which features to enable to best suit your privacy preferences.',
  )
  cy.contains('Register Username Publicly')
  cy.contains(
    'Publicly associate your account ID with a human readable username. Anyone can see this association.',
  )
  cy.contains(
    "Store your account pin locally so you don't have to enter it manually every time. This is not recommended.",
  )
  cy.contains('Display Current Activity')
  cy.contains(
    "Allow Satellite to see what games you're playing and show them off on your profile so friends can jump in.",
  )
  cy.contains('Enable External Embeds')
  cy.contains(
    'Allow Satellite to fetch data from external sites in order to expand links like Spotify, YouTube, and more.',
  )
  cy.contains('Continue').click()
  cy.contains('I Saved It').click()
  cy.contains('Customize how the world sees you, choose something memorable.', {
    timeout: 5000,
  }).should('be.visible')
  cy.contains('Username')
  Cypress.on('uncaught:exception', (err, runnable) => false) // temporary until AP-48 gets fixed
  cy.get('[data-cy=username-input]').type(randomName)
  cy.contains('Status')
  cy.get('[data-cy=status-input]').type(randomStatus)
  const filepath = 'images/logo.png'
  cy.get('.is-outlined > #custom-cursor-area').click()
  cy.get('.input-file').attachFile(filepath)
  cy.contains('Crop').click()
  cy.get('[data-cy=sign-in-button]').click()
  cy.contains('Linking Satellites...')
  cy.contains('Working on the space station', { timeout: 30000 }).should(
    'be.visible',
  )
})
