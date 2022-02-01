import { expect } from '@jest/globals'
import * as state from '~/store/audio/state'

describe('state.default', () => {
  test('0', () => {
    const result: any = state.default()
    expect(result).toMatchSnapshot()
  })
})
