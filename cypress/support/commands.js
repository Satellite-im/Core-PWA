const faker = require('faker');
const randomName = faker.internet.userName(name); // generate random name
const randomStatus = faker.lorem.word(); // generate random status

Cypress.Commands.add('createAccount', () => {
    cy.visit('/')
    cy.get('[data-cy=add-input]').type('22,A9ZJ[F\t5g',{log:false})
    cy.get('[data-cy=submit-input]').click()
    cy.get('.is-primary > #custom-cursor-area').click()
    cy.contains('I Saved It').click()
    Cypress.on('uncaught:exception', (err, runnable) => false); // temporary until AP-48 gets fixed
    cy.get('.input-container:nth-child(3) .input').type(randomName) //add data-cy label - AP-53
    cy.get('.input-container:nth-child(4) .input').type(randomStatus) // add data-cy label - AP-53
    cy.get('.create-server-btn > #custom-cursor-area').click();
})

import 'cypress-file-upload';
