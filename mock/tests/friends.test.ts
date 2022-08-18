import { expect } from '@jest/globals'
import { Friends } from '../friends'

describe('init', () => {
  it('gets the constant', () => {
    expect(Friends).toMatchSnapshot()
  })
})
