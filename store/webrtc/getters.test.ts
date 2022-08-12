import * as getters from '~/store/webrtc/getters'

describe('getters.default.isActiveCall', () => {
  test('0', () => {
    let param2: any = [
      [true, true, true, true],
      [true, false, false, true],
      [true, false, false, true],
      [false, false, false, true],
    ]
    let result: any = getters.default.isActiveCall(
      {
        activeCall: {
          peerId: 'bc23a9d531064583ace8f67dad60f6bb',
          id: '03ea49f8-1d96-4cd0-b279-0684e3eec3a9',
        },
      },
      param2,
      {
        conversation: {
          peerId: '9876',
          id: '7289708e-b17a-477c-8a77-9ab575c4b4d8',
        },
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    let param2: any = [
      [true, true, true, true],
      [false, false, false, true],
      [true, false, false, true],
      [false, true, false, true],
    ]
    let result: any = getters.default.isActiveCall(
      {
        activeCall: {
          peerId: '9876',
          id: 'a85a8e6b-348b-4011-a1ec-1e78e9620782',
        },
      },
      param2,
      {
        conversation: {
          peerId: 'bc23a9d531064583ace8f67dad60f6bb',
          id: '03ea49f8-1d96-4cd0-b279-0684e3eec3a9',
        },
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    let param2: any = [
      [false, true, false, true],
      [false, false, true, false],
      [false, true, false, false],
      [false, false, true, true],
    ]
    let result: any = getters.default.isActiveCall(
      {
        activeCall: {
          peerId: '9876',
          id: '03ea49f8-1d96-4cd0-b279-0684e3eec3a9',
        },
      },
      param2,
      {
        conversation: {
          peerId: '12345',
          id: '03ea49f8-1d96-4cd0-b279-0684e3eec3a9',
        },
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    let param2: any = [
      [true, false, true, false],
      [true, false, false, true],
      [true, true, false, false],
      [true, true, true, true],
    ]
    let result: any = getters.default.isActiveCall(
      {
        activeCall: {
          peerId: 'c466a48309794261b64a4f02cfcc3d64',
          id: 'a85a8e6b-348b-4011-a1ec-1e78e9620782',
        },
      },
      param2,
      {
        conversation: {
          peerId: '12345',
          id: '7289708e-b17a-477c-8a77-9ab575c4b4d8',
        },
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    let param2: any = [
      [true, false, true, true],
      [false, false, false, false],
      [true, false, false, true],
      [false, true, false, false],
    ]
    let result: any = getters.default.isActiveCall(
      {
        activeCall: {
          peerId: '12345',
          id: '03ea49f8-1d96-4cd0-b279-0684e3eec3a9',
        },
      },
      param2,
      {
        conversation: {
          peerId: 'bc23a9d531064583ace8f67dad60f6bb',
          id: 'a85a8e6b-348b-4011-a1ec-1e78e9620782',
        },
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    let result: any = getters.default.isActiveCall(
      { activeCall: { peerId: '', id: '' } },
      [],
      { conversation: { peerId: '', id: '' } },
    )
    expect(result).toMatchSnapshot()
  })
})

describe('getters.default.isBackgroundCall', () => {
  test('0', () => {
    let param2: any = [
      [true, true, true, true],
      [true, true, true, false],
      [true, true, false, true],
      [true, false, true, false],
    ]
    let result: any = getters.default.isBackgroundCall(
      {
        activeCall: {
          peerId: '12345',
          id: '7289708e-b17a-477c-8a77-9ab575c4b4d8',
        },
      },
      param2,
      {
        conversation: {
          peerId: 'bc23a9d531064583ace8f67dad60f6bb',
          id: '7289708e-b17a-477c-8a77-9ab575c4b4d8',
        },
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    let param2: any = [
      [false, false, true, true],
      [false, false, true, false],
      [true, false, false, false],
      [true, true, true, false],
    ]
    let result: any = getters.default.isBackgroundCall(
      {
        activeCall: {
          peerId: '9876',
          id: '03ea49f8-1d96-4cd0-b279-0684e3eec3a9',
        },
      },
      param2,
      {
        conversation: {
          peerId: 'c466a48309794261b64a4f02cfcc3d64',
          id: 'a85a8e6b-348b-4011-a1ec-1e78e9620782',
        },
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    let param2: any = [
      [false, true, false, true],
      [true, true, false, true],
      [false, false, false, false],
      [false, false, true, false],
    ]
    let result: any = getters.default.isBackgroundCall(
      {
        activeCall: {
          peerId: '9876',
          id: 'a85a8e6b-348b-4011-a1ec-1e78e9620782',
        },
      },
      param2,
      {
        conversation: {
          peerId: 'da7588892',
          id: '7289708e-b17a-477c-8a77-9ab575c4b4d8',
        },
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    let param2: any = [
      [false, false, true, false],
      [false, true, false, true],
      [false, false, true, false],
      [false, true, true, true],
    ]
    let result: any = getters.default.isBackgroundCall(
      {
        activeCall: {
          peerId: '12345',
          id: 'a85a8e6b-348b-4011-a1ec-1e78e9620782',
        },
      },
      param2,
      {
        conversation: {
          peerId: '12345',
          id: 'a85a8e6b-348b-4011-a1ec-1e78e9620782',
        },
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    let param2: any = [
      [true, true, false, false],
      [false, false, true, true],
      [false, true, true, false],
      [true, false, false, false],
    ]
    let result: any = getters.default.isBackgroundCall(
      {
        activeCall: {
          peerId: '12345',
          id: 'a85a8e6b-348b-4011-a1ec-1e78e9620782',
        },
      },
      param2,
      {
        conversation: {
          peerId: '12345',
          id: '03ea49f8-1d96-4cd0-b279-0684e3eec3a9',
        },
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    let result: any = getters.default.isBackgroundCall(
      { activeCall: { peerId: '', id: '' } },
      [],
      { conversation: { peerId: '', id: '' } },
    )
    expect(result).toMatchSnapshot()
  })
})
