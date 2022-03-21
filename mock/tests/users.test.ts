import * as Users from '../users'

describe('init', () => {
  it('gets the CallUsers constant', () => {
    expect(Users.CallUsers).toMatchSnapshot()
  })
  it('gets the User constant', () => {
    expect(Users.User).toMatchSnapshot()
  })
  it('gets the Users constant', () => {
    expect(Users.Users).toMatchSnapshot()
  })
})
