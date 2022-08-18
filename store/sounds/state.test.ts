import { expect } from '@jest/globals'
import InitialSettingsState from '~/store/sounds/state'

describe('init', () => {
  let inst: any

  beforeEach(() => {
    inst = InitialSettingsState()
  })

  it('should return the initial settings state', () => {
    expect(inst).toMatchSnapshot()
  })

  it('should not return the initial settings state', () => {
    expect(inst).not.toEqual({})
  })
})
