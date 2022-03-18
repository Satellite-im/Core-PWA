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

  describe('TracksManager.TracksManager.removeTrack', () => {
    let inst4: any
    let inst3: any
    let inst: any
    let inst2: any

    beforeEach(() => {
      inst4 = new TracksManager.TracksManager()
      inst3 = new TracksManager.TracksManager()
      inst = new TracksManager.TracksManager()
      inst2 = new TracksManager.TracksManager()
    })

    test('0', () => {
      const result: any = inst2.removeTrack(
        '03ea49f8-1d96-4cd0-b279-0684e3eec3a9',
      )
      expect(result).toMatchSnapshot()
    })

    test('1', () => {
      const result: any = inst.removeTrack(
        '7289708e-b17a-477c-8a77-9ab575c4b4d8',
      )
      expect(result).toMatchSnapshot()
    })

    test('2', () => {
      const result: any = inst3.removeTrack(
        'a85a8e6b-348b-4011-a1ec-1e78e9620782',
      )
      expect(result).toMatchSnapshot()
    })

    test('3', () => {
      const result: any = inst4.removeTrack('')
      expect(result).toMatchSnapshot()
    })
  })

  describe('TracksManager.TracksManager.getTrack', () => {
    let inst4: any
    let inst3: any
    let inst: any
    let inst2: any

    beforeEach(() => {
      inst4 = new TracksManager.TracksManager()
      inst3 = new TracksManager.TracksManager()
      inst = new TracksManager.TracksManager()
      inst2 = new TracksManager.TracksManager()
    })

    test('0', () => {
      const result: any = inst2.getTrack('a85a8e6b-348b-4011-a1ec-1e78e9620782')
      expect(result).toMatchSnapshot()
    })

    test('1', () => {
      const result: any = inst.getTrack('7289708e-b17a-477c-8a77-9ab575c4b4d8')
      expect(result).toMatchSnapshot()
    })

    test('2', () => {
      const result: any = inst3.getTrack('03ea49f8-1d96-4cd0-b279-0684e3eec3a9')
      expect(result).toMatchSnapshot()
    })

    test('3', () => {
      const result: any = inst4.getTrack('')
      expect(result).toMatchSnapshot()
    })
  })

  describe('TracksManager.TracksManager.removeAllTracks', () => {
    let inst2: any

    beforeEach(() => {
      inst2 = new TracksManager.TracksManager()
    })

    test('0', () => {
      const result: any = inst2.removeAllTracks()
      expect(result).toMatchSnapshot()
    })
  })
})
