const faker = require('faker')
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
const randomName = faker.internet.userName(name) // generate random name
const randomStatus = faker.lorem.word() // generate random status

describe('Create Account - Negative Tests', () => {
  it('Try to create account with PIN less than 5 digits', () => {
    //Enter PIN screen and add an invalid pin
    cy.get('[data-cy=add-input]')
      .should('be.visible')
      .trigger('input')
      .type(pin, { log: false }, { force: true })
    cy.contains('Store Pin? (Less Secure)').should('be.visible')
  })
})
