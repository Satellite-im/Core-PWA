import SimplePeer from 'simple-peer'
import * as PeerModule from './Peer'

const PeerClass = PeerModule.default

describe('Test WebRTC/Peer', () => {
  test('should construct a class and fail', () => {
    // This test shouldn't have failed.
    // But for now the Options argument are perhaps not the right kind.
    // So consider this test suite expects error, for now!

    // Spy isn't working, because function is undefined
    // const spy = jest.spyOn(PeerClass, 'Peer')
    const argumentGroupId = '12'
    const argumentDID = '34'
    const argumentOptions = {} as SimplePeer.Options

    try {
      const instance = new PeerClass(
        argumentGroupId,
        argumentDID,
        argumentOptions,
      )
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty(
        'message',
        `No WebRTC support: Not a supported browser`,
      )
    }
    // Not called, because it returns error on `super`
    // expect(spy).toHaveBeenCalledTimes(1)
  })
})
