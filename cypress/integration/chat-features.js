const faker = require('faker')
const randomNumber = faker.datatype.number() // generate random number
const randomMessage = faker.lorem.sentence() // generate random sentence

it('Chat - Send stuff on chat', () => {
  cy.importAccount()

  //Validate profile name displayed
  cy.chatFeaturesProfileName('asdad')

  // Click on hamburger menu if width < height
  cy.get('.toggle-sidebar').should('be.visible').click()

  //Validate message and emojis are sent
  cy.chatFeaturesSendMessage(randomMessage)
  cy.chatFeaturesSendEmoji('[title="smile"]', '😄')

  //Validate message can be edited
  cy.chatFeaturesEditMessage(randomMessage, randomNumber)
})
