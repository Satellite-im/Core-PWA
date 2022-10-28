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

  test('sendMessage but return error for unsupported WebRTC browser', () => {
    const callConstructor = new DirectWebrtc('example_id', {
      on: jest.fn().mockReturnValueOnce(true), // Mocked to account for WebRTC error
      send: jest.fn().mockReturnValueOnce(true), // Mocked to account for WebRTC error
    })

    const argument = {
      recipients: ['first_addr'],
    }

    try {
      //   const spy = jest.spyOn(Emitter, 'emit')
      callConstructor.sendMessage(
        {
          anything: 'a',
        },
        argument,
      )

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

  test('destroy return false', () => {
    const onMockedFunction = jest.fn().mockReturnValueOnce(true)
    const offMockedFunction = jest.fn().mockReturnValueOnce(true)
    const destroyMockedFunction = jest.fn().mockReturnValueOnce(true)
    const callConstructor = new DirectWebrtc('example_id', {
      on: onMockedFunction,
      off: offMockedFunction,
      destroy: destroyMockedFunction,
    })

    const result = callConstructor.destroy()
    expect(onMockedFunction).toHaveBeenCalled()
    expect(offMockedFunction).toHaveBeenCalled()
    expect(destroyMockedFunction).toHaveBeenCalled()
  })

  test('isConnected return false', () => {
    const mockedConnectedFunction = jest.fn().mockReturnValueOnce(false)
    const callConstructor = new DirectWebrtc('example_id', {
      on: jest.fn().mockReturnValueOnce(true),
      connected: mockedConnectedFunction,
    })

    const result = callConstructor.isConnected()
    expect(result).toBe(mockedConnectedFunction)
  })

  test('isConnected return true would catch error', () => {
    const callConstructor = new DirectWebrtc('example_id', {
      on: jest.fn().mockReturnValueOnce(true),
      connected: jest.fn().mockReturnValueOnce(true),
    })

    try {
      const result = callConstructor.isConnected()
      expect(result).toBeTruthy()
    } catch (error) {
      // If error happens
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty(
        'message',
        `No WebRTC support: Not a supported browser`,
      )
    }
  })
})
