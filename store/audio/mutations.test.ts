import * as mutations from '~/store/audio/mutations'

describe('mutations.default.mute', () => {
  test('0', () => {
    const result: any = mutations.default.mute({
      previousVolume: -100,
      inputVolume: -1,
      muted: true,
      volume: 0,
      deafened: false,
      sounds: { inboundMedia: 0.0, outboundMedia: -29.45, system: 10.23 },
    })
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.default.mute({
      previousVolume: -1,
      inputVolume: 100,
      muted: true,
      volume: 1,
      deafened: false,
      sounds: { inboundMedia: -1.0, outboundMedia: -0.5, system: 10.23 },
    })
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.default.mute({
      previousVolume: 0,
      inputVolume: 1,
      muted: true,
      volume: -100,
      deafened: true,
      sounds: { inboundMedia: 0.0, outboundMedia: 0.0, system: 0.5 },
    })
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.default.mute({
      previousVolume: 1,
      inputVolume: -100,
      muted: true,
      volume: -100,
      deafened: false,
      sounds: { inboundMedia: -1.0, outboundMedia: 1.0, system: 1.0 },
    })
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.default.mute({
      previousVolume: -1,
      inputVolume: -1,
      muted: true,
      volume: 100,
      deafened: true,
      sounds: { inboundMedia: -29.45, outboundMedia: 0.0, system: 0.5 },
    })
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.default.mute({
      previousVolume: NaN,
      inputVolume: NaN,
      muted: false,
      volume: NaN,
      deafened: false,
      sounds: { inboundMedia: NaN, outboundMedia: NaN, system: NaN },
    })
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.default.setMuted', () => {
  test('0', () => {
    const result: any = mutations.default.setMuted(
      {
        previousVolume: 100,
        inputVolume: 100,
        muted: false,
        volume: -100,
        deafened: false,
        sounds: { inboundMedia: 10.0, outboundMedia: 10.23, system: -1.0 },
      },
      true,
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.default.setMuted(
      {
        previousVolume: 0,
        inputVolume: -100,
        muted: true,
        volume: -1,
        deafened: true,
        sounds: { inboundMedia: -0.5, outboundMedia: -29.45, system: 0.5 },
      },
      true,
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.default.setMuted(
      {
        previousVolume: 0,
        inputVolume: -100,
        muted: true,
        volume: 0,
        deafened: false,
        sounds: { inboundMedia: 10.0, outboundMedia: 0.0, system: 0.0 },
      },
      true,
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.default.setMuted(
      {
        previousVolume: -1,
        inputVolume: 0,
        muted: true,
        volume: 100,
        deafened: true,
        sounds: { inboundMedia: -29.45, outboundMedia: -0.5, system: 0.5 },
      },
      true,
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.default.setMuted(
      {
        previousVolume: -100,
        inputVolume: -1,
        muted: false,
        volume: 1,
        deafened: true,
        sounds: { inboundMedia: 0.0, outboundMedia: 0.0, system: -1.0 },
      },
      true,
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.default.setMuted(
      {
        previousVolume: -Infinity,
        inputVolume: -Infinity,
        muted: true,
        volume: -Infinity,
        deafened: false,
        sounds: {
          inboundMedia: -Infinity,
          outboundMedia: -Infinity,
          system: -Infinity,
        },
      },
      true,
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.default.deafen', () => {
  test('0', () => {
    const result: any = mutations.default.deafen({
      previousVolume: 1,
      inputVolume: 100,
      muted: false,
      volume: 0,
      deafened: true,
      sounds: { inboundMedia: 10.0, outboundMedia: 1.0, system: 10.0 },
    })
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.default.deafen({
      previousVolume: -1,
      inputVolume: 100,
      muted: false,
      volume: -1,
      deafened: false,
      sounds: { inboundMedia: 1.0, outboundMedia: 10.0, system: -1.0 },
    })
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.default.deafen({
      previousVolume: -100,
      inputVolume: 1,
      muted: false,
      volume: 1,
      deafened: false,
      sounds: { inboundMedia: 1.0, outboundMedia: 0.0, system: -0.5 },
    })
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.default.deafen({
      previousVolume: 100,
      inputVolume: 1,
      muted: false,
      volume: 100,
      deafened: true,
      sounds: { inboundMedia: 0.5, outboundMedia: -1.0, system: 10.0 },
    })
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.default.deafen({
      previousVolume: 0,
      inputVolume: 100,
      muted: true,
      volume: -1,
      deafened: false,
      sounds: { inboundMedia: 10.0, outboundMedia: 0.0, system: -29.45 },
    })
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.default.deafen({
      previousVolume: -Infinity,
      inputVolume: -Infinity,
      muted: true,
      volume: -Infinity,
      deafened: true,
      sounds: {
        inboundMedia: -Infinity,
        outboundMedia: -Infinity,
        system: -Infinity,
      },
    })
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.default.setVolume', () => {
  test('0', () => {
    const result: any = mutations.default.setVolume(
      {
        previousVolume: 0,
        inputVolume: 100,
        muted: true,
        volume: 0,
        deafened: false,
        sounds: { inboundMedia: 10.23, outboundMedia: 0.0, system: 10.0 },
      },
      -1,
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.default.setVolume(
      {
        previousVolume: 0,
        inputVolume: 100,
        muted: true,
        volume: 1,
        deafened: true,
        sounds: { inboundMedia: 10.0, outboundMedia: 10.0, system: -29.45 },
      },
      0,
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.default.setVolume(
      {
        previousVolume: -100,
        inputVolume: 100,
        muted: true,
        volume: 100,
        deafened: true,
        sounds: { inboundMedia: -29.45, outboundMedia: -29.45, system: 10.0 },
      },
      1,
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.default.setVolume(
      {
        previousVolume: 100,
        inputVolume: 0,
        muted: true,
        volume: 100,
        deafened: true,
        sounds: { inboundMedia: -1.0, outboundMedia: 0.0, system: 10.23 },
      },
      1,
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.default.setVolume(
      {
        previousVolume: -100,
        inputVolume: -100,
        muted: false,
        volume: 0,
        deafened: true,
        sounds: { inboundMedia: 10.23, outboundMedia: 10.23, system: -1.0 },
      },
      0,
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.default.setVolume(
      {
        previousVolume: -Infinity,
        inputVolume: -Infinity,
        muted: true,
        volume: -Infinity,
        deafened: true,
        sounds: {
          inboundMedia: -Infinity,
          outboundMedia: -Infinity,
          system: -Infinity,
        },
      },
      -Infinity,
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.default.setSoundLevel', () => {
  test('0', () => {
    const result: any = mutations.default.setSoundLevel(
      {
        previousVolume: -1,
        inputVolume: -1,
        muted: true,
        volume: -100,
        deafened: true,
        sounds: { inboundMedia: 1.0, outboundMedia: 10.0, system: 1.0 },
      },
      { inboundMedia: 0.5, outboundMedia: 1.0, system: 10.0 },
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.default.setSoundLevel(
      {
        previousVolume: 1,
        inputVolume: 0,
        muted: false,
        volume: 0,
        deafened: true,
        sounds: { inboundMedia: 1.0, outboundMedia: 10.23, system: 10.0 },
      },
      { inboundMedia: 0.0, outboundMedia: 0.0, system: 1.0 },
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.default.setSoundLevel(
      {
        previousVolume: -1,
        inputVolume: -100,
        muted: false,
        volume: 0,
        deafened: true,
        sounds: { inboundMedia: -29.45, outboundMedia: 10.23, system: 1.0 },
      },
      { inboundMedia: 1.0, outboundMedia: 10.23, system: -1.0 },
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.default.setSoundLevel(
      {
        previousVolume: -100,
        inputVolume: -100,
        muted: false,
        volume: -1,
        deafened: true,
        sounds: { inboundMedia: 1.0, outboundMedia: 10.23, system: 10.23 },
      },
      { inboundMedia: 0.5, outboundMedia: 0.5, system: 0.5 },
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.default.setSoundLevel(
      {
        previousVolume: -1,
        inputVolume: 0,
        muted: false,
        volume: 0,
        deafened: false,
        sounds: { inboundMedia: 0.0, outboundMedia: 10.23, system: 0.5 },
      },
      { inboundMedia: 0.5, outboundMedia: 10.23, system: -0.5 },
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.default.setSoundLevel(
      {
        previousVolume: Infinity,
        inputVolume: Infinity,
        muted: false,
        volume: Infinity,
        deafened: false,
        sounds: {
          inboundMedia: Infinity,
          outboundMedia: Infinity,
          system: Infinity,
        },
      },
      { inboundMedia: Infinity, outboundMedia: Infinity, system: Infinity },
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.default.setSystemVolume', () => {
  test('0', () => {
    const result: any = mutations.default.setSystemVolume(
      {
        previousVolume: -1,
        inputVolume: -1,
        muted: false,
        volume: 100,
        deafened: true,
        sounds: { inboundMedia: -0.5, outboundMedia: 0.0, system: 0.5 },
      },
      1,
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.default.setSystemVolume(
      {
        previousVolume: -100,
        inputVolume: -100,
        muted: true,
        volume: 1,
        deafened: true,
        sounds: { inboundMedia: -29.45, outboundMedia: 0.5, system: 10.0 },
      },
      1,
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.default.setSystemVolume(
      {
        previousVolume: -1,
        inputVolume: -1,
        muted: true,
        volume: -1,
        deafened: false,
        sounds: { inboundMedia: 0.0, outboundMedia: -0.5, system: 0.5 },
      },
      1,
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.default.setSystemVolume(
      {
        previousVolume: -100,
        inputVolume: 1,
        muted: true,
        volume: -1,
        deafened: false,
        sounds: { inboundMedia: -1.0, outboundMedia: 10.23, system: 10.23 },
      },
      -100,
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.default.setSystemVolume(
      {
        previousVolume: -1,
        inputVolume: 100,
        muted: false,
        volume: 100,
        deafened: true,
        sounds: { inboundMedia: 10.0, outboundMedia: -1.0, system: 0.0 },
      },
      100,
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.default.setSystemVolume(
      {
        previousVolume: NaN,
        inputVolume: NaN,
        muted: false,
        volume: NaN,
        deafened: false,
        sounds: { inboundMedia: NaN, outboundMedia: NaN, system: NaN },
      },
      NaN,
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.default.setInputVolume', () => {
  test('0', () => {
    const result: any = mutations.default.setInputVolume(
      {
        previousVolume: 100,
        inputVolume: -1,
        muted: true,
        volume: -1,
        deafened: true,
        sounds: { inboundMedia: 10.23, outboundMedia: -0.5, system: -29.45 },
      },
      -1,
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.default.setInputVolume(
      {
        previousVolume: -1,
        inputVolume: -100,
        muted: true,
        volume: 0,
        deafened: false,
        sounds: { inboundMedia: 0.5, outboundMedia: 0.0, system: 0.5 },
      },
      -100,
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.default.setInputVolume(
      {
        previousVolume: -1,
        inputVolume: -1,
        muted: true,
        volume: -1,
        deafened: true,
        sounds: { inboundMedia: 10.0, outboundMedia: 1.0, system: -29.45 },
      },
      -100,
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.default.setInputVolume(
      {
        previousVolume: 0,
        inputVolume: 0,
        muted: false,
        volume: 0,
        deafened: false,
        sounds: { inboundMedia: -29.45, outboundMedia: 10.0, system: 1.0 },
      },
      -100,
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.default.setInputVolume(
      {
        previousVolume: -100,
        inputVolume: 100,
        muted: true,
        volume: 0,
        deafened: true,
        sounds: { inboundMedia: 10.0, outboundMedia: 1.0, system: -29.45 },
      },
      -100,
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.default.setInputVolume(
      {
        previousVolume: NaN,
        inputVolume: NaN,
        muted: true,
        volume: NaN,
        deafened: true,
        sounds: { inboundMedia: NaN, outboundMedia: NaN, system: NaN },
      },
      NaN,
    )
    expect(result).toMatchSnapshot()
  })
})
