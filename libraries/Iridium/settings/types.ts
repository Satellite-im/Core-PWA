import { Sounds } from '~/libraries/SoundManager/SoundManager'
import { hexToRGB } from '~/utilities/Colors'

export enum ThemeKeys {
  DEFAULT = 'default',
  MOONLESS_NIGHT = 'moonlessNight',
}

export const themes: Record<ThemeKeys, string> = {
  default: 'Default',
  moonlessNight: 'Moonless Night',
}

export enum FlairKeys {
  SATELLITE = 'satellite',
  PEACH = 'peach',
  PINK = 'pink',
  LIME = 'lime',
  PURPLE = 'purple',
  LAVENDER = 'lavender',
  SUNFLOWER = 'sunflower',
  DEEPBLUE = 'deepBlue',
  VOID = 'void',
}

export type Flair = {
  name: string
  primary: string
  secondary: string
  primaryRGB: string
}

function flairDefinition(flair: Omit<Flair, 'primaryRGB'>): Flair {
  return {
    ...flair,
    primaryRGB: hexToRGB(flair.primary),
  }
}

export const flairs: Record<FlairKeys, Flair> = {
  satellite: flairDefinition({
    name: 'Satellite',
    primary: '#2761fd',
    secondary: '#286cfe',
  }),
  peach: flairDefinition({
    name: 'Peach',
    primary: '#ed4c67',
    secondary: '#ed5672',
  }),
  pink: flairDefinition({
    name: 'Pink',
    primary: '#fda7df',
    secondary: '#fdb1e9',
  }),
  lime: flairDefinition({
    name: 'Lime',
    primary: '#a3cb38',
    secondary: '#aed542',
  }),
  purple: flairDefinition({
    name: 'Purple',
    primary: '#6f1e51',
    secondary: '#80215d',
  }),
  lavender: flairDefinition({
    name: 'Lavender',
    primary: '#9980fa',
    secondary: '#a891ff',
  }),
  sunflower: flairDefinition({
    name: 'Sunflower',
    primary: '#ffc312',
    secondary: '#faca3e',
  }),
  deepBlue: flairDefinition({
    name: 'Deep Blue',
    primary: '#30336b',
    secondary: '#2d328a',
  }),
  void: flairDefinition({
    name: 'Void',
    primary: '#2c3a47',
    secondary: '#36434f',
  }),
}

export enum LanguageKeys {
  'EN_US' = 'en_US',
}

export const languages: Record<LanguageKeys, string> = {
  en_US: 'English (USA)',
}

export const defaultSounds = Object.fromEntries(
  Object.values(Sounds).map((key) => [key, true]),
) as Record<Sounds, boolean>

export enum KeybindKeys {
  TOGGLE_MUTE = 'toggleMute',
  TOGGLE_DEAFEN = 'toggleDeafen',
  OPEN_SETTINGS = 'openSettings',
  CALL_ACTIVE_CHAT = 'callActiveChat',
}

export const defaultKeybinds: Record<KeybindKeys, string> = {
  [KeybindKeys.TOGGLE_MUTE]: 'alt+m',
  [KeybindKeys.TOGGLE_DEAFEN]: 'alt+d',
  [KeybindKeys.OPEN_SETTINGS]: 'alt+s',
  [KeybindKeys.CALL_ACTIVE_CHAT]: 'alt+c',
}

export type Settings = {
  theme: ThemeKeys
  flair: FlairKeys
  language: LanguageKeys
  video: {
    flipLocalStream: boolean
  }
  audio: {
    sounds: Record<Sounds, boolean>
  }
  keybinds: Record<KeybindKeys, string>
  privacy: {
    embeddedLinks: boolean
    displayCurrentActivity: boolean
    consentToScan: boolean
    blockNsfw: boolean
  }
}
