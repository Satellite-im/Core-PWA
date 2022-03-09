import * as Servers from '../servers'

describe('init', () => {
  it('gets the ServerInfo constant', () => {
    expect(Servers.ServerInfo).toMatchSnapshot()
  })
  it('gets the Servers constant', () => {
    expect(Servers.Servers).toMatchSnapshot()
  })
  it('gets the Unreads constant', () => {
    expect(Servers.Unreads).toMatchSnapshot()
  })
})
