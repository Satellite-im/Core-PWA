it('Release notes appear when clicking on version number', () => {
  cy.visitRootPage()
  cy.releaseNotesScreenValidation()
})
