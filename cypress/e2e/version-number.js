describe('Version number appears', () => {
  it('Version number appears', () => {
    cy.visit('/')
    cy.get('[data-cy=version]')
      .should('be.visible')
      .find('span')
      .contains('Core-PWA')
  })
})
