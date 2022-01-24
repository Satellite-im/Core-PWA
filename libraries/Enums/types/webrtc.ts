export enum WebRTCEnum {
  AUDIO = 'audio',
  VIDEO = 'video',
}

export type WebRTC = keyof typeof WebRTCEnum
