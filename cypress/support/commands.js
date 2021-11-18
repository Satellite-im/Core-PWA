Cypress.Commands.add('createAccount', () => {
    cy.visit('/')
    cy.get('#app > div > div > div:nth-child(2) > div > div:nth-child(1) > input').type('22,A9ZJ[F\t5g',{log:false}) //update for data-cy label - AP-51
    cy.get('#app > div > div > div:nth-child(2) > div > div:nth-child(2) > a').click() //update for data-cy label - AP-52
    cy.get('.is-primary > #custom-cursor-area').click()
    cy.contains('I Saved It').click()
    Cypress.on('uncaught:exception', (err, runnable) => false); // temporary until AP-48 gets fixed
    cy.get('.input-container:nth-child(3) .input').type('name name') //add random name and add data-cy label - AP-53
    cy.get('.input-container:nth-child(4) .input').type('status') //add status name and add data-cy label - AP-53
    cy.get('.create-server-btn > #custom-cursor-area').click();
})

import 'cypress-file-upload';
