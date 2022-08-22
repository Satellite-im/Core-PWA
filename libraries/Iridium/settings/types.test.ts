import { themes, languages, defaultKeybinds, KeybindKeys } from './types'

describe('themes', () => {
    test('check themes export type', () => {
        expect(themes).toEqual({
            default: 'Default',
            moonlessNight: 'Moonless Night',
        })
      })
    }) 

describe('languages', () => {
    test('check languages export type', () => {
        expect(languages).toEqual({
            en_US: 'English (USA)',
        })
      })
    }) 

describe('defaultKeybinds', () => {
    test('check defaultKeybinds export type', () => {
        expect(defaultKeybinds).toEqual({
            [KeybindKeys.TOGGLE_MUTE]: 'alt+m',
            [KeybindKeys.TOGGLE_DEAFEN]: 'alt+d',
            [KeybindKeys.OPEN_SETTINGS]: 'alt+s',
            [KeybindKeys.CALL_ACTIVE_CHAT]: 'alt+c',
        })
      })
    }) 