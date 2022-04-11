import * as getters from '~/store/settings/getters'

describe('getters.default.getTimezone', () => {
  test('0', () => {
    const result: any = getters.default.getTimezone({
      audioInput: 'v1.2.4',
      audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
      videoInput: '1.0.0',
      captureMouse: '2021-07-29T23:03:48.812Z',
      noiseSuppression: false,
      echoCancellation: false,
      bitrate: 0,
      sampleSize: 256,
      userHasGivenAudioAccess: true,
      userDeniedAudioAccess: false,
      keybinds: {},
      embeddedLinks: true,
      displayCurrentActivity: false,
      timezone: 'Europe/Paris',
      removeState: true,
      serverType: 'UPDATE Projects SET pname = %s WHERE pid = %s',
      ownInfo: '4.0.0-beta1\t',
    })
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = getters.default.getTimezone({
      audioInput: '4.0.0-beta1\t',
      audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
      videoInput: '4.0.0-beta1\t',
      captureMouse: '2021-07-29T15:31:46.922Z',
      noiseSuppression: true,
      echoCancellation: true,
      bitrate: 300,
      sampleSize: 64,
      userHasGivenAudioAccess: true,
      userDeniedAudioAccess: false,
      keybinds: {},
      embeddedLinks: true,
      displayCurrentActivity: true,
      timezone: 'Asia/Yakutsk',
      removeState: true,
      serverType: 'DELETE FROM Projects WHERE pid = %s',
      ownInfo: '1.0.0',
    })
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = getters.default.getTimezone({
      audioInput: 'v4.0.0-rc.4',
      audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
      videoInput: '4.0.0-beta1\t',
      captureMouse: '2021-07-29T17:54:41.653Z',
      noiseSuppression: true,
      echoCancellation: true,
      bitrate: 6.0,
      sampleSize: 32,
      userHasGivenAudioAccess: false,
      userDeniedAudioAccess: true,
      keybinds: {},
      embeddedLinks: false,
      displayCurrentActivity: false,
      timezone: 'Europe/Paris',
      removeState: true,
      serverType: 'DROP TABLE tmp;',
      ownInfo: '^5.0.0',
    })
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = getters.default.getTimezone({
      audioInput: 'v4.0.0-rc.4',
      audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
      videoInput: '1.0.0',
      captureMouse: '2021-07-29T17:54:41.653Z',
      noiseSuppression: false,
      echoCancellation: false,
      bitrate: 0.0,
      sampleSize: 64,
      userHasGivenAudioAccess: false,
      userDeniedAudioAccess: true,
      keybinds: {},
      embeddedLinks: true,
      displayCurrentActivity: false,
      timezone: 'Asia/Tehran',
      removeState: false,
      serverType:
        "SELECT * FROM Movies WHERE Title=’Jurassic Park’ AND Director='Steven Spielberg';",
      ownInfo: '^5.0.0',
    })
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = getters.default.getTimezone({
      audioInput: 'v4.0.0-rc.4',
      audioOutput: '/PDFData/rothfuss/data/UCF101/prepared_videos',
      videoInput: '4.0.0-beta1\t',
      captureMouse: '2021-07-29T23:03:48.812Z',
      noiseSuppression: true,
      echoCancellation: false,
      bitrate: 0.0,
      sampleSize: 256,
      userHasGivenAudioAccess: true,
      userDeniedAudioAccess: false,
      keybinds: {},
      embeddedLinks: false,
      displayCurrentActivity: true,
      timezone: 'Europe/Berlin',
      removeState: true,
      serverType: 'UPDATE Projects SET pname = %s WHERE pid = %s',
      ownInfo: '1.0.0',
    })
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = getters.default.getTimezone({
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
      keybinds: {},
      embeddedLinks: true,
      displayCurrentActivity: false,
      timezone: '',
      removeState: false,
      serverType: '',
      ownInfo: '',
    })
    expect(result).toMatchSnapshot()
  })
})
