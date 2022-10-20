describe('Chromium based browsers alert appears', () => {
  it('Chromium based browsers alert appears', () => {
    cy.visitRootPage()
    cy.contains('Satellite is optimized for Chromium browsers').should(
      'be.visible',
    )
    cy.contains(
      'You may experience UI and functional issues. We will optimize for more browsers in the future.',
    ).should('be.visible')
  })
})
