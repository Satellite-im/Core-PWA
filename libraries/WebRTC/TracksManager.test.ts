import * as TracksManager from '~/libraries/WebRTC/TracksManager'
global.console.warn = jest.fn()

describe('Mutate Tracks Manager', () => {
  let inst: any
  const state: any = {
    contentHint: 'contentHint',
    enabled: true,
    id: 'track1',
    kind: 'kind',
    label: 'label',
    muted: true,
  }

  beforeEach(() => {
    const TracksManagerConstructor = TracksManager.TracksManager
    inst = new TracksManagerConstructor()
  })

  it('should add track', () => {
    const localStateForUnitTest = { ...state }

    inst.addTrack(localStateForUnitTest)

    expect(inst.tracks[localStateForUnitTest.id]).toMatchObject(
      localStateForUnitTest,
    )
  })

  it('should add duplicate rack and get warning ', () => {
    const localStateForUnitTest = { ...state }

    inst.addTrack(localStateForUnitTest)
    inst.addTrack(localStateForUnitTest) // Add twice to get a warning

    expect(console.warn).toBeCalledTimes(1)
    expect(console.warn).toBeCalledWith(
      `Track already exists ${localStateForUnitTest.id} ${localStateForUnitTest.kind}`,
      inst.tracks,
    )

    expect(inst.tracks[localStateForUnitTest.id]).toMatchObject(
      localStateForUnitTest,
    )
  })

  it('should add and get track', () => {
    const localStateForUnitTest = { ...state }

    inst.addTrack(localStateForUnitTest)
    const result: any = inst.getTrack(localStateForUnitTest.id)

    expect(result).toMatchObject(localStateForUnitTest)
  })

  it('should add, remove, and fail to get track', () => {
    const localStateForUnitTest = { ...state }

    inst.addTrack(localStateForUnitTest)
    inst.removeTrack(localStateForUnitTest.id)

    const result: any = inst.getTrack(localStateForUnitTest.id)

    expect(result).toBeUndefined()
  })

  it('should add 2 tracks, remove them both, and fail to get the tracks', () => {
    const firstLocalState = { ...state, id: 'track1' } // By default it is track1, but I figure I'd just write it here so its easier to read
    const secondLocalState = { ...state, id: 'track2' }

    inst.addTrack(firstLocalState)
    inst.addTrack(secondLocalState)
    inst.removeAllTracks(firstLocalState.id)

    const result1: any = inst.getTrack(firstLocalState.id)
    const result2: any = inst.getTrack(secondLocalState.id)

    expect(result1).toBeUndefined()
    expect(result2).toBeUndefined()
  })
})
