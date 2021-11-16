describe('Create Account Pin', () => {
    it('Create Account Pin', () => {
    cy.visit('/')
    cy.contains('Create Account Pin')
    cy.contains('The pin can be anything you want, just don/t foreget it.')

  })
})
