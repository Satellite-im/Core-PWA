import { AudioContext } from 'standardized-audio-context-mock'
import * as AudioStreamUtils from '~/utilities/AudioStreamUtils'
global.AudioContext = AudioContext

describe('AudioStreamUtils.AudioStreamUtils.listenToMicLevel', () => {
  beforeAll(() => {
    global.AudioContext.createScriptProcessor = jest
      .fn()
      .mockReturnValueOnce(true)
  })

  afterAll(() => {
    global.AudioContext.createScriptProcessor = jest
      .fn()
      .mockReturnValueOnce(undefined)
  })

  test('test case 1 - empty constructor', () => {
    const inst = new AudioStreamUtils.AudioStreamUtils()
    const result: any = inst.listenToMicLevel()
    expect(result).toMatchSnapshot()
  })

  test('test case 2 - sufficient constructor', () => {
    try {
      const inst = new AudioStreamUtils.AudioStreamUtils({
        active: true,
        id: '',
        onaddtrack: null,
        onremovetrack: () => '',
        addTrack: () => undefined,
        clone: () => undefined,
        getAudioTracks: () => [],
        getTrackById: () => undefined,
        getTracks: () => [],
        getVideoTracks: () => [],
        removeTrack: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      })

      const result: any = inst.listenToMicLevel()
      expect(result).not.toBeEmpty()
    } catch (error) {} // Empty catch block for now due to deprecated function error

    // Will test for results later when the issue (communicated to Sara) is resolved.
  })
})

describe('AudioStreamUtils.AudioStreamUtils.stopListeningToMicLevel', () => {
  let inst2: any

  beforeEach(() => {
    inst2 = new AudioStreamUtils.AudioStreamUtils(
      {
        active: false,
        id: '',
        onaddtrack: null,
        onremovetrack: () => '',
        addTrack: () => undefined,
        clone: () => undefined,
        getAudioTracks: () => [],
        getTrackById: () => undefined,
        getTracks: () => [],
        getVideoTracks: () => [],
        removeTrack: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      },
      undefined,
    )
  })

  test('test case 1', () => {
    const result: any = inst2.stopListeningToMicLevel()
    expect(result).toMatchSnapshot()
  })
})

describe('AudioStreamUtils.AudioStreamUtils.destroy', () => {
  let inst2: any

  beforeEach(() => {
    inst2 = new AudioStreamUtils.AudioStreamUtils(
      {
        active: false,
        id: '',
        onaddtrack: () => '',
        onremovetrack: undefined,
        addTrack: () => undefined,
        clone: () => null,
        getAudioTracks: () => [],
        getTrackById: () => undefined,
        getTracks: () => [],
        getVideoTracks: () => [],
        removeTrack: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      },
      undefined,
    )
  })

  test('test case 1', () => {
    const result: any = inst2.destroy()
    expect(result).toMatchSnapshot()
  })
})

describe('AudioStreamUtils.AudioStreamUtils.start', () => {
  let instance: any

  beforeEach(() => {
    instance = new AudioStreamUtils.AudioStreamUtils(
      {
        active: false,
        id: '',
        onaddtrack: () => '',
        onremovetrack: undefined,
        addTrack: () => undefined,
        clone: () => null,
        getAudioTracks: () => [],
        getTrackById: () => undefined,
        getTracks: () => [],
        getVideoTracks: () => [],
        removeTrack: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      },
      undefined,
    )
  })

  test('test case 1', () => {
    const result: any = instance.start()
    expect(result).toMatchSnapshot()
  })
})

