    it('Try to create account with PIN less than 5 digits', () => {
    cy.visit('/')
    cy.contains('Create Account Pin')
    cy.get('#app > div > div > div:nth-child(2) > div > div:nth-child(2) > a').click() //update for data-cy label - AP-52
    cy.contains('Pin must be at least 5 characters.')
    cy.reload()
    cy.get('#app > div > div > div:nth-child(2) > div > div:nth-child(2) > a').click() //update for data-cy label - AP-52
    cy.get('#app > div > div > div:nth-child(2) > div > div:nth-child(1) > input').type('1') //update for data-cy label - AP-51
    cy.contains('Pin must be at least 5 characters.')
})
