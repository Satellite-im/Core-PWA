const COMMAND_DELAY = 2000; // to run tests slower

for (const command of ['visit', 'click', 'trigger', 'type', 'clear', 'reload', 'contains']) {
    Cypress.Commands.overwrite(command, (originalFn, ...args) => {
       const origVal = originalFn(...args);

       return new Promise((resolve) => {
           setTimeout(() => {
              resolve(origVal);
           }, COMMAND_DELAY);
       });
    });
}

    it('Create Account', () => {
    cy.visit('/')
    cy.url().should('contains', '/#/auth/unlock')
    cy.contains('Create Account Pin')
    cy.contains("The pin can be anything you want, just don't forget it.")
    cy.contains('Choose Your Pin')
    cy.get('[data-cy=add-input]').type('22,A9ZJ[F\t5g',{log:false})
    cy.contains('Store Pin? (Less Secure)')
    cy.get('[data-cy=submit-input]').click()
    cy.contains("We're going to create an account for you. On the next screen you'll see a set of words. Screenshot this or write it down. This is the only way to backup your account.")
    cy.get('.is-primary > #custom-cursor-area').click()
    cy.contains('I Saved It').click()
    cy.contains('Customize how the world sees you, choose something memorable.', {timeout: 5000}).should('be.visible')
    cy.contains('Username')
    Cypress.on('uncaught:exception', (err, runnable) => false); // temporary until AP-48 gets fixed
    cy.get('.input-container:nth-child(3) .input').type('name name') //add random name and add data-cy label - AP-53
    cy.contains('Status')
    cy.get('.input-container:nth-child(4) .input').type('status') //add random copy and add data-cy label - AP-53
    const filepath = 'images/logo.png'
    cy.get('.is-outlined > #custom-cursor-area').click()
    cy.get('.input-file').attachFile(filepath)
    cy.contains('Crop').click()
    cy.get('.create-server-btn > #custom-cursor-area').click()
    cy.contains('Linking Satellites...')
    cy.contains('Working on the space station', {timeout: 30000}).should('be.visible')
})

    it('Decrypt Account', () => {
    cy.visit('/')
    cy.contains('Decrypt Account')
    cy.get('#app > div > div > div:nth-child(1) > div > div:nth-child(1) > input').type('22,A9ZJ[F\t5g',{log:false}) //update for data-cy label
    cy.get('#app > div > div > div:nth-child(1) > div > div:nth-child(2) > a').click() //update for data-cy label
    cy.contains('Working on the space station', {timeout: 30000}).should('be.visible')
})

// add persisting pin test
