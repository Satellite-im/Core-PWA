export enum WebRTCEnum {
  AUDIO = 'audio',
  VIDEO = 'video',
  SCREEN = 'screen',
  HEADPHONES = 'headphones',
}

export type WebRTC = keyof typeof WebRTCEnum
