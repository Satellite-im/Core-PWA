import { dataRecovery } from '../fixtures/test-data-accounts.json'

const faker = require('faker')
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
const randomNumber = faker.datatype.number() // generate random number
const recoverySeed =
  dataRecovery.accounts
    .filter((item) => item.description === 'Only Text')
    .map((item) => item.recoverySeed) + '{enter}'

describe.skip('Files Features Tests', () => {
  // Skipping since import account is not working
  it('Chat - Files - Rename Folder', { retries: 2 }, () => {
    // Import account
    cy.importAccount(randomPIN, recoverySeed)

    // Validate profile name displayed
    cy.validateChatPageIsLoaded()

    // Validate message is sent
    cy.goToConversation('Only Text Friend')

    //Click on toggle-sidebar only if app is collapsed
    cy.get('#app-wrap').then(($appWrap) => {
      if ($appWrap.hasClass('is-collapsed')) {
        cy.get('[data-cy=toggle-sidebar]').click()
      }
    })
    //Open files screen and rename existing folder
    cy.openFilesScreen()
    cy.renameFileOrFolder('test-folder-' + randomNumber, 'folder')
  })

  it('Chat - Files - Rename Files', () => {
    //Wait until loading spinner disappears
    cy.get('.spinner', { timeout: 30000 }).should('not.exist')

    //Open files screen and rename existing file
    cy.openFilesScreen()
    cy.renameFileOrFolder('test-file-' + randomNumber, 'file')
  })
})
