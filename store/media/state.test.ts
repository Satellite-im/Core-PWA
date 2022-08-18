import { expect } from '@jest/globals'
import InitialMediaState from '~/store/media/state'

describe('init', () => {
  let inst: any

  beforeEach(() => {
    inst = InitialMediaState()
  })

  it('should return the initial media state', () => {
    expect(inst).toMatchSnapshot()
  })

  it('should not return the initial media state', () => {
    expect(inst).not.toEqual({})
  })
})
