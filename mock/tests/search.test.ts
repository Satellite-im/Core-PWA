import { expect } from '@jest/globals'
import * as Search from '../search'

describe('init', () => {
  it('gets the searchRecommend constant', () => {
    expect(Search.searchRecommend).toMatchSnapshot()
  })
  it('gets the searchResult constant', () => {
    expect(Search.searchResult).toMatchSnapshot()
  })
})
