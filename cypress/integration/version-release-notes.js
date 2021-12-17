it('Release notes appear when clicking on version number', () => {
  cy.visit('/')
  cy.get('[data-cy=version]').click()
  cy.contains('Update')
  cy.contains('is Here!')
  cy.contains('Got It!').click()
})
