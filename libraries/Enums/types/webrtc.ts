export enum WebRTCEnum {
  AUDIO = 'Audio',
  VIDEO = 'Video',
}

export type WebRTC = keyof typeof WebRTCEnum
