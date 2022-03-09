it('Verify error when adding a wrong order passphrase', () => {
  cy.visit('/')
  cy.get('[data-cy=add-input]').type('test001', { log: false })
  cy.get('[data-cy=submit-input]').click()
  cy.contains('Import Account').click()
  cy.get('[data-cy=add-passphrase]').type(
    'over tilt regret diamond rubber example there fire roof sheriff always boring',
    { log: false },
  )
  cy.get('[data-cy=add-passphrase]').type('{enter}')
  cy.contains('Recover Account').click()
  cy.contains(
    'We were unable to verify your passphrase. Please check it and try again.',
  ).should('be.visible')
})

it('Verify behavior when adding less than 12 words', () => {
  cy.visit('/')
  cy.get('[data-cy=add-input]').type('test001', { log: false })
  cy.get('[data-cy=submit-input]').click()
  cy.contains('Import Account').click()
  cy.get('[data-cy=add-passphrase]').type(
    'over tilt regret diamond rubber example there fire roof sheriff always',
    { log: false },
  )
  cy.get('[data-cy=add-passphrase]').type('{enter}')
  cy.get('.recover-account').should('be.disabled')
})