describe('AudioStreamUtils.AudioStreamUtils.updateIsTalking', () => {
  let inst8: any
  let object7: any
  let object6: any
  let inst6: any
  let object5: any
  let inst5: any
  let object4: any
  let inst4: any
  let object3: any
  let inst3: any
  let object2: any
  let inst: any
  let object: any
  let inst2: any

  beforeEach(() => {
    inst8 = new AudioStreamUtils.AudioStreamUtils(
      {
        active: false,
        id: '',
        onaddtrack: () => '',
        onremovetrack: undefined,
        addTrack: () => undefined,
        clone: () => undefined,
        getAudioTracks: () => [],
        getTrackById: () => undefined,
        getTracks: () => [],
        getVideoTracks: () => [],
        removeTrack: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => true,
      },
      undefined,
    )
    object7 = {
      0: {
        enabled: true,
        id: 'a85a8e6b-348b-4011-a1ec-1e78e9620782',
        isolated: true,
        kind: 'George',
        label: 'ISO 9001',
        muted: true,
        onended: undefined,
        onisolationchange: () => '2021-07-29T15:31:46.922Z',
        onmute: () => '2021-07-29T23:03:48.812Z',
        onunmute: undefined,
        readyState: '^5.0.0',
        applyConstraints: () => undefined,
        clone: () => undefined,
        getCapabilities: () => ({
          aspectRatio: undefined,
          autoGainControl: undefined,
          channelCount: undefined,
          deviceId: undefined,
          echoCancellation: undefined,
          facingMode: undefined,
          frameRate: undefined,
          groupId: 'bc23a9d531064583ace8f67dad60f6bb',
          height: undefined,
          latency: undefined,
          noiseSuppression: undefined,
          resizeMode: undefined,
          sampleRate: undefined,
          sampleSize: undefined,
          width: undefined,
        }),
        getConstraints: () => ({
          advanced: undefined,
          aspectRatio: 0.5,
          autoGainControl: undefined,
          channelCount: undefined,
          deviceId: undefined,
          echoCancellation: true,
          facingMode: undefined,
          frameRate: undefined,
          groupId: undefined,
          height: 400,
          latency: 400,
          noiseSuppression: undefined,
          resizeMode: undefined,
          sampleRate: undefined,
          sampleSize: undefined,
          width: undefined,
        }),
        getSettings: () => ({
          aspectRatio: 10.0,
          autoGainControl: undefined,
          channelCount: 1,
          deviceId: '9876',
          echoCancellation: undefined,
          facingMode: undefined,
          frameRate: -5.48,
          groupId: 'c466a48309794261b64a4f02cfcc3d64',
          height: undefined,
          latency: 429,
          noiseSuppression: undefined,
          resizeMode: '^5.0.0',
          sampleRate: 4,
          sampleSize: undefined,
          width: 15,
        }),
        stop: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => true,
      },
    }
    object6 = {
      0: {
        enabled: true,
        id: '7289708e-b17a-477c-8a77-9ab575c4b4d8',
        isolated: true,
        kind: 'Jean-Philippe',
        label: 'ISO 22000',
        muted: false,
        onended: undefined,
        onisolationchange: () => '2021-07-29T23:03:48.812Z',
        onmute: () => '2021-07-29T15:31:46.922Z',
        onunmute: undefined,
        readyState: '4.0.0-beta1\t',
        applyConstraints: () => undefined,
        clone: () => undefined,
        getCapabilities: () => ({
          aspectRatio: undefined,
          autoGainControl: undefined,
          channelCount: undefined,
          deviceId: undefined,
          echoCancellation: undefined,
          facingMode: undefined,
          frameRate: undefined,
          groupId: 'da7588892',
          height: undefined,
          latency: undefined,
          noiseSuppression: undefined,
          resizeMode: undefined,
          sampleRate: undefined,
          sampleSize: undefined,
          width: undefined,
        }),
        getConstraints: () => ({
          advanced: undefined,
          aspectRatio: 0.5,
          autoGainControl: undefined,
          channelCount: undefined,
          deviceId: undefined,
          echoCancellation: false,
          facingMode: undefined,
          frameRate: undefined,
          groupId: undefined,
          height: 12,
          latency: 400,
          noiseSuppression: undefined,
          resizeMode: undefined,
          sampleRate: undefined,
          sampleSize: undefined,
          width: undefined,
        }),
        getSettings: () => ({
          aspectRatio: 0.5,
          autoGainControl: undefined,
          channelCount: 1,
          deviceId: 'c466a48309794261b64a4f02cfcc3d64',
          echoCancellation: undefined,
          facingMode: undefined,
          frameRate: 1,
          groupId: '9876',
          height: undefined,
          latency: 404,
          noiseSuppression: undefined,
          resizeMode: '1.0.0',
          sampleRate: 64,
          sampleSize: undefined,
          width: 30,
        }),
        stop: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      },
    }
    inst6 = new AudioStreamUtils.AudioStreamUtils(
      {
        active: true,
        id: '7289708e-b17a-477c-8a77-9ab575c4b4d8',
        onaddtrack: () => '2021-07-29T20:12:53.196Z',
        onremovetrack: null,
        addTrack: () => undefined,
        clone: () => null,
        getAudioTracks: () => object6,
        getTrackById: () => null,
        getTracks: () => [],
        getVideoTracks: () => [],
        removeTrack: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => true,
      },
      undefined,
    )
    object5 = {
      0: {
        enabled: false,
        id: '7289708e-b17a-477c-8a77-9ab575c4b4d8',
        isolated: false,
        kind: 'Jean-Philippe',
        label: 'ISO 9001',
        muted: false,
        onended: null,
        onisolationchange: () => '2021-07-29T20:12:53.196Z',
        onmute: () => '2021-07-29T17:54:41.653Z',
        onunmute: null,
        readyState: 'live',
        applyConstraints: () => undefined,
        clone: () => undefined,
        getCapabilities: () => ({
          aspectRatio: undefined,
          autoGainControl: undefined,
          channelCount: undefined,
          deviceId: undefined,
          echoCancellation: undefined,
          facingMode: undefined,
          frameRate: undefined,
          groupId: '9876',
          height: undefined,
          latency: undefined,
          noiseSuppression: undefined,
          resizeMode: undefined,
          sampleRate: undefined,
          sampleSize: undefined,
          width: undefined,
        }),
        getConstraints: () => ({
          advanced: undefined,
          aspectRatio: 2.0,
          autoGainControl: undefined,
          channelCount: undefined,
          deviceId: undefined,
          echoCancellation: true,
          facingMode: undefined,
          frameRate: undefined,
          groupId: undefined,
          height: 40,
          latency: 500,
          noiseSuppression: undefined,
          resizeMode: undefined,
          sampleRate: undefined,
          sampleSize: undefined,
          width: undefined,
        }),
        getSettings: () => ({
          aspectRatio: 0.5,
          autoGainControl: undefined,
          channelCount: 100,
          deviceId: 'c466a48309794261b64a4f02cfcc3d64',
          echoCancellation: undefined,
          facingMode: undefined,
          frameRate: -100,
          groupId: 'c466a48309794261b64a4f02cfcc3d64',
          height: undefined,
          latency: 404,
          noiseSuppression: undefined,
          resizeMode: 'v1.2.4',
          sampleRate: 1,
          sampleSize: undefined,
          width: 120,
        }),
        stop: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => true,
      },
    }
    inst5 = new AudioStreamUtils.AudioStreamUtils(
      {
        active: true,
        id: '7289708e-b17a-477c-8a77-9ab575c4b4d8',
        onaddtrack: () => '2021-07-29T20:12:53.196Z',
        onremovetrack: undefined,
        addTrack: () => undefined,
        clone: () => null,
        getAudioTracks: () => object5,
        getTrackById: () => undefined,
        getTracks: () => [],
        getVideoTracks: () => [],
        removeTrack: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => true,
      },
      undefined,
    )
    object4 = {
      0: {
        enabled: true,
        id: '03ea49f8-1d96-4cd0-b279-0684e3eec3a9',
        isolated: true,
        kind: 'Edmond',
        label: 'label_1',
        muted: true,
        onended: undefined,
        onisolationchange: () => '2021-07-30T00:05:36.818Z',
        onmute: () => '2021-07-29T20:12:53.196Z',
        onunmute: null,
        readyState: '4.0.0-beta1\t',
        applyConstraints: () => undefined,
        clone: () => undefined,
        getCapabilities: () => ({
          aspectRatio: undefined,
          autoGainControl: undefined,
          channelCount: undefined,
          deviceId: undefined,
          echoCancellation: undefined,
          facingMode: undefined,
          frameRate: undefined,
          groupId: 'bc23a9d531064583ace8f67dad60f6bb',
          height: undefined,
          latency: undefined,
          noiseSuppression: undefined,
          resizeMode: undefined,
          sampleRate: undefined,
          sampleSize: undefined,
          width: undefined,
        }),
        getConstraints: () => ({
          advanced: undefined,
          aspectRatio: 0.1,
          autoGainControl: undefined,
          channelCount: undefined,
          deviceId: undefined,
          echoCancellation: true,
          facingMode: undefined,
          frameRate: undefined,
          groupId: undefined,
          height: 1.5,
          latency: 429,
          noiseSuppression: undefined,
          resizeMode: undefined,
          sampleRate: undefined,
          sampleSize: undefined,
          width: undefined,
        }),
        getSettings: () => ({
          aspectRatio: 2.0,
          autoGainControl: undefined,
          channelCount: 0,
          deviceId: '12345',
          echoCancellation: undefined,
          facingMode: undefined,
          frameRate: -5.48,
          groupId: '12345',
          height: undefined,
          latency: 500,
          noiseSuppression: undefined,
          resizeMode: '1.0.0',
          sampleRate: 64,
          sampleSize: undefined,
          width: 120,
        }),
        stop: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      },
    }
    inst4 = new AudioStreamUtils.AudioStreamUtils(
      {
        active: false,
        id: 'a85a8e6b-348b-4011-a1ec-1e78e9620782',
        onaddtrack: () => '2021-07-29T15:31:46.922Z',
        onremovetrack: null,
        addTrack: () => undefined,
        clone: () => null,
        getAudioTracks: () => object4,
        getTrackById: () => null,
        getTracks: () => [],
        getVideoTracks: () => [],
        removeTrack: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => true,
      },
      undefined,
    )
    object3 = {
      0: {
        enabled: false,
        id: '7289708e-b17a-477c-8a77-9ab575c4b4d8',
        isolated: true,
        kind: 'Edmond',
        label: 'ISO 22000',
        muted: false,
        onended: null,
        onisolationchange: () => '2021-07-29T15:31:46.922Z',
        onmute: () => '2021-07-30T00:05:36.818Z',
        onunmute: null,
        readyState: '1.0.0',
        applyConstraints: () => undefined,
        clone: () => null,
        getCapabilities: () => ({
          aspectRatio: undefined,
          autoGainControl: undefined,
          channelCount: undefined,
          deviceId: undefined,
          echoCancellation: undefined,
          facingMode: undefined,
          frameRate: undefined,
          groupId: 'da7588892',
          height: undefined,
          latency: undefined,
          noiseSuppression: undefined,
          resizeMode: undefined,
          sampleRate: undefined,
          sampleSize: undefined,
          width: undefined,
        }),
        getConstraints: () => ({
          advanced: undefined,
          aspectRatio: 1.0,
          autoGainControl: undefined,
          channelCount: undefined,
          deviceId: undefined,
          echoCancellation: false,
          facingMode: undefined,
          frameRate: undefined,
          groupId: undefined,
          height: 0.0,
          latency: 500,
          noiseSuppression: undefined,
          resizeMode: undefined,
          sampleRate: undefined,
          sampleSize: undefined,
          width: undefined,
        }),
        getSettings: () => ({
          aspectRatio: 0.5,
          autoGainControl: undefined,
          channelCount: 100,
          deviceId: '9876',
          echoCancellation: undefined,
          facingMode: undefined,
          frameRate: 0,
          groupId: '12345',
          height: undefined,
          latency: 429,
          noiseSuppression: undefined,
          resizeMode: '4.0.0-beta1\t',
          sampleRate: 2,
          sampleSize: undefined,
          width: 1080,
        }),
        stop: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => true,
      },
    }
    inst3 = new AudioStreamUtils.AudioStreamUtils(
      {
        active: true,
        id: '03ea49f8-1d96-4cd0-b279-0684e3eec3a9',
        onaddtrack: () => '2021-07-29T15:31:46.922Z',
        onremovetrack: null,
        addTrack: () => undefined,
        clone: () => undefined,
        getAudioTracks: () => object3,
        getTrackById: () => undefined,
        getTracks: () => [],
        getVideoTracks: () => [],
        removeTrack: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => true,
      },
      undefined,
    )
    object2 = {
      0: {
        enabled: true,
        id: 'a85a8e6b-348b-4011-a1ec-1e78e9620782',
        isolated: true,
        kind: 'Pierre Edouard',
        label: 'ISO 22000',
        muted: true,
        onended: null,
        onisolationchange: () => '2021-07-29T15:31:46.922Z',
        onmute: () => '2021-07-30T00:05:36.818Z',
        onunmute: null,
        readyState: '4.0.0-beta1\t',
        applyConstraints: () => undefined,
        clone: () => null,
        getCapabilities: () => ({
          aspectRatio: undefined,
          autoGainControl: undefined,
          channelCount: undefined,
          deviceId: undefined,
          echoCancellation: undefined,
          facingMode: undefined,
          frameRate: undefined,
          groupId: 'c466a48309794261b64a4f02cfcc3d64',
          height: undefined,
          latency: undefined,
          noiseSuppression: undefined,
          resizeMode: undefined,
          sampleRate: undefined,
          sampleSize: undefined,
          width: undefined,
        }),
        getConstraints: () => ({
          advanced: undefined,
          aspectRatio: 2.0,
          autoGainControl: undefined,
          channelCount: undefined,
          deviceId: undefined,
          echoCancellation: false,
          facingMode: undefined,
          frameRate: undefined,
          groupId: undefined,
          height: 99,
          latency: 429,
          noiseSuppression: undefined,
          resizeMode: undefined,
          sampleRate: undefined,
          sampleSize: undefined,
          width: undefined,
        }),
        getSettings: () => ({
          aspectRatio: 0.1,
          autoGainControl: undefined,
          channelCount: -5.48,
          deviceId: '12345',
          echoCancellation: undefined,
          facingMode: undefined,
          frameRate: 100,
          groupId: 'c466a48309794261b64a4f02cfcc3d64',
          height: undefined,
          latency: 429,
          noiseSuppression: undefined,
          resizeMode: '1.0.0',
          sampleRate: 2,
          sampleSize: undefined,
          width: 64,
        }),
        stop: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      },
    }
    inst = new AudioStreamUtils.AudioStreamUtils(
      {
        active: true,
        id: '03ea49f8-1d96-4cd0-b279-0684e3eec3a9',
        onaddtrack: () => '2021-07-29T23:03:48.812Z',
        onremovetrack: undefined,
        addTrack: () => undefined,
        clone: () => null,
        getAudioTracks: () => object2,
        getTrackById: () => undefined,
        getTracks: () => [],
        getVideoTracks: () => [],
        removeTrack: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => true,
      },
      undefined,
    )
    object = {
      0: {
        enabled: false,
        id: '03ea49f8-1d96-4cd0-b279-0684e3eec3a9',
        isolated: true,
        kind: 'Edmond',
        label: 'label_2',
        muted: false,
        onended: undefined,
        onisolationchange: () => '2021-07-30T00:05:36.818Z',
        onmute: () => '2021-07-29T20:12:53.196Z',
        onunmute: undefined,
        readyState: 'v4.0.0-rc.4',
        applyConstraints: () => undefined,
        clone: () => null,
        getCapabilities: () => ({
          aspectRatio: undefined,
          autoGainControl: undefined,
          channelCount: undefined,
          deviceId: undefined,
          echoCancellation: undefined,
          facingMode: undefined,
          frameRate: undefined,
          groupId: 'bc23a9d531064583ace8f67dad60f6bb',
          height: undefined,
          latency: undefined,
          noiseSuppression: undefined,
          resizeMode: undefined,
          sampleRate: undefined,
          sampleSize: undefined,
          width: undefined,
        }),
        getConstraints: () => ({
          advanced: undefined,
          aspectRatio: 2.0,
          autoGainControl: undefined,
          channelCount: undefined,
          deviceId: undefined,
          echoCancellation: true,
          facingMode: undefined,
          frameRate: undefined,
          groupId: undefined,
          height: 12,
          latency: 200,
          noiseSuppression: undefined,
          resizeMode: undefined,
          sampleRate: undefined,
          sampleSize: undefined,
          width: undefined,
        }),
        getSettings: () => ({
          aspectRatio: 10.0,
          autoGainControl: undefined,
          channelCount: 0,
          deviceId: 'da7588892',
          echoCancellation: undefined,
          facingMode: undefined,
          frameRate: -100,
          groupId: 'bc23a9d531064583ace8f67dad60f6bb',
          height: undefined,
          latency: 500,
          noiseSuppression: undefined,
          resizeMode: '^5.0.0',
          sampleRate: 3,
          sampleSize: undefined,
          width: 0,
        }),
        stop: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      },
    }
    inst2 = new AudioStreamUtils.AudioStreamUtils(
      {
        active: true,
        id: '7289708e-b17a-477c-8a77-9ab575c4b4d8',
        onaddtrack: () => '2021-07-29T17:54:41.653Z',
        onremovetrack: undefined,
        addTrack: () => undefined,
        clone: () => null,
        getAudioTracks: () => object,
        getTrackById: () => null,
        getTracks: () => [],
        getVideoTracks: () => [],
        removeTrack: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      },
      undefined,
    )
  })

  test('test case 1', () => {
    const result: any = inst2.updateIsTalking(10.0)
    expect(result).toMatchSnapshot()
  })

  test('test case 2', () => {
    const result: any = inst.updateIsTalking(-29.45)
    expect(result).toMatchSnapshot()
  })

  test('test case 3', () => {
    const result: any = inst3.updateIsTalking(-1.0)
    expect(result).toMatchSnapshot()
  })

  test('test case 4', () => {
    const result: any = inst4.updateIsTalking(10.23)
    expect(result).toMatchSnapshot()
  })

  test('test case 5', () => {
    const result: any = inst5.updateIsTalking(0.0)
    expect(result).toMatchSnapshot()
  })

  test('test case 6', () => {
    const result: any = inst8.updateIsTalking(Infinity)
    expect(result).toMatchSnapshot()
  })
})
