const faker = require('faker');

Cypress.Commands.add('createAccount', () => {
    cy.visit('/')
    cy.get('[data-cy=add-input]').type('22,A9ZJ[F\t5g',{log:false})
    cy.get('[data-cy=submit-input]').click()
    cy.get('.is-primary > #custom-cursor-area').click()
    cy.contains('I Saved It').click()
    Cypress.on('uncaught:exception', (err, runnable) => false); // temporary until AP-48 gets fixed
    cy.get('.input-container:nth-child(3) .input').type('name test') // add data-cy label - AP-53
    cy.get('.input-container:nth-child(4) .input').type('status') // add data-cy label - AP-53
    cy.get('.create-server-btn > #custom-cursor-area').click();
})

import 'cypress-file-upload';
