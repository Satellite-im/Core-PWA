import { dataRecovery } from '../fixtures/test-data-accounts.json'

const faker = require('faker')
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
const randomMessage = faker.lorem.sentence() // generate random sentence
const recoverySeed =
  dataRecovery.accounts
    .filter((item) => item.description === 'Only Text')
    .map((item) => item.recoverySeed) + '{enter}'

describe.skip('Chat Features Tests', () => {
  // skipped due to bug - AP-1686
  it('Chat - Send message on chat', { retries: 2 }, () => {
    // Import account
    cy.importAccount(randomPIN, recoverySeed)

    // Validate profile name displayed
    cy.validateChatPageIsLoaded()

    // Validate message is sent
    cy.goToConversation('Only Text Friend')
    cy.chatFeaturesSendMessage(randomMessage)
  })

  it('Chat - Search - Text message - Exact match', () => {
    //Get text from last chat-message and look for it in search bar
    cy.get('[data-cy=chat-message]')
      .contains(randomMessage)
      .last()
      .invoke('text')
      .then(($message) => {
        cy.searchFromTextInChat($message)
      })

    //Assert results and close search modal
    cy.assertFirstMatchOnSearch(randomMessage)
    cy.get('[data-cy=chat-search-result]').find('.close-button').click()
  })

  it('Chat - Search - Emoji - Exact match', () => {
    //Get text from last emoji-message and look for it in search bar
    cy.get('[data-cy=chat-message]')
      .contains('😄')
      .last()
      .invoke('text')
      .then(($message) => {
        cy.searchFromTextInChat($message)
      })

    //Assert results and close search modal
    cy.assertFirstMatchOnSearch('😄')
    cy.get('[data-cy=chat-search-result]').find('.close-button').click()
  })

  it('Chat - Search Results - Pagination is displayed when more than 10 matches are found', () => {
    //Look for a word showing more than 10 results in chat and ensure pagination is displayed
    cy.searchFromTextInChat('9876543210')
    cy.get('[data-cy=chat-search-result-pagination]').should('exist')
  })

  it('Chat - Search Results - Navigate through results ordered by New', () => {
    //Navigate through results sorted by New, which is the default view
    cy.navigateThroughSearchResults()
  })

  it('Chat - Search Results - Navigate through results ordered by Old', () => {
    //Click on Sort By Old
    cy.get('.orderby-item').contains('Old').click()

    //Navigate through all results sorted by Old
    cy.navigateThroughSearchResults()
  })

  it('Chat - Search Results - Navigate through results oredered by Relevant', () => {
    //Click on Sort By Relevant
    cy.get('.orderby-item').contains('Relevant').click()

    //Navigate through all results sorted by Relevant
    cy.navigateThroughSearchResults()

    //Finally close search results modal
    cy.get('[data-cy=chat-search-result]').find('.close-button').click()
  })

  it('Chat - Search - Results - Pagination is NOT displayed when 10 or less matches are found', () => {
    //Search for a random number and assert results
    cy.searchFromTextInChat('1234567890')
    cy.assertFirstMatchOnSearch('1234567890')

    //Validate that pagination is not displayed and close search modal
    cy.get('[data-cy=chat-search-result-pagination]').should('not.exist')
    cy.get('[data-cy=chat-search-result]').find('.close-button').click()
  })
})
