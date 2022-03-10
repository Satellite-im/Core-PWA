it('Import account', () => {
  cy.importAccount()
})

it('Import account - verify suggestions', () => {
  cy.visit('/')
  cy.get('[data-cy=add-input]').type('test001', { log: false })
  cy.get('[data-cy=submit-input]').click()
  cy.contains('Import Account').click()
  cy.get('[data-cy=add-passphrase]').type('b')
  cy.contains('baby').click()
  cy.get('.tag').should('be.visible')
})
