const faker = require('faker')
const randomNumber = faker.datatype.number() // generate random number
const myFilePath = 'cypress/fixtures/test-file.txt'
const myFileName = 'test-file.txt'
const myFolderName = 'test-folder'

//Skipping since file uploads fail on CI
describe.skip(
  'Files Features Tests',
  {
    viewportHeight: 800,
    viewportWidth: 1200,
  },
  () => {
    before(() => {
      //Retrieve username from Chat User B
      cy.restoreLocalStorage('Chat User B')
    })

    it('Files - Create File', () => {
      // Login with User A by restoring LocalStorage Snapshot
      cy.loginWithLocalStorage('Chat User A')

      //After user is logged in, go to Files
      cy.openFilesScreen()

      //View files as list
      cy.get('[data-cy=files-view-list]').click()

      //Upload a new file
      cy.filesSectionUploadFile(myFilePath, myFileName)
    })

    it('Files - Create Folder', () => {
      //Create Folder
      cy.filesSectionCreateFolder(myFolderName)
    })

    it('Files - Rename Folder', () => {
      //Open files screen and rename existing folder

      cy.renameFileOrFolder(myFolderName, myFolderName + randomNumber)
    })

    it('Files - Rename Files', () => {
      //Wait until loading spinner disappears
      cy.get('.spinner', { timeout: 30000 }).should('not.exist')

      //Open files screen and rename existing file
      cy.openFilesScreen()
      cy.renameFileOrFolder(myFileName, myFileName + randomNumber)
    })
  },
)
