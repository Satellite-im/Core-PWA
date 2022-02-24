import * as Messages from '../messages'

describe('init', () => {
  it('gets the Messages constant', () => {
    expect(Messages.Messages).toMatchSnapshot()
  })
  it('gets the PinnedMessages constant', () => {
    expect(Messages.PinnedMessages).toMatchSnapshot()
  })
})
