import * as Groups from '../groups'

describe('init', () => {
  it('gets the constant', () => {
    expect(Groups.Groups).toMatchSnapshot()
  })
})
