import { expect } from '@jest/globals'
import * as state from '~/store/settings/state'

describe('state.default', () => {
  test('0', () => {
    const result: any = state.default()
    expect(result).toMatchSnapshot()
  })
})
