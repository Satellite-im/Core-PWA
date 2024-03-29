import { UsersError } from './types'

describe('Iridium/users types', () => {
  test('check UsersError export type', () => {
    expect(UsersError).toEqual({
      NETWORK_ERROR: 'errors.users.network',
      USER_NOT_FOUND: 'errors.users.not_found',
    })
  })
})
