it('Release notes appear when clicking on version number', () => {
  cy.visit('/')
  cy.releaseNotesScreenValidation()
})
