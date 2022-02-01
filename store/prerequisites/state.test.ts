import { expect } from '@jest/globals'
import * as state from '~/store/prerequisites/state'

describe('state.default', () => {
  test('0', () => {
    const result: any = state.default()
    expect(result).toMatchSnapshot()
  })
})
