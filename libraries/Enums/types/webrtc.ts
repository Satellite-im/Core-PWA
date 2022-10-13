export enum WebRTCEnum {
  AUDIO = 'audio',
  VIDEO = 'video',
  SCREEN = 'screen',
  HEADPHONES = 'headphones',
}

export type WebRTCKinds = keyof typeof WebRTCEnum
