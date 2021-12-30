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
  message: Boolean,
  call: Boolean,
  mute: Boolean,
  deafen: Boolean,
  undeafen: Boolean,
  upload: Boolean,
  connected: Boolean,
}