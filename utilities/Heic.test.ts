import { isHeic } from '~/utilities/Heic'

describe('check', () => {
  it('tests the isHeic function', () => {
    expect(isHeic).toMatchSnapshot()
  })
})
