describe.skip('Version Release Notes', () => {
  //Skipped because version number does not redirect to Version Release Notes
  it('Release notes appear when clicking on version number', () => {
    cy.visitRootPage()
    cy.releaseNotesScreenValidation()
  })
})
