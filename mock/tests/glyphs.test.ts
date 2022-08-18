import { expect } from '@jest/globals'
import { Glyphs } from '../glyphs'

describe('init', () => {
  it('gets the constant', () => {
    expect(Glyphs).toMatchSnapshot()
  })
})
