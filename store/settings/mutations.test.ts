import * as mutations from '~/store/settings/mutations'

describe('mutations.default.echoCancellation', () => {
  test('0', () => {
    const result: any = mutations.default.echoCancellation(
      {
        audioInput: '4.0.0-beta1\t',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: 'v1.2.4',
        captureMouse: '2021-07-30T00:05:36.818Z',
        noiseSuppression: false,
        echoCancellation: false,
        bitrate: 300,
        sampleSize: 256,
        userHasGivenAudioAccess: false,
        userDeniedAudioAccess: false,
        keybinds: {
          constructor: () => '',
          toString: () => '2019-07-01',
          toLocaleString: () => 'foo bar',
          valueOf: () => ({
            constructor: () => '',
            toString: () => '2019-07-01',
            toLocaleString: () => 'Foo bar',
            valueOf: () => null,
            hasOwnProperty: () => true,
            isPrototypeOf: () => false,
            propertyIsEnumerable: () => true,
          }),
          hasOwnProperty: () => true,
          isPrototypeOf: () => true,
          propertyIsEnumerable: () => false,
        },
        embeddedLinks: false,
        displayCurrentActivity: true,
      },
      true,
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.default.echoCancellation(
      {
        audioInput: 'v1.2.4',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: '^5.0.0',
        captureMouse: '2021-07-29T20:12:53.196Z',
        noiseSuppression: false,
        echoCancellation: true,
        bitrate: 0,
        sampleSize: 0,
        userHasGivenAudioAccess: false,
        userDeniedAudioAccess: true,
        keybinds: {
          constructor: () => true,
          toString: () => '2020-03-01',
          toLocaleString: () => 'Foo bar',
          valueOf: () => ({
            constructor: () => 'return callback value',
            toString: () => '2019-07-01',
            toLocaleString: () => 'This is a Text',
            valueOf: () => null,
            hasOwnProperty: () => false,
            isPrototypeOf: () => true,
            propertyIsEnumerable: () => true,
          }),
          hasOwnProperty: () => false,
          isPrototypeOf: () => true,
          propertyIsEnumerable: () => false,
        },
        embeddedLinks: false,
        displayCurrentActivity: true,
      },
      true,
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.default.echoCancellation(
      {
        audioInput: '4.0.0-beta1\t',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: '4.0.0-beta1\t',
        captureMouse: '2021-07-30T00:05:36.818Z',
        noiseSuppression: false,
        echoCancellation: false,
        bitrate: 6.0,
        sampleSize: 256,
        userHasGivenAudioAccess: false,
        userDeniedAudioAccess: true,
        keybinds: {
          constructor: () => true,
          toString: () => '2019-10-01-preview',
          toLocaleString: () => 'Hello, world!',
          valueOf: () => null,
          hasOwnProperty: () => false,
          isPrototypeOf: () => true,
          propertyIsEnumerable: () => true,
        },
        embeddedLinks: true,
        displayCurrentActivity: true,
      },
      true,
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.default.echoCancellation(
      {
        audioInput: 'v4.0.0-rc.4',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: '^5.0.0',
        captureMouse: '2021-07-29T20:12:53.196Z',
        noiseSuppression: true,
        echoCancellation: true,
        bitrate: 300,
        sampleSize: 32,
        userHasGivenAudioAccess: true,
        userDeniedAudioAccess: false,
        keybinds: {
          constructor: () => '',
          toString: () => '2020-06-01',
          toLocaleString: () => 'Hello, world!',
          valueOf: () => null,
          hasOwnProperty: () => false,
          isPrototypeOf: () => true,
          propertyIsEnumerable: () => false,
        },
        embeddedLinks: false,
        displayCurrentActivity: false,
      },
      false,
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.default.echoCancellation(
      {
        audioInput: 'v4.0.0-rc.4',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: 'v4.0.0-rc.4',
        captureMouse: '2021-07-29T23:03:48.812Z',
        noiseSuppression: true,
        echoCancellation: true,
        bitrate: 6.0,
        sampleSize: 10,
        userHasGivenAudioAccess: false,
        userDeniedAudioAccess: false,
        keybinds: {
          constructor: () => 'return callback value',
          toString: () => '2017-03-01',
          toLocaleString: () => 'Hello, world!',
          valueOf: () => null,
          hasOwnProperty: () => false,
          isPrototypeOf: () => true,
          propertyIsEnumerable: () => false,
        },
        embeddedLinks: true,
        displayCurrentActivity: true,
      },
      false,
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.default.echoCancellation(
      {
        audioInput: '',
        audioOutput: '',
        videoInput: '',
        captureMouse: '',
        noiseSuppression: true,
        echoCancellation: true,
        bitrate: Infinity,
        sampleSize: Infinity,
        userHasGivenAudioAccess: true,
        userDeniedAudioAccess: true,
        keybinds: {
          constructor: () => '',
          toString: () => '',
          toLocaleString: () => '',
          valueOf: () => ({
            constructor: () => true,
            toString: () => '',
            toLocaleString: () => '',
            valueOf: () => null,
            hasOwnProperty: () => false,
            isPrototypeOf: () => false,
            propertyIsEnumerable: () => true,
          }),
          hasOwnProperty: () => true,
          isPrototypeOf: () => true,
          propertyIsEnumerable: () => false,
        },
        embeddedLinks: false,
        displayCurrentActivity: true,
      },
      true,
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.default.noiseSuppression', () => {
  test('0', () => {
    const result: any = mutations.default.noiseSuppression(
      {
        audioInput: '^5.0.0',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: 'v1.2.4',
        captureMouse: '2021-07-29T20:12:53.196Z',
        noiseSuppression: true,
        echoCancellation: false,
        bitrate: 6.0,
        sampleSize: 0,
        userHasGivenAudioAccess: false,
        userDeniedAudioAccess: true,
        keybinds: {
          constructor: () => true,
          toString: () => '2019-10-01-preview',
          toLocaleString: () => 'foo bar',
          valueOf: () => null,
          hasOwnProperty: () => false,
          isPrototypeOf: () => false,
          propertyIsEnumerable: () => true,
        },
        embeddedLinks: false,
        displayCurrentActivity: false,
      },
      false,
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.default.noiseSuppression(
      {
        audioInput: 'v4.0.0-rc.4',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: 'v1.2.4',
        captureMouse: '2021-07-29T15:31:46.922Z',
        noiseSuppression: true,
        echoCancellation: true,
        bitrate: 6.0,
        sampleSize: 16,
        userHasGivenAudioAccess: true,
        userDeniedAudioAccess: false,
        keybinds: {
          constructor: () => false,
          toString: () => '2017-03-01',
          toLocaleString: () => 'This is a Text',
          valueOf: () => ({
            constructor: () => true,
            toString: () => '2020-03-01',
            toLocaleString: () => 'Hello, world!',
            valueOf: () => null,
            hasOwnProperty: () => false,
            isPrototypeOf: () => false,
            propertyIsEnumerable: () => false,
          }),
          hasOwnProperty: () => false,
          isPrototypeOf: () => true,
          propertyIsEnumerable: () => true,
        },
        embeddedLinks: false,
        displayCurrentActivity: false,
      },
      true,
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.default.noiseSuppression(
      {
        audioInput: '^5.0.0',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: 'v4.0.0-rc.4',
        captureMouse: '2021-07-29T15:31:46.922Z',
        noiseSuppression: false,
        echoCancellation: false,
        bitrate: 300,
        sampleSize: 256,
        userHasGivenAudioAccess: true,
        userDeniedAudioAccess: true,
        keybinds: {
          constructor: () => false,
          toString: () => '2019-06-01',
          toLocaleString: () => 'foo bar',
          valueOf: () => null,
          hasOwnProperty: () => true,
          isPrototypeOf: () => false,
          propertyIsEnumerable: () => false,
        },
        embeddedLinks: false,
        displayCurrentActivity: true,
      },
      true,
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.default.noiseSuppression(
      {
        audioInput: '1.0.0',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: '^5.0.0',
        captureMouse: '2021-07-30T00:05:36.818Z',
        noiseSuppression: true,
        echoCancellation: true,
        bitrate: 300,
        sampleSize: 256,
        userHasGivenAudioAccess: false,
        userDeniedAudioAccess: false,
        keybinds: {
          constructor: () => false,
          toString: () => '2020-03-01',
          toLocaleString: () => 'Hello, world!',
          valueOf: () => null,
          hasOwnProperty: () => true,
          isPrototypeOf: () => true,
          propertyIsEnumerable: () => true,
        },
        embeddedLinks: true,
        displayCurrentActivity: true,
      },
      false,
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.default.noiseSuppression(
      {
        audioInput: 'v1.2.4',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: 'v4.0.0-rc.4',
        captureMouse: '2021-07-29T23:03:48.812Z',
        noiseSuppression: false,
        echoCancellation: false,
        bitrate: 6.0,
        sampleSize: 0,
        userHasGivenAudioAccess: true,
        userDeniedAudioAccess: false,
        keybinds: {
          constructor: () => true,
          toString: () => '2020-03-01',
          toLocaleString: () => 'Hello, world!',
          valueOf: () => ({
            constructor: () => false,
            toString: () => '2020-03-01',
            toLocaleString: () => 'Foo bar',
            valueOf: () => null,
            hasOwnProperty: () => false,
            isPrototypeOf: () => true,
            propertyIsEnumerable: () => true,
          }),
          hasOwnProperty: () => false,
          isPrototypeOf: () => false,
          propertyIsEnumerable: () => true,
        },
        embeddedLinks: true,
        displayCurrentActivity: true,
      },
      false,
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.default.noiseSuppression(
      {
        audioInput: '',
        audioOutput: '',
        videoInput: '',
        captureMouse: '',
        noiseSuppression: true,
        echoCancellation: false,
        bitrate: -Infinity,
        sampleSize: -Infinity,
        userHasGivenAudioAccess: true,
        userDeniedAudioAccess: false,
        keybinds: {
          constructor: () => true,
          toString: () => '',
          toLocaleString: () => '',
          valueOf: () => null,
          hasOwnProperty: () => false,
          isPrototypeOf: () => true,
          propertyIsEnumerable: () => true,
        },
        embeddedLinks: true,
        displayCurrentActivity: true,
      },
      true,
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.default.bitrate', () => {
  test('0', () => {
    const result: any = mutations.default.bitrate(
      {
        audioInput: '4.0.0-beta1\t',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: '^5.0.0',
        captureMouse: '2021-07-30T00:05:36.818Z',
        noiseSuppression: false,
        echoCancellation: true,
        bitrate: 256,
        sampleSize: 32,
        userHasGivenAudioAccess: true,
        userDeniedAudioAccess: true,
        keybinds: {
          constructor: () => 'return callback value',
          toString: () => '2020-03-01',
          toLocaleString: () => 'Foo bar',
          valueOf: () => null,
          hasOwnProperty: () => false,
          isPrototypeOf: () => true,
          propertyIsEnumerable: () => false,
        },
        embeddedLinks: true,
        displayCurrentActivity: true,
      },
      64,
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.default.bitrate(
      {
        audioInput: '1.0.0',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: 'v4.0.0-rc.4',
        captureMouse: '2021-07-29T17:54:41.653Z',
        noiseSuppression: false,
        echoCancellation: true,
        bitrate: 256,
        sampleSize: 32,
        userHasGivenAudioAccess: true,
        userDeniedAudioAccess: true,
        keybinds: {
          constructor: () => 'return callback value',
          toString: () => '2020-03-01',
          toLocaleString: () => 'foo bar',
          valueOf: () => null,
          hasOwnProperty: () => true,
          isPrototypeOf: () => false,
          propertyIsEnumerable: () => true,
        },
        embeddedLinks: true,
        displayCurrentActivity: false,
      },
      0,
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.default.bitrate(
      {
        audioInput: 'v4.0.0-rc.4',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: '^5.0.0',
        captureMouse: '2021-07-29T15:31:46.922Z',
        noiseSuppression: true,
        echoCancellation: false,
        bitrate: 4,
        sampleSize: 32,
        userHasGivenAudioAccess: true,
        userDeniedAudioAccess: true,
        keybinds: {
          constructor: () => true,
          toString: () => '2019-07-01',
          toLocaleString: () => 'foo bar',
          valueOf: () => null,
          hasOwnProperty: () => true,
          isPrototypeOf: () => false,
          propertyIsEnumerable: () => true,
        },
        embeddedLinks: true,
        displayCurrentActivity: false,
      },
      256,
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.default.bitrate(
      {
        audioInput: 'v1.2.4',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: '1.0.0',
        captureMouse: '2021-07-29T23:03:48.812Z',
        noiseSuppression: false,
        echoCancellation: true,
        bitrate: 32,
        sampleSize: 64,
        userHasGivenAudioAccess: true,
        userDeniedAudioAccess: true,
        keybinds: {
          constructor: () => '',
          toString: () => '2019-06-01',
          toLocaleString: () => 'Hello, world!',
          valueOf: () => null,
          hasOwnProperty: () => false,
          isPrototypeOf: () => true,
          propertyIsEnumerable: () => true,
        },
        embeddedLinks: true,
        displayCurrentActivity: false,
      },
      10,
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.default.bitrate(
      {
        audioInput: 'v1.2.4',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: 'v4.0.0-rc.4',
        captureMouse: '2021-07-29T17:54:41.653Z',
        noiseSuppression: true,
        echoCancellation: true,
        bitrate: 11,
        sampleSize: 256,
        userHasGivenAudioAccess: false,
        userDeniedAudioAccess: true,
        keybinds: {
          constructor: () => true,
          toString: () => '2020-03-01',
          toLocaleString: () => 'This is a Text',
          valueOf: () => null,
          hasOwnProperty: () => true,
          isPrototypeOf: () => true,
          propertyIsEnumerable: () => false,
        },
        embeddedLinks: true,
        displayCurrentActivity: true,
      },
      32,
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.default.bitrate(
      {
        audioInput: '',
        audioOutput: '',
        videoInput: '',
        captureMouse: '',
        noiseSuppression: true,
        echoCancellation: false,
        bitrate: -Infinity,
        sampleSize: -Infinity,
        userHasGivenAudioAccess: true,
        userDeniedAudioAccess: false,
        keybinds: {
          constructor: () => false,
          toString: () => '',
          toLocaleString: () => '',
          valueOf: () => ({
            constructor: () => true,
            toString: () => '',
            toLocaleString: () => '',
            valueOf: () => null,
            hasOwnProperty: () => false,
            isPrototypeOf: () => true,
            propertyIsEnumerable: () => true,
          }),
          hasOwnProperty: () => true,
          isPrototypeOf: () => false,
          propertyIsEnumerable: () => true,
        },
        embeddedLinks: true,
        displayCurrentActivity: true,
      },
      -Infinity,
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.default.audioOutput', () => {
  test('0', () => {
    const result: any = mutations.default.audioOutput(
      {
        audioInput: '4.0.0-beta1\t',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: 'v4.0.0-rc.4',
        captureMouse: '2021-07-30T00:05:36.818Z',
        noiseSuppression: true,
        echoCancellation: true,
        bitrate: 0.0,
        sampleSize: 0,
        userHasGivenAudioAccess: true,
        userDeniedAudioAccess: true,
        keybinds: {
          constructor: () => false,
          toString: () => '2019-10-01-preview',
          toLocaleString: () => 'foo bar',
          valueOf: () => null,
          hasOwnProperty: () => true,
          isPrototypeOf: () => false,
          propertyIsEnumerable: () => true,
        },
        embeddedLinks: false,
        displayCurrentActivity: true,
      },
      'elio@example.com',
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.default.audioOutput(
      {
        audioInput: '4.0.0-beta1\t',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: 'v4.0.0-rc.4',
        captureMouse: '2021-07-29T20:12:53.196Z',
        noiseSuppression: true,
        echoCancellation: true,
        bitrate: 300,
        sampleSize: 32,
        userHasGivenAudioAccess: true,
        userDeniedAudioAccess: true,
        keybinds: {
          constructor: () => true,
          toString: () => '2020-06-01',
          toLocaleString: () => 'This is a Text',
          valueOf: () => null,
          hasOwnProperty: () => false,
          isPrototypeOf: () => false,
          propertyIsEnumerable: () => false,
        },
        embeddedLinks: false,
        displayCurrentActivity: true,
      },
      'Elio',
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.default.audioOutput(
      {
        audioInput: '^5.0.0',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: 'v1.2.4',
        captureMouse: '2021-07-29T23:03:48.812Z',
        noiseSuppression: false,
        echoCancellation: true,
        bitrate: 0,
        sampleSize: 0,
        userHasGivenAudioAccess: false,
        userDeniedAudioAccess: false,
        keybinds: {
          constructor: () => false,
          toString: () => '2019-10-01-preview',
          toLocaleString: () => 'foo bar',
          valueOf: () => null,
          hasOwnProperty: () => false,
          isPrototypeOf: () => true,
          propertyIsEnumerable: () => true,
        },
        embeddedLinks: false,
        displayCurrentActivity: false,
      },
      'Elio',
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.default.audioOutput(
      {
        audioInput: '4.0.0-beta1\t',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: 'v1.2.4',
        captureMouse: '2021-07-29T15:31:46.922Z',
        noiseSuppression: false,
        echoCancellation: false,
        bitrate: 0.0,
        sampleSize: 16,
        userHasGivenAudioAccess: false,
        userDeniedAudioAccess: false,
        keybinds: {
          constructor: () => true,
          toString: () => '2020-06-01',
          toLocaleString: () => 'Hello, world!',
          valueOf: () => null,
          hasOwnProperty: () => true,
          isPrototypeOf: () => true,
          propertyIsEnumerable: () => true,
        },
        embeddedLinks: false,
        displayCurrentActivity: true,
      },
      'Dillenberg',
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.default.audioOutput(
      {
        audioInput: 'v4.0.0-rc.4',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: '4.0.0-beta1\t',
        captureMouse: '2021-07-30T00:05:36.818Z',
        noiseSuppression: false,
        echoCancellation: true,
        bitrate: 10000,
        sampleSize: 16,
        userHasGivenAudioAccess: false,
        userDeniedAudioAccess: false,
        keybinds: {
          constructor: () => true,
          toString: () => '2019-10-01-preview',
          toLocaleString: () => 'Hello, world!',
          valueOf: () => null,
          hasOwnProperty: () => true,
          isPrototypeOf: () => false,
          propertyIsEnumerable: () => false,
        },
        embeddedLinks: true,
        displayCurrentActivity: true,
      },
      'Elio',
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.default.audioOutput(
      {
        audioInput: '',
        audioOutput: '',
        videoInput: '',
        captureMouse: '',
        noiseSuppression: true,
        echoCancellation: true,
        bitrate: -Infinity,
        sampleSize: -Infinity,
        userHasGivenAudioAccess: false,
        userDeniedAudioAccess: true,
        keybinds: {
          constructor: () => true,
          toString: () => '',
          toLocaleString: () => '',
          valueOf: () => null,
          hasOwnProperty: () => false,
          isPrototypeOf: () => false,
          propertyIsEnumerable: () => false,
        },
        embeddedLinks: true,
        displayCurrentActivity: true,
      },
      '',
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.default.sampleSize', () => {
  test('0', () => {
    const result: any = mutations.default.sampleSize(
      {
        audioInput: 'v4.0.0-rc.4',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: '4.0.0-beta1\t',
        captureMouse: '2021-07-29T17:54:41.653Z',
        noiseSuppression: false,
        echoCancellation: true,
        bitrate: 0,
        sampleSize: 256,
        userHasGivenAudioAccess: false,
        userDeniedAudioAccess: false,
        keybinds: {
          constructor: () => true,
          toString: () => '2019-06-01',
          toLocaleString: () => 'Hello, world!',
          valueOf: () => null,
          hasOwnProperty: () => true,
          isPrototypeOf: () => false,
          propertyIsEnumerable: () => false,
        },
        embeddedLinks: false,
        displayCurrentActivity: false,
      },
      256,
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.default.sampleSize(
      {
        audioInput: '^5.0.0',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: '1.0.0',
        captureMouse: '2021-07-29T17:54:41.653Z',
        noiseSuppression: false,
        echoCancellation: false,
        bitrate: 300,
        sampleSize: 10,
        userHasGivenAudioAccess: true,
        userDeniedAudioAccess: true,
        keybinds: {
          constructor: () => 'return callback value',
          toString: () => '2019-10-01-preview',
          toLocaleString: () => 'This is a Text',
          valueOf: () => null,
          hasOwnProperty: () => false,
          isPrototypeOf: () => false,
          propertyIsEnumerable: () => true,
        },
        embeddedLinks: true,
        displayCurrentActivity: false,
      },
      16,
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.default.sampleSize(
      {
        audioInput: '^5.0.0',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: '4.0.0-beta1\t',
        captureMouse: '2021-07-29T23:03:48.812Z',
        noiseSuppression: true,
        echoCancellation: false,
        bitrate: 6.0,
        sampleSize: 256,
        userHasGivenAudioAccess: true,
        userDeniedAudioAccess: true,
        keybinds: {
          constructor: () => '',
          toString: () => '2017-03-01',
          toLocaleString: () => 'This is a Text',
          valueOf: () => ({
            constructor: () => '',
            toString: () => '2020-06-01',
            toLocaleString: () => 'Hello, world!',
            valueOf: () => null,
            hasOwnProperty: () => true,
            isPrototypeOf: () => false,
            propertyIsEnumerable: () => true,
          }),
          hasOwnProperty: () => true,
          isPrototypeOf: () => true,
          propertyIsEnumerable: () => false,
        },
        embeddedLinks: true,
        displayCurrentActivity: true,
      },
      32,
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.default.sampleSize(
      {
        audioInput: '4.0.0-beta1\t',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: 'v1.2.4',
        captureMouse: '2021-07-29T20:12:53.196Z',
        noiseSuppression: true,
        echoCancellation: true,
        bitrate: 300,
        sampleSize: 0,
        userHasGivenAudioAccess: true,
        userDeniedAudioAccess: true,
        keybinds: {
          constructor: () => false,
          toString: () => '2019-06-01',
          toLocaleString: () => 'This is a Text',
          valueOf: () => null,
          hasOwnProperty: () => true,
          isPrototypeOf: () => true,
          propertyIsEnumerable: () => false,
        },
        embeddedLinks: false,
        displayCurrentActivity: true,
      },
      0,
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.default.sampleSize(
      {
        audioInput: 'v1.2.4',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: 'v4.0.0-rc.4',
        captureMouse: '2021-07-29T20:12:53.196Z',
        noiseSuppression: false,
        echoCancellation: true,
        bitrate: 10000,
        sampleSize: 16,
        userHasGivenAudioAccess: false,
        userDeniedAudioAccess: false,
        keybinds: {
          constructor: () => '',
          toString: () => '2020-03-01',
          toLocaleString: () => 'Hello, world!',
          valueOf: () => ({
            constructor: () => '',
            toString: () => '2020-06-01',
            toLocaleString: () => 'This is a Text',
            valueOf: () => ({
              constructor: () => '',
              toString: () => '2020-06-01',
              toLocaleString: () => 'Foo bar',
              valueOf: () => null,
              hasOwnProperty: () => false,
              isPrototypeOf: () => false,
              propertyIsEnumerable: () => true,
            }),
            hasOwnProperty: () => false,
            isPrototypeOf: () => false,
            propertyIsEnumerable: () => true,
          }),
          hasOwnProperty: () => true,
          isPrototypeOf: () => false,
          propertyIsEnumerable: () => true,
        },
        embeddedLinks: true,
        displayCurrentActivity: true,
      },
      10,
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.default.sampleSize(
      {
        audioInput: '',
        audioOutput: '',
        videoInput: '',
        captureMouse: '',
        noiseSuppression: false,
        echoCancellation: true,
        bitrate: NaN,
        sampleSize: NaN,
        userHasGivenAudioAccess: true,
        userDeniedAudioAccess: false,
        keybinds: {
          constructor: () => '',
          toString: () => '',
          toLocaleString: () => '',
          valueOf: () => ({
            constructor: () => '',
            toString: () => '',
            toLocaleString: () => '',
            valueOf: () => null,
            hasOwnProperty: () => false,
            isPrototypeOf: () => true,
            propertyIsEnumerable: () => true,
          }),
          hasOwnProperty: () => false,
          isPrototypeOf: () => true,
          propertyIsEnumerable: () => false,
        },
        embeddedLinks: false,
        displayCurrentActivity: true,
      },
      NaN,
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.default.audioInput', () => {
  test('0', () => {
    const result: any = mutations.default.audioInput(
      {
        audioInput: 'v4.0.0-rc.4',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: '4.0.0-beta1\t',
        captureMouse: '2021-07-29T17:54:41.653Z',
        noiseSuppression: false,
        echoCancellation: false,
        bitrate: 0,
        sampleSize: 32,
        userHasGivenAudioAccess: true,
        userDeniedAudioAccess: true,
        keybinds: {
          constructor: () => true,
          toString: () => '2020-06-01',
          toLocaleString: () => 'Foo bar',
          valueOf: () => null,
          hasOwnProperty: () => false,
          isPrototypeOf: () => false,
          propertyIsEnumerable: () => true,
        },
        embeddedLinks: false,
        displayCurrentActivity: true,
      },
      'Elio',
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.default.audioInput(
      {
        audioInput: '1.0.0',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: '1.0.0',
        captureMouse: '2021-07-30T00:05:36.818Z',
        noiseSuppression: true,
        echoCancellation: false,
        bitrate: 6.0,
        sampleSize: 64,
        userHasGivenAudioAccess: true,
        userDeniedAudioAccess: false,
        keybinds: {
          constructor: () => true,
          toString: () => '2020-06-01',
          toLocaleString: () => 'foo bar',
          valueOf: () => null,
          hasOwnProperty: () => true,
          isPrototypeOf: () => false,
          propertyIsEnumerable: () => false,
        },
        embeddedLinks: true,
        displayCurrentActivity: false,
      },
      'Elio',
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.default.audioInput(
      {
        audioInput: '4.0.0-beta1\t',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: 'v1.2.4',
        captureMouse: '2021-07-29T23:03:48.812Z',
        noiseSuppression: false,
        echoCancellation: true,
        bitrate: 6.0,
        sampleSize: 0,
        userHasGivenAudioAccess: true,
        userDeniedAudioAccess: true,
        keybinds: {
          constructor: () => false,
          toString: () => '2020-06-01',
          toLocaleString: () => 'Foo bar',
          valueOf: () => null,
          hasOwnProperty: () => false,
          isPrototypeOf: () => true,
          propertyIsEnumerable: () => true,
        },
        embeddedLinks: true,
        displayCurrentActivity: true,
      },
      'elio@example.com',
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.default.audioInput(
      {
        audioInput: '1.0.0',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: 'v1.2.4',
        captureMouse: '2021-07-29T23:03:48.812Z',
        noiseSuppression: true,
        echoCancellation: false,
        bitrate: 300,
        sampleSize: 0,
        userHasGivenAudioAccess: false,
        userDeniedAudioAccess: true,
        keybinds: {
          constructor: () => false,
          toString: () => '2019-10-01-preview',
          toLocaleString: () => 'foo bar',
          valueOf: () => null,
          hasOwnProperty: () => false,
          isPrototypeOf: () => true,
          propertyIsEnumerable: () => false,
        },
        embeddedLinks: true,
        displayCurrentActivity: true,
      },
      'elio@example.com',
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.default.audioInput(
      {
        audioInput: '4.0.0-beta1\t',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: 'v1.2.4',
        captureMouse: '2021-07-29T17:54:41.653Z',
        noiseSuppression: true,
        echoCancellation: true,
        bitrate: 0,
        sampleSize: 0,
        userHasGivenAudioAccess: false,
        userDeniedAudioAccess: false,
        keybinds: {
          constructor: () => true,
          toString: () => '2017-03-01',
          toLocaleString: () => 'Hello, world!',
          valueOf: () => null,
          hasOwnProperty: () => false,
          isPrototypeOf: () => true,
          propertyIsEnumerable: () => false,
        },
        embeddedLinks: true,
        displayCurrentActivity: false,
      },
      'Dillenberg',
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.default.audioInput(
      {
        audioInput: '',
        audioOutput: '',
        videoInput: '',
        captureMouse: '',
        noiseSuppression: false,
        echoCancellation: false,
        bitrate: -Infinity,
        sampleSize: -Infinity,
        userHasGivenAudioAccess: false,
        userDeniedAudioAccess: true,
        keybinds: {
          constructor: () => false,
          toString: () => '',
          toLocaleString: () => '',
          valueOf: () => null,
          hasOwnProperty: () => true,
          isPrototypeOf: () => true,
          propertyIsEnumerable: () => false,
        },
        embeddedLinks: true,
        displayCurrentActivity: true,
      },
      '',
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.default.videoInput', () => {
  test('0', () => {
    const result: any = mutations.default.videoInput(
      {
        audioInput: 'v4.0.0-rc.4',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: '4.0.0-beta1\t',
        captureMouse: '2021-07-29T17:54:41.653Z',
        noiseSuppression: false,
        echoCancellation: false,
        bitrate: 300,
        sampleSize: 32,
        userHasGivenAudioAccess: false,
        userDeniedAudioAccess: true,
        keybinds: {
          constructor: () => 'return callback value',
          toString: () => '2020-03-01',
          toLocaleString: () => 'Hello, world!',
          valueOf: () => null,
          hasOwnProperty: () => false,
          isPrototypeOf: () => false,
          propertyIsEnumerable: () => false,
        },
        embeddedLinks: true,
        displayCurrentActivity: true,
      },
      'Elio',
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.default.videoInput(
      {
        audioInput: '^5.0.0',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: 'v4.0.0-rc.4',
        captureMouse: '2021-07-29T23:03:48.812Z',
        noiseSuppression: true,
        echoCancellation: true,
        bitrate: 6.0,
        sampleSize: 256,
        userHasGivenAudioAccess: false,
        userDeniedAudioAccess: false,
        keybinds: {
          constructor: () => 'return callback value',
          toString: () => '2019-07-01',
          toLocaleString: () => 'foo bar',
          valueOf: () => null,
          hasOwnProperty: () => false,
          isPrototypeOf: () => true,
          propertyIsEnumerable: () => true,
        },
        embeddedLinks: true,
        displayCurrentActivity: true,
      },
      'elio@example.com',
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.default.videoInput(
      {
        audioInput: 'v1.2.4',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: '^5.0.0',
        captureMouse: '2021-07-29T17:54:41.653Z',
        noiseSuppression: true,
        echoCancellation: false,
        bitrate: 0.0,
        sampleSize: 0,
        userHasGivenAudioAccess: true,
        userDeniedAudioAccess: true,
        keybinds: {
          constructor: () => 'return callback value',
          toString: () => '2017-03-01',
          toLocaleString: () => 'Foo bar',
          valueOf: () => null,
          hasOwnProperty: () => true,
          isPrototypeOf: () => true,
          propertyIsEnumerable: () => true,
        },
        embeddedLinks: false,
        displayCurrentActivity: false,
      },
      'elio@example.com',
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.default.videoInput(
      {
        audioInput: '4.0.0-beta1\t',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: 'v1.2.4',
        captureMouse: '2021-07-29T23:03:48.812Z',
        noiseSuppression: true,
        echoCancellation: true,
        bitrate: 300,
        sampleSize: 256,
        userHasGivenAudioAccess: true,
        userDeniedAudioAccess: false,
        keybinds: {
          constructor: () => '',
          toString: () => '2019-07-01',
          toLocaleString: () => 'foo bar',
          valueOf: () => null,
          hasOwnProperty: () => true,
          isPrototypeOf: () => true,
          propertyIsEnumerable: () => true,
        },
        embeddedLinks: true,
        displayCurrentActivity: true,
      },
      'elio@example.com',
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.default.videoInput(
      {
        audioInput: '1.0.0',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: 'v4.0.0-rc.4',
        captureMouse: '2021-07-29T20:12:53.196Z',
        noiseSuppression: true,
        echoCancellation: true,
        bitrate: 6.0,
        sampleSize: 0,
        userHasGivenAudioAccess: false,
        userDeniedAudioAccess: true,
        keybinds: {
          constructor: () => 'return callback value',
          toString: () => '2019-07-01',
          toLocaleString: () => 'This is a Text',
          valueOf: () => null,
          hasOwnProperty: () => false,
          isPrototypeOf: () => false,
          propertyIsEnumerable: () => true,
        },
        embeddedLinks: true,
        displayCurrentActivity: false,
      },
      'elio@example.com',
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.default.videoInput(
      {
        audioInput: '',
        audioOutput: '',
        videoInput: '',
        captureMouse: '',
        noiseSuppression: true,
        echoCancellation: true,
        bitrate: -Infinity,
        sampleSize: -Infinity,
        userHasGivenAudioAccess: true,
        userDeniedAudioAccess: false,
        keybinds: {
          constructor: () => '',
          toString: () => '',
          toLocaleString: () => '',
          valueOf: () => null,
          hasOwnProperty: () => true,
          isPrototypeOf: () => true,
          propertyIsEnumerable: () => true,
        },
        embeddedLinks: false,
        displayCurrentActivity: true,
      },
      '',
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.default.captureMouse', () => {
  test('0', () => {
    const result: any = mutations.default.captureMouse(
      {
        audioInput: '1.0.0',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: 'v4.0.0-rc.4',
        captureMouse: '2021-07-29T20:12:53.196Z',
        noiseSuppression: false,
        echoCancellation: false,
        bitrate: 0,
        sampleSize: 256,
        userHasGivenAudioAccess: false,
        userDeniedAudioAccess: true,
        keybinds: {
          constructor: () => false,
          toString: () => '2020-06-01',
          toLocaleString: () => 'This is a Text',
          valueOf: () => null,
          hasOwnProperty: () => true,
          isPrototypeOf: () => true,
          propertyIsEnumerable: () => true,
        },
        embeddedLinks: false,
        displayCurrentActivity: false,
      },
      'Dillenberg',
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.default.captureMouse(
      {
        audioInput: '^5.0.0',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: '^5.0.0',
        captureMouse: '2021-07-30T00:05:36.818Z',
        noiseSuppression: false,
        echoCancellation: true,
        bitrate: 6.0,
        sampleSize: 64,
        userHasGivenAudioAccess: false,
        userDeniedAudioAccess: true,
        keybinds: {
          constructor: () => false,
          toString: () => '2019-10-01-preview',
          toLocaleString: () => 'This is a Text',
          valueOf: () => null,
          hasOwnProperty: () => false,
          isPrototypeOf: () => false,
          propertyIsEnumerable: () => false,
        },
        embeddedLinks: true,
        displayCurrentActivity: false,
      },
      'Elio',
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.default.captureMouse(
      {
        audioInput: '^5.0.0',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: '1.0.0',
        captureMouse: '2021-07-29T20:12:53.196Z',
        noiseSuppression: true,
        echoCancellation: true,
        bitrate: 10000,
        sampleSize: 32,
        userHasGivenAudioAccess: false,
        userDeniedAudioAccess: false,
        keybinds: {
          constructor: () => false,
          toString: () => '2017-03-01',
          toLocaleString: () => 'This is a Text',
          valueOf: () => null,
          hasOwnProperty: () => false,
          isPrototypeOf: () => true,
          propertyIsEnumerable: () => false,
        },
        embeddedLinks: false,
        displayCurrentActivity: false,
      },
      'elio@example.com',
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.default.captureMouse(
      {
        audioInput: 'v1.2.4',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: '^5.0.0',
        captureMouse: '2021-07-29T15:31:46.922Z',
        noiseSuppression: false,
        echoCancellation: false,
        bitrate: 300,
        sampleSize: 32,
        userHasGivenAudioAccess: true,
        userDeniedAudioAccess: true,
        keybinds: {
          constructor: () => false,
          toString: () => '2019-06-01',
          toLocaleString: () => 'foo bar',
          valueOf: () => null,
          hasOwnProperty: () => false,
          isPrototypeOf: () => false,
          propertyIsEnumerable: () => false,
        },
        embeddedLinks: true,
        displayCurrentActivity: false,
      },
      'elio@example.com',
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.default.captureMouse(
      {
        audioInput: 'v1.2.4',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: '^5.0.0',
        captureMouse: '2021-07-29T20:12:53.196Z',
        noiseSuppression: true,
        echoCancellation: false,
        bitrate: 0,
        sampleSize: 64,
        userHasGivenAudioAccess: false,
        userDeniedAudioAccess: true,
        keybinds: {
          constructor: () => false,
          toString: () => '2017-03-01',
          toLocaleString: () => 'This is a Text',
          valueOf: () => null,
          hasOwnProperty: () => false,
          isPrototypeOf: () => true,
          propertyIsEnumerable: () => true,
        },
        embeddedLinks: true,
        displayCurrentActivity: true,
      },
      'Elio',
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.default.captureMouse(
      {
        audioInput: '',
        audioOutput: '',
        videoInput: '',
        captureMouse: '',
        noiseSuppression: false,
        echoCancellation: true,
        bitrate: Infinity,
        sampleSize: Infinity,
        userHasGivenAudioAccess: false,
        userDeniedAudioAccess: true,
        keybinds: {
          constructor: () => true,
          toString: () => '',
          toLocaleString: () => '',
          valueOf: () => null,
          hasOwnProperty: () => true,
          isPrototypeOf: () => false,
          propertyIsEnumerable: () => true,
        },
        embeddedLinks: true,
        displayCurrentActivity: false,
      },
      '',
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.default.setKeybinds', () => {
  test('0', () => {
    const result: any = mutations.default.setKeybinds(
      {
        audioInput: 'v1.2.4',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: '1.0.0',
        captureMouse: '2021-07-29T23:03:48.812Z',
        noiseSuppression: true,
        echoCancellation: false,
        bitrate: 0,
        sampleSize: 0,
        userHasGivenAudioAccess: false,
        userDeniedAudioAccess: false,
        keybinds: {
          constructor: () => true,
          toString: () => '2019-06-01',
          toLocaleString: () => 'Hello, world!',
          valueOf: () => null,
          hasOwnProperty: () => true,
          isPrototypeOf: () => true,
          propertyIsEnumerable: () => false,
        },
        embeddedLinks: false,
        displayCurrentActivity: false,
      },
      'Elio',
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.default.setKeybinds(
      {
        audioInput: '4.0.0-beta1\t',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: 'v4.0.0-rc.4',
        captureMouse: '2021-07-29T20:12:53.196Z',
        noiseSuppression: true,
        echoCancellation: false,
        bitrate: 300,
        sampleSize: 64,
        userHasGivenAudioAccess: true,
        userDeniedAudioAccess: false,
        keybinds: {
          constructor: () => false,
          toString: () => '2017-03-01',
          toLocaleString: () => 'foo bar',
          valueOf: () => null,
          hasOwnProperty: () => false,
          isPrototypeOf: () => false,
          propertyIsEnumerable: () => true,
        },
        embeddedLinks: false,
        displayCurrentActivity: true,
      },
      'Elio',
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.default.setKeybinds(
      {
        audioInput: 'v4.0.0-rc.4',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: '4.0.0-beta1\t',
        captureMouse: '2021-07-29T17:54:41.653Z',
        noiseSuppression: false,
        echoCancellation: true,
        bitrate: 300,
        sampleSize: 16,
        userHasGivenAudioAccess: false,
        userDeniedAudioAccess: true,
        keybinds: {
          constructor: () => '',
          toString: () => '2019-10-01-preview',
          toLocaleString: () => 'foo bar',
          valueOf: () => null,
          hasOwnProperty: () => false,
          isPrototypeOf: () => false,
          propertyIsEnumerable: () => true,
        },
        embeddedLinks: false,
        displayCurrentActivity: true,
      },
      'Elio',
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.default.setKeybinds(
      {
        audioInput: 'v4.0.0-rc.4',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: '1.0.0',
        captureMouse: '2021-07-29T15:31:46.922Z',
        noiseSuppression: false,
        echoCancellation: false,
        bitrate: 6.0,
        sampleSize: 64,
        userHasGivenAudioAccess: false,
        userDeniedAudioAccess: false,
        keybinds: {
          constructor: () => '',
          toString: () => '2020-06-01',
          toLocaleString: () => 'foo bar',
          valueOf: () => null,
          hasOwnProperty: () => false,
          isPrototypeOf: () => false,
          propertyIsEnumerable: () => false,
        },
        embeddedLinks: true,
        displayCurrentActivity: false,
      },
      'elio@example.com',
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.default.setKeybinds(
      {
        audioInput: 'v4.0.0-rc.4',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: '1.0.0',
        captureMouse: '2021-07-29T20:12:53.196Z',
        noiseSuppression: true,
        echoCancellation: true,
        bitrate: 10000,
        sampleSize: 16,
        userHasGivenAudioAccess: false,
        userDeniedAudioAccess: false,
        keybinds: {
          constructor: () => true,
          toString: () => '2019-10-01-preview',
          toLocaleString: () => 'Foo bar',
          valueOf: () => null,
          hasOwnProperty: () => true,
          isPrototypeOf: () => true,
          propertyIsEnumerable: () => false,
        },
        embeddedLinks: true,
        displayCurrentActivity: true,
      },
      'Elio',
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.default.setKeybinds(
      {
        audioInput: '',
        audioOutput: '',
        videoInput: '',
        captureMouse: '',
        noiseSuppression: false,
        echoCancellation: true,
        bitrate: Infinity,
        sampleSize: Infinity,
        userHasGivenAudioAccess: true,
        userDeniedAudioAccess: false,
        keybinds: {
          constructor: () => false,
          toString: () => '',
          toLocaleString: () => '',
          valueOf: () => null,
          hasOwnProperty: () => true,
          isPrototypeOf: () => true,
          propertyIsEnumerable: () => true,
        },
        embeddedLinks: false,
        displayCurrentActivity: true,
      },
      '',
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.default.updateKeybinding', () => {
  test('0', () => {
    const result: any = mutations.default.updateKeybinding(
      {
        audioInput: '1.0.0',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: '^5.0.0',
        captureMouse: '2021-07-29T20:12:53.196Z',
        noiseSuppression: true,
        echoCancellation: true,
        bitrate: 6.0,
        sampleSize: 10,
        userHasGivenAudioAccess: true,
        userDeniedAudioAccess: false,
        keybinds: {
          constructor: () => '',
          toString: () => '2017-03-01',
          toLocaleString: () => 'Foo bar',
          valueOf: () => null,
          hasOwnProperty: () => true,
          isPrototypeOf: () => false,
          propertyIsEnumerable: () => true,
        },
        embeddedLinks: false,
        displayCurrentActivity: true,
      },
      {
        constructor: () => false,
        toString: () => '2019-06-01',
        toLocaleString: () => 'Foo bar',
        valueOf: () => null,
        hasOwnProperty: () => false,
        isPrototypeOf: () => true,
        propertyIsEnumerable: () => true,
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.default.updateKeybinding(
      {
        audioInput: '1.0.0',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: 'v4.0.0-rc.4',
        captureMouse: '2021-07-29T23:03:48.812Z',
        noiseSuppression: true,
        echoCancellation: true,
        bitrate: 0.0,
        sampleSize: 0,
        userHasGivenAudioAccess: true,
        userDeniedAudioAccess: true,
        keybinds: {
          constructor: () => true,
          toString: () => '2020-06-01',
          toLocaleString: () => 'Foo bar',
          valueOf: () => ({
            constructor: () => true,
            toString: () => '2019-10-01-preview',
            toLocaleString: () => 'Hello, world!',
            valueOf: () => null,
            hasOwnProperty: () => false,
            isPrototypeOf: () => true,
            propertyIsEnumerable: () => true,
          }),
          hasOwnProperty: () => true,
          isPrototypeOf: () => false,
          propertyIsEnumerable: () => false,
        },
        embeddedLinks: true,
        displayCurrentActivity: true,
      },
      {
        constructor: () => true,
        toString: () => '2020-03-01',
        toLocaleString: () => 'This is a Text',
        valueOf: () => null,
        hasOwnProperty: () => true,
        isPrototypeOf: () => true,
        propertyIsEnumerable: () => false,
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.default.updateKeybinding(
      {
        audioInput: '^5.0.0',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: '4.0.0-beta1\t',
        captureMouse: '2021-07-29T17:54:41.653Z',
        noiseSuppression: true,
        echoCancellation: true,
        bitrate: 6.0,
        sampleSize: 256,
        userHasGivenAudioAccess: false,
        userDeniedAudioAccess: true,
        keybinds: {
          constructor: () => false,
          toString: () => '2017-03-01',
          toLocaleString: () => 'foo bar',
          valueOf: () => null,
          hasOwnProperty: () => true,
          isPrototypeOf: () => false,
          propertyIsEnumerable: () => true,
        },
        embeddedLinks: false,
        displayCurrentActivity: false,
      },
      {
        constructor: () => false,
        toString: () => '2019-07-01',
        toLocaleString: () => 'Hello, world!',
        valueOf: () => null,
        hasOwnProperty: () => true,
        isPrototypeOf: () => true,
        propertyIsEnumerable: () => true,
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.default.updateKeybinding(
      {
        audioInput: '4.0.0-beta1\t',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: '1.0.0',
        captureMouse: '2021-07-29T15:31:46.922Z',
        noiseSuppression: true,
        echoCancellation: false,
        bitrate: 6.0,
        sampleSize: 0,
        userHasGivenAudioAccess: true,
        userDeniedAudioAccess: false,
        keybinds: {
          constructor: () => false,
          toString: () => '2020-06-01',
          toLocaleString: () => 'Hello, world!',
          valueOf: () => null,
          hasOwnProperty: () => false,
          isPrototypeOf: () => true,
          propertyIsEnumerable: () => true,
        },
        embeddedLinks: true,
        displayCurrentActivity: true,
      },
      {
        constructor: () => false,
        toString: () => '2019-06-01',
        toLocaleString: () => 'Foo bar',
        valueOf: () => null,
        hasOwnProperty: () => true,
        isPrototypeOf: () => false,
        propertyIsEnumerable: () => false,
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.default.updateKeybinding(
      {
        audioInput: 'v4.0.0-rc.4',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: 'v1.2.4',
        captureMouse: '2021-07-29T15:31:46.922Z',
        noiseSuppression: true,
        echoCancellation: false,
        bitrate: 300,
        sampleSize: 10,
        userHasGivenAudioAccess: true,
        userDeniedAudioAccess: false,
        keybinds: {
          constructor: () => false,
          toString: () => '2019-07-01',
          toLocaleString: () => 'Foo bar',
          valueOf: () => null,
          hasOwnProperty: () => false,
          isPrototypeOf: () => false,
          propertyIsEnumerable: () => false,
        },
        embeddedLinks: true,
        displayCurrentActivity: false,
      },
      {
        constructor: () => false,
        toString: () => '2019-06-01',
        toLocaleString: () => 'Foo bar',
        valueOf: () => null,
        hasOwnProperty: () => false,
        isPrototypeOf: () => false,
        propertyIsEnumerable: () => false,
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.default.updateKeybinding(
      {
        audioInput: '',
        audioOutput: '',
        videoInput: '',
        captureMouse: '',
        noiseSuppression: false,
        echoCancellation: false,
        bitrate: -Infinity,
        sampleSize: -Infinity,
        userHasGivenAudioAccess: false,
        userDeniedAudioAccess: false,
        keybinds: {
          constructor: () => false,
          toString: () => '',
          toLocaleString: () => '',
          valueOf: () => ({
            constructor: () => false,
            toString: () => '',
            toLocaleString: () => '',
            valueOf: () => null,
            hasOwnProperty: () => false,
            isPrototypeOf: () => false,
            propertyIsEnumerable: () => false,
          }),
          hasOwnProperty: () => true,
          isPrototypeOf: () => false,
          propertyIsEnumerable: () => true,
        },
        embeddedLinks: false,
        displayCurrentActivity: true,
      },
      {
        constructor: () => false,
        toString: () => '',
        toLocaleString: () => '',
        valueOf: () => null,
        hasOwnProperty: () => true,
        isPrototypeOf: () => true,
        propertyIsEnumerable: () => false,
      },
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.default.embeddedLinks', () => {
  test('0', () => {
    const result: any = mutations.default.embeddedLinks(
      {
        audioInput: '4.0.0-beta1\t',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: 'v1.2.4',
        captureMouse: '2021-07-29T15:31:46.922Z',
        noiseSuppression: false,
        echoCancellation: true,
        bitrate: 0,
        sampleSize: 64,
        userHasGivenAudioAccess: true,
        userDeniedAudioAccess: false,
        keybinds: {
          constructor: () => '',
          toString: () => '2020-06-01',
          toLocaleString: () => 'Foo bar',
          valueOf: () => null,
          hasOwnProperty: () => true,
          isPrototypeOf: () => true,
          propertyIsEnumerable: () => false,
        },
        embeddedLinks: false,
        displayCurrentActivity: true,
      },
      false,
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.default.embeddedLinks(
      {
        audioInput: '4.0.0-beta1\t',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: 'v1.2.4',
        captureMouse: '2021-07-29T15:31:46.922Z',
        noiseSuppression: true,
        echoCancellation: false,
        bitrate: 10000,
        sampleSize: 32,
        userHasGivenAudioAccess: false,
        userDeniedAudioAccess: false,
        keybinds: {
          constructor: () => 'return callback value',
          toString: () => '2019-10-01-preview',
          toLocaleString: () => 'This is a Text',
          valueOf: () => null,
          hasOwnProperty: () => false,
          isPrototypeOf: () => false,
          propertyIsEnumerable: () => false,
        },
        embeddedLinks: false,
        displayCurrentActivity: false,
      },
      false,
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.default.embeddedLinks(
      {
        audioInput: '1.0.0',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: '1.0.0',
        captureMouse: '2021-07-29T17:54:41.653Z',
        noiseSuppression: true,
        echoCancellation: false,
        bitrate: 10000,
        sampleSize: 256,
        userHasGivenAudioAccess: false,
        userDeniedAudioAccess: true,
        keybinds: {
          constructor: () => true,
          toString: () => '2017-03-01',
          toLocaleString: () => 'Foo bar',
          valueOf: () => ({
            constructor: () => 'return callback value',
            toString: () => '2019-07-01',
            toLocaleString: () => 'Foo bar',
            valueOf: () => null,
            hasOwnProperty: () => false,
            isPrototypeOf: () => true,
            propertyIsEnumerable: () => true,
          }),
          hasOwnProperty: () => false,
          isPrototypeOf: () => true,
          propertyIsEnumerable: () => true,
        },
        embeddedLinks: true,
        displayCurrentActivity: true,
      },
      false,
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.default.embeddedLinks(
      {
        audioInput: '1.0.0',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: 'v4.0.0-rc.4',
        captureMouse: '2021-07-30T00:05:36.818Z',
        noiseSuppression: false,
        echoCancellation: false,
        bitrate: 6.0,
        sampleSize: 256,
        userHasGivenAudioAccess: false,
        userDeniedAudioAccess: false,
        keybinds: {
          constructor: () => 'return callback value',
          toString: () => '2019-06-01',
          toLocaleString: () => 'This is a Text',
          valueOf: () => null,
          hasOwnProperty: () => true,
          isPrototypeOf: () => true,
          propertyIsEnumerable: () => true,
        },
        embeddedLinks: true,
        displayCurrentActivity: true,
      },
      false,
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.default.embeddedLinks(
      {
        audioInput: 'v1.2.4',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: 'v1.2.4',
        captureMouse: '2021-07-29T17:54:41.653Z',
        noiseSuppression: true,
        echoCancellation: false,
        bitrate: 0.0,
        sampleSize: 64,
        userHasGivenAudioAccess: true,
        userDeniedAudioAccess: true,
        keybinds: {
          constructor: () => '',
          toString: () => '2019-06-01',
          toLocaleString: () => 'Hello, world!',
          valueOf: () => null,
          hasOwnProperty: () => false,
          isPrototypeOf: () => true,
          propertyIsEnumerable: () => true,
        },
        embeddedLinks: true,
        displayCurrentActivity: true,
      },
      false,
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.default.embeddedLinks(
      {
        audioInput: '',
        audioOutput: '',
        videoInput: '',
        captureMouse: '',
        noiseSuppression: false,
        echoCancellation: false,
        bitrate: -Infinity,
        sampleSize: -Infinity,
        userHasGivenAudioAccess: true,
        userDeniedAudioAccess: false,
        keybinds: {
          constructor: () => false,
          toString: () => '',
          toLocaleString: () => '',
          valueOf: () => null,
          hasOwnProperty: () => true,
          isPrototypeOf: () => false,
          propertyIsEnumerable: () => false,
        },
        embeddedLinks: false,
        displayCurrentActivity: false,
      },
      false,
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.default.displayCurrentActivity', () => {
  test('0', () => {
    const result: any = mutations.default.displayCurrentActivity(
      {
        audioInput: 'v1.2.4',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: 'v1.2.4',
        captureMouse: '2021-07-29T17:54:41.653Z',
        noiseSuppression: false,
        echoCancellation: false,
        bitrate: 10000,
        sampleSize: 64,
        userHasGivenAudioAccess: false,
        userDeniedAudioAccess: true,
        keybinds: {
          constructor: () => true,
          toString: () => '2020-06-01',
          toLocaleString: () => 'foo bar',
          valueOf: () => null,
          hasOwnProperty: () => false,
          isPrototypeOf: () => true,
          propertyIsEnumerable: () => true,
        },
        embeddedLinks: false,
        displayCurrentActivity: true,
      },
      true,
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.default.displayCurrentActivity(
      {
        audioInput: '4.0.0-beta1\t',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: 'v1.2.4',
        captureMouse: '2021-07-29T20:12:53.196Z',
        noiseSuppression: true,
        echoCancellation: true,
        bitrate: 6.0,
        sampleSize: 10,
        userHasGivenAudioAccess: false,
        userDeniedAudioAccess: false,
        keybinds: {
          constructor: () => true,
          toString: () => '2019-06-01',
          toLocaleString: () => 'foo bar',
          valueOf: () => null,
          hasOwnProperty: () => true,
          isPrototypeOf: () => false,
          propertyIsEnumerable: () => true,
        },
        embeddedLinks: true,
        displayCurrentActivity: true,
      },
      true,
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.default.displayCurrentActivity(
      {
        audioInput: 'v4.0.0-rc.4',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: 'v4.0.0-rc.4',
        captureMouse: '2021-07-29T20:12:53.196Z',
        noiseSuppression: true,
        echoCancellation: true,
        bitrate: 6.0,
        sampleSize: 0,
        userHasGivenAudioAccess: true,
        userDeniedAudioAccess: true,
        keybinds: {
          constructor: () => true,
          toString: () => '2017-03-01',
          toLocaleString: () => 'Hello, world!',
          valueOf: () => null,
          hasOwnProperty: () => false,
          isPrototypeOf: () => true,
          propertyIsEnumerable: () => true,
        },
        embeddedLinks: true,
        displayCurrentActivity: true,
      },
      true,
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.default.displayCurrentActivity(
      {
        audioInput: '1.0.0',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: '1.0.0',
        captureMouse: '2021-07-29T20:12:53.196Z',
        noiseSuppression: true,
        echoCancellation: false,
        bitrate: 0,
        sampleSize: 16,
        userHasGivenAudioAccess: true,
        userDeniedAudioAccess: false,
        keybinds: {
          constructor: () => true,
          toString: () => '2019-07-01',
          toLocaleString: () => 'Hello, world!',
          valueOf: () => null,
          hasOwnProperty: () => false,
          isPrototypeOf: () => true,
          propertyIsEnumerable: () => false,
        },
        embeddedLinks: true,
        displayCurrentActivity: false,
      },
      true,
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.default.displayCurrentActivity(
      {
        audioInput: '^5.0.0',
        audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
        videoInput: 'v4.0.0-rc.4',
        captureMouse: '2021-07-30T00:05:36.818Z',
        noiseSuppression: true,
        echoCancellation: true,
        bitrate: 0,
        sampleSize: 256,
        userHasGivenAudioAccess: false,
        userDeniedAudioAccess: false,
        keybinds: {
          constructor: () => true,
          toString: () => '2019-06-01',
          toLocaleString: () => 'Foo bar',
          valueOf: () => null,
          hasOwnProperty: () => true,
          isPrototypeOf: () => false,
          propertyIsEnumerable: () => false,
        },
        embeddedLinks: true,
        displayCurrentActivity: false,
      },
      true,
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.default.displayCurrentActivity(
      {
        audioInput: '',
        audioOutput: '',
        videoInput: '',
        captureMouse: '',
        noiseSuppression: false,
        echoCancellation: true,
        bitrate: -Infinity,
        sampleSize: -Infinity,
        userHasGivenAudioAccess: true,
        userDeniedAudioAccess: false,
        keybinds: {
          constructor: () => false,
          toString: () => '',
          toLocaleString: () => '',
          valueOf: () => null,
          hasOwnProperty: () => true,
          isPrototypeOf: () => true,
          propertyIsEnumerable: () => true,
        },
        embeddedLinks: true,
        displayCurrentActivity: true,
      },
      false,
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations misc', () => {
  test('mutations.default.setTimezone', () => {
    const localState = {
      audioInput:
        'Reiciendis libero maiores quia commodi vitae magnam minima ut. Eos sed suscipit consectetur doloribus aut esse soluta qui ipsum. Culpa quos et sint. Id alias iste ad qui omnis numquam qui sint. Aliquam magni sit sed. Aperiam est sed distinctio sint voluptas eum consequatur minus aliquam.',
      audioOutput: 'Nostrum neque nam sit.',
      videoInput: 'vero aut sit',
      captureMouse: 'culpa',
      noiseSuppression: false,
      echoCancellation: true,
      bitrate: 17771,
      sampleSize: 67365,
      userHasGivenAudioAccess: true,
      userDeniedAudioAccess: false,
      keybinds: {},
      embeddedLinks: false,
      displayCurrentActivity: true,
      timezone: 'quis quisquam sunt',
      removeState: true,
      serverType: 'et',
      ownInfo: 'maxime',
    }
    const passedInValue = '+07:00'

    mutations.default.setTimezone(localState, passedInValue)
    expect(localState.timezone).toBe(passedInValue)
  })

  test('mutations.default.removeAppState', () => {
    const localState = {
      audioInput:
        'Reiciendis libero maiores quia commodi vitae magnam minima ut. Eos sed suscipit consectetur doloribus aut esse soluta qui ipsum. Culpa quos et sint. Id alias iste ad qui omnis numquam qui sint. Aliquam magni sit sed. Aperiam est sed distinctio sint voluptas eum consequatur minus aliquam.',
      audioOutput: 'Nostrum neque nam sit.',
      videoInput: 'vero aut sit',
      captureMouse: 'culpa',
      noiseSuppression: false,
      echoCancellation: true,
      bitrate: 17771,
      sampleSize: 67365,
      userHasGivenAudioAccess: true,
      userDeniedAudioAccess: false,
      keybinds: {},
      embeddedLinks: false,
      displayCurrentActivity: true,
      timezone: 'quis quisquam sunt',
      removeState: true,
      serverType: 'et',
      ownInfo: 'maxime',
    }
    const passedInValue = false

    mutations.default.removeAppState(localState, passedInValue)
    expect(localState.removeState).toBe(passedInValue)
  })

  test('mutations.default.setServerType', () => {
    const localState = {
      audioInput:
        'Reiciendis libero maiores quia commodi vitae magnam minima ut. Eos sed suscipit consectetur doloribus aut esse soluta qui ipsum. Culpa quos et sint. Id alias iste ad qui omnis numquam qui sint. Aliquam magni sit sed. Aperiam est sed distinctio sint voluptas eum consequatur minus aliquam.',
      audioOutput: 'Nostrum neque nam sit.',
      videoInput: 'vero aut sit',
      captureMouse: 'culpa',
      noiseSuppression: false,
      echoCancellation: true,
      bitrate: 17771,
      sampleSize: 67365,
      userHasGivenAudioAccess: true,
      userDeniedAudioAccess: false,
      keybinds: {},
      embeddedLinks: false,
      displayCurrentActivity: true,
      timezone: 'quis quisquam sunt',
      removeState: true,
      serverType: 'et',
      ownInfo: 'maxime',
    }
    const passedInValue = 'new value'

    mutations.default.setServerType(localState, passedInValue)
    expect(localState.serverType).toBe(passedInValue)
  })

  test('mutations.default.setOwnInfo', () => {
    const localState = {
      audioInput:
        'Reiciendis libero maiores quia commodi vitae magnam minima ut. Eos sed suscipit consectetur doloribus aut esse soluta qui ipsum. Culpa quos et sint. Id alias iste ad qui omnis numquam qui sint. Aliquam magni sit sed. Aperiam est sed distinctio sint voluptas eum consequatur minus aliquam.',
      audioOutput: 'Nostrum neque nam sit.',
      videoInput: 'vero aut sit',
      captureMouse: 'culpa',
      noiseSuppression: false,
      echoCancellation: true,
      bitrate: 17771,
      sampleSize: 67365,
      userHasGivenAudioAccess: true,
      userDeniedAudioAccess: false,
      keybinds: {},
      embeddedLinks: false,
      displayCurrentActivity: true,
      timezone: 'quis quisquam sunt',
      removeState: true,
      serverType: 'et',
      ownInfo: 'maxime',
    }
    const passedInValue = 'new value'

    mutations.default.setOwnInfo(localState, passedInValue)
    expect(localState.ownInfo).toBe(passedInValue)
  })
})
