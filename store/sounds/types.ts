export enum SoundsTypes {
  message = 'message',
  call = 'call',
  mute = 'mute',
  deafen = 'deafen',
  undeafen = 'undeafen',
  upload = 'upload',
  connected = 'connected',
}

export interface SoundsState {
  message: boolean
  call: boolean
  mute: boolean
  deafen: boolean
  undeafen: boolean
  upload: boolean
  connected: boolean
}
