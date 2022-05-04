import { expect } from '@jest/globals'
import * as WebRTC from '~/store/webrtc/mutations'
import * as TracksManager from '~/libraries/WebRTC/TracksManager'
import * as Call from '~/libraries/WebRTC/Call'

describe('Mutate WebRTC by setting', () => {
  let inst: any
  const state: any = {
    initialized: true,
    incomingCall: '',
    activeCall: '',
    connectedPeers: [],
    streaming: true,
    activeStream: {
      createdAt: 123,
    },
    remoteTracks: {
      audio: {
        id: '',
        muted: true,
      },
      video: {
        id: '',
        muted: true,
      },
    },
    localTracks: {
      audio: {
        id: '',
        muted: true,
      },
      video: {
        id: '',
        muted: true,
      },
    },
  }

  beforeEach(() => {
    inst = WebRTC.default
  })

  it('should initialize', () => {
    const localStateForUnitTest = { ...state }
    inst.setInitialized(localStateForUnitTest, true)

    expect(localStateForUnitTest).toMatchObject({
      initialized: true,
    })
  })

  it('should set incoming call', () => {
    const localStateForUnitTest = { ...state }
    inst.setIncomingCall(localStateForUnitTest, '0x0')

    expect(localStateForUnitTest).toMatchObject({
      incomingCall: '0x0',
    })
  })

  it('should set active call', () => {
    const localStateForUnitTest = { ...state }
    inst.setActiveCall(localStateForUnitTest, '0x0')

    expect(localStateForUnitTest).toMatchObject({
      activeCall: '0x0',
    })
  })

  it('should set connected peers', () => {
    const localStateForUnitTest = { ...state }
    inst.setAllConnectedPeers(localStateForUnitTest, ['0x0', '0x1', '0x2'])

    expect(localStateForUnitTest).toMatchObject({
      connectedPeers: ['0x0', '0x1', '0x2'],
    })
  })

  it.skip('should set peer call', () => {
    // Skipped due to the bug explained in the comment below.
    const localStateForUnitTest = { ...state }
    const tmState: any = {
      // Abbreviation for TrackManager's State
      contentHint: 'contentHint',
      enabled: true,
      id: 'track1',
      kind: 'kind',
      label: 'label',
      muted: true,
    }

    const TracksManagerConstructor = TracksManager.TracksManager
    const tmInst = new TracksManagerConstructor()
    const localTmStateForUnitTest = { ...tmState }

    tmInst.addTrack(localTmStateForUnitTest)

    expect(tmInst.tracks[localTmStateForUnitTest.id]).toMatchObject(
      localTmStateForUnitTest,
    )

    // const CallConstructor = Call.Call
    // const callInst = new CallConstructor('1x1')
    // insert mutation function (setPeerCall) here later, after bug above is fixed
  })
})

describe('Mutate WebRTC by updating', () => {
  let inst: any
  const state: any = {
    initialized: true,
    incomingCall: '',
    activeCall: '',
    connectedPeers: [],
    streaming: true,
    activeStream: {
      createdAt: 123,
    },
    remoteTracks: {
      audio: {
        id: '',
        muted: true,
      },
      video: {
        id: '',
        muted: true,
      },
    },
    localTracks: {
      audio: {
        id: '',
        muted: true,
      },
      video: {
        id: '',
        muted: true,
      },
    },
  }

  beforeEach(() => {
    inst = WebRTC.default
  })

  it('should update local tracks with audio', () => {
    const localStateForUnitTest = { ...state }
    inst.updateLocalTracks(localStateForUnitTest, {
      audio: {
        id: '',
        muted: false,
      },
    })

    expect(localStateForUnitTest).toMatchObject({
      localTracks: {
        audio: {
          id: '',
          muted: false,
        },
      },
    })
  })

  it('should update local tracks with video', () => {
    const localStateForUnitTest = { ...state }
    inst.updateLocalTracks(localStateForUnitTest, {
      video: {
        id: '',
        muted: false,
      },
    })

    expect(localStateForUnitTest).toMatchObject({
      localTracks: {
        video: {
          id: '',
          muted: false,
        },
      },
    })
  })

  it('should update remote tracks with audio', () => {
    const localStateForUnitTest = { ...state }
    inst.updateRemoteTracks(localStateForUnitTest, {
      audio: {
        id: '',
        muted: false,
      },
    })

    expect(localStateForUnitTest).toMatchObject({
      remoteTracks: {
        audio: {
          id: '',
          muted: false,
        },
      },
    })
  })

  it('should update remote tracks with video', () => {
    const localStateForUnitTest = { ...state }
    inst.updateRemoteTracks(localStateForUnitTest, {
      video: {
        id: '',
        muted: false,
      },
    })

    expect(localStateForUnitTest).toMatchObject({
      remoteTracks: {
        video: {
          id: '',
          muted: false,
        },
      },
    })
  })

  it('should update time of creation', () => {
    const localStateForUnitTest = { ...state }
    const dummyDate = Date.now()
    inst.updateCreatedAt(localStateForUnitTest, dummyDate)

    expect(localStateForUnitTest).toMatchObject({
      activeStream: {
        createdAt: dummyDate,
      },
    })
  })

  it('should add connected peer', () => {
    const localStateForUnitTest = { ...state }
    const argument = '0x3'
    inst.addConnectedPeer(localStateForUnitTest, argument)

    expect(localStateForUnitTest.connectedPeers).toContain(argument)
  })

  it('should remove connected peer', () => {
    const localStateForUnitTest = { ...state }
    const argument = '0x3'

    inst.addConnectedPeer(localStateForUnitTest, argument)
    expect(localStateForUnitTest.connectedPeers).toContain(argument)

    // Add a peer first, and then we remove it.
    // Reason we are doing this is because if we only remove in this unit test (the `it` block)
    // The array will only be [], Hence the filter part in the mutations.ts file will not be covered.

    inst.removeConnectedPeer(localStateForUnitTest, argument)

    expect(localStateForUnitTest.connectedPeers).not.toContain(argument)
    expect(localStateForUnitTest.connectedPeers).toEqual([])
    expect(localStateForUnitTest).toMatchObject({
      connectedPeers: [],
    })
  })
})
