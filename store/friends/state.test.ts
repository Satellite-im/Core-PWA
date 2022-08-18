import { expect } from '@jest/globals'
import InitialFriendsState from '~/store/friends/state'

describe('init', () => {
  let inst: any

  beforeEach(() => {
    inst = InitialFriendsState()
  })

  it('should return the initial settings state', () => {
    expect(inst).toMatchSnapshot()
  })

  it('should not return the initial settings state', () => {
    expect(inst).not.toEqual({})
  })
})
