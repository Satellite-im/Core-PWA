import { ChatError } from './types'

describe('', () => {
  test('check ChatError export type', () => {
    expect(ChatError).toEqual({
      CONVERSATION_EXISTS: 'errors.chat.conversation_exists',
      CONVERSATION_NOT_FOUND: 'errors.chat.conversation_not_found',
      MESSAGE_NOT_FOUND: 'errors.chat.message_not_found',
      MESSAGE_NOT_SENT: 'errors.chat.message_not_sent',
    })
  })
})
