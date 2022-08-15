import { IDL } from '~/libraries/Solana/GroupChatsProgram/GroupChatsProgram.types'
idl

test('check IDL export type', () => {
  expect(IDL).toEqual({
    NETWORK_ERROR: 'errors.friends.network',
    FRIEND_EXISTS: 'errors.friends.exists',
    FRIEND_NOT_FOUND: 'errors.friends.not_found',
    REQUEST_NOT_FOUND: 'errors.friends.request_not_found',
    REQUEST_NOT_SENT: 'errors.friends.request_not_sent',
    REQUEST_ALREADY_SENT: 'errors.friends.request_already_sent',
  })
})
