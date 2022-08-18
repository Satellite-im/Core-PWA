import { expect } from '@jest/globals'
import { CaptureMouseTypes, KeybindTypes } from './types'
import InitialSettingsState from '~/store/settings/state'

describe('init', () => {
  let inst: any

  beforeEach(() => {
    inst = InitialSettingsState()
  })

  it('should return the initial settings state', () => {
    //  Due to timezone property being different in many developers, we will manually insert each field rather than using snapshot
    expect(inst).toMatchObject({
      audioInput: '',
      audioOutput: '',
      videoInput: '',
      captureMouse: CaptureMouseTypes.always,
      noiseSuppression: true,
      echoCancellation: true,
      bitrate: 96000,
      sampleSize: 24,
      userHasGivenAudioAccess: false,
      userDeniedAudioAccess: false,
      keybinds: KeybindTypes,
      embeddedLinks: true,
      displayCurrentActivity: true,
    })
  })

  it('should not return the initial settings state', () => {
    expect(inst).not.toEqual({})
  })
})
