import { expect } from '@jest/globals'
import * as actions from '~/store/media/actions'

describe('actions.default.handler', () => {
  test('0', () => {
    const result: any = actions.default.handler()
    expect(result).toMatchSnapshot()
  })
})
