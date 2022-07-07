import * as Libp2p from '~/libraries/WebRTC/Libp2p'

describe('Libp2p.Peer2Peer.getInstance', () => {
  test('0', () => {
    const result: any = Libp2p.Peer2Peer.getInstance()
    expect(result).toMatchSnapshot()
  })
})
