it('Try to create account with PIN less than 5 digits', () => {
  cy.visit('/')
  cy.contains('Create Account Pin')
  cy.get('[data-cy=add-input]').type('1')
  cy.get('[data-cy=submit-input]').click()
  cy.contains('Pin must be at least 5 characters.')
  cy.reload()
  cy.get('[data-cy=submit-input]').click()
  cy.contains('Pin must be at least 5 characters.')
  a
})
