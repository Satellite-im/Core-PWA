import { CaptureMouseTypes, KeybindTypes } from '~/store/settings/types'
import getters from '~/store/settings/getters'

const state = {
  audioInput: '',
  audioOutput: '',
  videoInput: '',
  captureMouse: CaptureMouseTypes.always,
  noiseSuppression: true,
  echoCancellation: true,
  bitrate: 96000,
  sampleSize: 24,
  timezone: 'Europe/Paris',
  userHasGivenAudioAccess: false,
  userDeniedAudioAccess: false,
  keybinds: KeybindTypes,
  embeddedLinks: true,
  displayCurrentActivity: true,
  removeState: false,
  serverType: 'satellite',
  ownInfo: '',
}

describe('settings.getters', () => {
  test('getTimestamp', () => {
    const actual = getters.getTimestamp(state)(1654486643615)
    expect(actual).toMatchSnapshot()
  })
  test('getFullTimestamp', () => {
    const actual = getters.getFullTimestamp(state)(1654486643615)
    expect(actual).toMatchSnapshot()
  })
})
