const faker = require('faker')
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
const randomNumber = faker.datatype.number() // generate random number
const randomMessage = faker.lorem.sentence() // generate random sentence
const recoverySeed =
  'boring over tilt regret diamond rubber example there fire roof sheriff always{enter}'

describe('Chat Features Tests', () => {
  it('Chat - Send stuff on chat', () => {
    //Import account
    cy.importAccount(randomPIN, recoverySeed)

    //Validate profile name displayed
    cy.chatFeaturesProfileName('sadad')

    // Click on hamburger menu if width < height
    cy.get('.toggle-sidebar').should('be.visible').click()

    //Validate message and emojis are sent
    cy.chatFeaturesSendMessage(randomMessage)
    cy.chatFeaturesSendEmoji('[title="smile"]', '😄')

    //Validate message can be edited
    cy.chatFeaturesEditMessage(randomMessage, randomNumber)
  })

  it('Chat - Verify when clicking on Send Money, coming soon appears', () => {
    //Hover over on Send Money and Coming Soon tooltip will appear when clicking on its button
    cy.get('#chatbar-controls > span > .tooltip-container')
      .realHover()
      .should('have.attr', 'data-tooltip', 'Send Money\nComing Soon')
    cy.get('body').realHover({ position: 'topLeft' })
  })

  it('Chat - Verify when clicking on Emoji, the emoji picker appears', () => {
    //Emoji picker is displayed  when clicking on its button
    cy.get('#emoji-toggle').click()
    cy.get('.navbar > .button-group > .active > #custom-cursor-area').should(
      'contain',
      'Emoji',
    )
    cy.get('#emoji-toggle').click()
  })

  it('Chat - Verify when clicking on Glyphs, the glyphs picker appears', () => {
    //Glyphs picker is displayed when clicking on its button
    cy.get('#glyph-toggle').click()
    cy.get('.pack-list > .is-text').should('contain', 'Try using some glyphs')
    cy.get('#glyph-toggle').click()
  })
})
