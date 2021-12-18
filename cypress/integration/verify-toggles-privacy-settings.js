it('Verify toggles privacy settings', () => {
  cy.visit('/')
  cy.get('[data-cy=add-input]').type('test001', { log: false })
  cy.get('[data-cy=submit-input]').click()
  cy.get('.is-primary > #custom-cursor-area').click()
  cy.get(
    '.columns:nth-child(3) > .column:nth-child(1) .switch-button',
  ).dblclick()
  cy.get(
    '.columns:nth-child(3) > .column:nth-child(2) .switch-button',
  ).dblclick()
  cy.get('.column:nth-child(2) .enabled').dblclick()
  cy.get('.columns:nth-child(4) > .column:nth-child(1) .sw-button').dblclick()
  cy.contains('Continue').click()
  // ditch the nth later
})
