it('Release notes appear when clicking on version number', () => {
  cy.visit('/')
  cy.eyesOpen({
    appName: 'Cypress test',
    testName: 'Cypress test',
  })

  cy.eyesCheckWindow({
    tag: 'Login Window',
    target: 'window',
    fully: true,
  })
  cy.get('[data-cy=version]').click()
  cy.contains('Update')
  cy.contains('is Here!')
  cy.contains('Got It!').click()
  cy.eyesClose()
})
