const faker = require('faker')
const randomMessageOne = faker.lorem.sentence() // generate random sentence
const randomMessageTwo = faker.lorem.sentence() // generate random sentence
const randomMessageThree = faker.lorem.sentence() // generate random sentence
let secondUserName

describe.skip('Chat Search Tests', () => {
  //Skipping Chat Search Tests since this is a coming soon functionality
  before(() => {
    //Retrieve username from Chat User B
    cy.restoreLocalStorage('Chat User B')
    cy.getLocalStorage('Satellite-Store').then((ls) => {
      let tempLS = JSON.parse(ls)
      secondUserName = tempLS.accounts.details.name
    })
  })

  it('Chat - Search - Load account for testing', () => {
    // Login with User A by restoring LocalStorage Snapshot
    cy.loginWithLocalStorage('Chat User A')

    // Validate message is sent
    cy.goToConversation(secondUserName)
  })

  it('Chat - Search - Pretest - Send messages needed for further testing', () => {
    // Send 25 times a message to validate navigation through search results
    for (let i = 0; i < 25; i++) {
      // Validate message is sent
      cy.chatFeaturesSendMessage(randomMessageTwo)
    }
    // Send 5 times a message to validate navigation through search results
    for (let i = 0; i < 5; i++) {
      // Validate message is sent
      cy.chatFeaturesSendMessage(randomMessageThree)
    }
  })

  it('Chat - Search - Send message on chat', () => {
    // Validate message is sent
    cy.chatFeaturesSendMessage(randomMessageOne)
  })

  it('Chat - Search - Text message - Exact match', () => {
    //Get text from last chat-message and look for it in search bar
    cy.get('[data-cy=chat-message]')
      .contains(randomMessageOne)
      .last()
      .invoke('text')
      .then(($message) => {
        cy.searchFromTextInChat($message)
      })

    //Assert results and close search modal
    cy.assertFirstMatchOnSearch(randomMessageOne)
    cy.get('[data-cy=chat-search-result]').find('.close-button').click()
  })

  it('Chat - Search - Send emoji on chat', () => {
    cy.chatFeaturesSendEmoji('[title="smile"]', '😄')
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
    cy.searchFromTextInChat(randomMessageTwo)
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

  it('Chat - Search Results - Navigate through results ordered by Relevant', () => {
    //Click on Sort By Relevant
    cy.get('.orderby-item').contains('Relevant').click()

    //Navigate through all results sorted by Relevant
    cy.navigateThroughSearchResults()

    //Finally close search results modal
    cy.get('[data-cy=chat-search-result]').find('.close-button').click()
  })

  it('Chat - Search - Results - Pagination is NOT displayed when 10 or less matches are found', () => {
    //Search for a random number and assert results
    cy.searchFromTextInChat(randomMessageThree)
    cy.assertFirstMatchOnSearch(randomMessageThree)

    //Validate that pagination is not displayed and close search modal
    cy.get('[data-cy=chat-search-result-pagination]').should('not.exist')
    cy.get('[data-cy=chat-search-result]').find('.close-button').click()
  })
})
