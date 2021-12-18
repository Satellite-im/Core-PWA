it('Try to create account with PIN less than 5 digits', () => {
  cy.visit('/')
  cy.contains('Create Account Pin')
  cy.get('[data-cy=add-input]').type('1')
  cy.get('[data-cy=submit-input]').click()
  cy.contains('Pin must be at least 5 characters.')
  cy.reload()
  cy.get('[data-cy=submit-input]').click()
  cy.contains('Pin must be at least 5 characters.')
})

it('Try to create account without username', () => {
  cy.visit('/')
  cy.get('[data-cy=add-input]').type('test001', { log: false })
  cy.get('[data-cy=submit-input]').click()
  cy.get('.is-primary > #custom-cursor-area').click()
  cy.contains('Continue').click()
  cy.contains('I Saved It').click()
  Cypress.on('uncaught:exception', (err, runnable) => false) // temporary until AP-48 gets fixed
  cy.get('[data-cy=sign-in-button]').click()
  cy.contains('Username must be at least 5 characters.')
})
