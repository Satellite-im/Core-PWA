import { expect } from '@jest/globals'
import InitialGroupsState from '~/store/groups/state'

describe('init', () => {
  let inst: any

  beforeEach(() => {
    inst = InitialGroupsState()
  })

  it('should return the initial settings state', () => {
    expect(inst).toMatchSnapshot()
  })

  it('should not return the initial settings state', () => {
    expect(inst).not.toEqual({})
  })
})
