describe('Version Release Notes', () => {
  it('Release notes appear when clicking on version number', () => {
    cy.visitRootPage()
    cy.releaseNotesScreenValidation()
  })
})
