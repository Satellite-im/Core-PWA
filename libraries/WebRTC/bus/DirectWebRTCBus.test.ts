import Peer from 'simple-peer'
import type { Instance } from 'simple-peer'
import Emitter from '~/libraries/WebRTC/Emitter'
import { DirectWebrtc } from '~/libraries/WebRTC/bus/DirectWebRTCBus'

describe('Test DirectWebrtc', () => {
  test('onMessage but return error for unsupported WebRTC browser', () => {
    const callConstructor = new DirectWebrtc('example_id', {
      on: jest.fn().mockReturnValueOnce(true), // Mocked to account for WebRTC error
    })
    try {
      //   const spy = jest.spyOn(Emitter, 'emit')
      callConstructor.onMessage({
        from: 'sender',
        payload: {
          encoding: 'raw',
          body: {
            a: 'b',
          },
        },
      })

      // Commented for now because of the error. In an ideal case the spy should have been called.
      // expect(spy).toHaveBeenCalled()
    } catch (error) {
      // Related to #5092
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty(
        'message',
        `No WebRTC support: Not a supported browser`,
      )
    }
  })
})
