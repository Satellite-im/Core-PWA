import { MetaState } from './types'
import * as meta from '~/store/meta/mutations'

describe('', () => {
  let inst: any
  const state: MetaState = {
    title: 'empty title',
  }

  beforeEach(() => {
    inst = meta.default
  })

  it('should toggle media incoming call', () => {
    const localStateForUnitTest = { ...state }
    inst.setTitle(localStateForUnitTest, 'example title')

    expect(localStateForUnitTest).toMatchObject({
      title: 'example title',
    })
  })
})
