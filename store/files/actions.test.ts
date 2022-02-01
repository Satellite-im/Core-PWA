import { expect } from '@jest/globals'
import * as actions from '~/store/files/actions'

describe('actions.default.handler', () => {
  test('0', () => {
    const result: any = actions.default.handler()
    expect(result).toMatchSnapshot()
  })
})
