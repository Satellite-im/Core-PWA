export enum WebRTCEnum {
  AUDIO = 'audio',
  VIDEO = 'video',
  SCREEN = 'screen',
}

export type WebRTC = keyof typeof WebRTCEnum
