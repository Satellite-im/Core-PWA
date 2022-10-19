describe('Version number appears', () => {
  it('Version number appears', () => {
    cy.visitRootPage()
    cy.get('[data-cy=version]').should('be.visible').click()  })
})
