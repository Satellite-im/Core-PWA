export enum ThemeKeys {
  DEFAULT = 'default',
  MOONLESS_NIGHT = 'moonlessNight',
}

export const themes: { [key in ThemeKeys]: string } = {
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
}

export const flairs: { [key in FlairKeys]: Flair } = {
  satellite: {
    name: 'Satellite',
    primary: '#2761fd',
    secondary: '#286cfe',
  },
  peach: {
    name: 'Peach',
    primary: '#ed4c67',
    secondary: '#ed5672',
  },
  pink: {
    name: 'Pink',
    primary: '#fda7df',
    secondary: '#fdb1e9',
  },
  lime: {
    name: 'Lime',
    primary: '#a3cb38',
    secondary: '#aed542',
  },
  purple: {
    name: 'Purple',
    primary: '#6f1e51',
    secondary: '#80215d',
  },
  lavender: {
    name: 'Lavender',
    primary: '#9980fa',
    secondary: '#a891ff',
  },
  sunflower: {
    name: 'Sunflower',
    primary: '#ffc312',
    secondary: '#faca3e',
  },
  deepBlue: {
    name: 'Deep Blue',
    primary: '#30336b',
    secondary: '#2d328a',
  },
  void: {
    name: 'Void',
    primary: '#2c3a47',
    secondary: '#36434f',
  },
}

export enum LanguageKeys {
  'EN_US' = 'en_US',
}

export const languages: { [key in LanguageKeys]: string } = {
  en_US: 'English (USA)',
}

export type Settings = {
  theme: ThemeKeys
  flair: FlairKeys
  language: LanguageKeys
}
