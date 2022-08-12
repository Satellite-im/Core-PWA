import { TypeOf } from 'io-ts'
import { SignalData } from 'simple-peer'
import {
  wireDataMessage,
  wireIdentificationMessage,
  wireRefuseConnectionMessage,
  wireSignalMessage,
  wireKeyboardState,
  KeyboardStates,
} from './Encoders'

export interface WireEventListeners {
  ERROR: (data: { peerId: string; error: Error }) => void
  TRACKER_CONNECT: (data: { tracker: string }) => void
  CONNECT: (data: { peerId: string }) => void
  DATA: (data: { peerId: string; data: any }) => void
  RAW_DATA: (data: { peerId: string; data: any }) => void
  CLOSE: (data: { peerId: string }) => void
  IDENTIFICATION: (data: { peerId: string }) => void
  SIGNAL: (data: { peerId: string; data: SignalData }) => void
  REFUSE: (data: { peerId: string }) => void
  TYPING_STATE: (data: {
    state: TypeOf<typeof KeyboardStates>
    peerId: string
  }) => void
}

export type WireEvents = keyof WireEventListeners

export type WireIdentificationMessage = TypeOf<typeof wireIdentificationMessage>
export type WireDataMessage = TypeOf<typeof wireDataMessage>
export type WireSignalMessage = TypeOf<typeof wireSignalMessage>
export type WireKeyboardState = TypeOf<typeof wireKeyboardState>
export type WireRefuseConnectionMessage = TypeOf<
  typeof wireRefuseConnectionMessage
>
export interface WireMessages {
  IDENTIFICATION: WireIdentificationMessage
  DATA: WireDataMessage
  SIGNAL: WireSignalMessage
  REFUSE: WireRefuseConnectionMessage
  TYPING_STATE: WireKeyboardState
}

export type WireMessageType = keyof WireMessages
export type WireMessage = WireMessages[WireMessageType]

export type Tracks = {
  audio: MediaStreamTrack
  video: MediaStreamTrack
  screen: MediaStreamTrack
}

export type TrackKind = keyof Tracks

export interface CallEventListeners {
  INCOMING_CALL: (data: { peerId: string; callId?: string }) => void
  OUTGOING_CALL: (data: { peerId: string; callId?: string }) => void
  CONNECTED: (data: { peerId: string; callId?: string }) => void
  HANG_UP: (data: { peerId: string; callId?: string }) => void
  ERROR: (data: { peerId: string; error: Error; callId?: string }) => void
  REMOTE_TRACK_RECEIVED: (data: {
    peerId: string
    callId?: string
    kind?: string
    track: MediaStreamTrack
    stream: MediaStream
  }) => void
  REMOTE_TRACK_UNMUTED: (data: {
    peerId: string
    kind?: string
    trackId: string
  }) => void
  REMOTE_TRACK_REMOVED: (data: {
    peerId: string
    callId?: string
    kind?: string
    track: MediaStreamTrack
    stream: MediaStream
  }) => void
  REMOTE_TRACK_MUTED: (data: {
    peerId: string
    kind?: string
    trackId: string
  }) => void
  STREAM: (data: {
    peerId: string
    callId?: string
    kind?: string
    stream: MediaStream
  }) => void
  TRACK_MUTE_CHANGED: (data: {
    peerId: string
    callId?: string
    kind: string
  }) => void
  LOCAL_TRACK_CREATED: (data: {
    track: MediaStreamTrack
    stream: MediaStream
    kind?: string
  }) => void
  LOCAL_TRACK_REMOVED: (data: {
    track: MediaStreamTrack
    stream: MediaStream
    kind?: string
  }) => void
  DESTROY: (data: { peerId: string; callId?: string }) => void
  ANSWERED: (data: { peerId: string; callId?: string }) => void
}

export type CallEvents = keyof CallEventListeners

export interface WebRTCEventListeners {
  INIT: () => void
  KILL: () => void
  ERROR: (data: { error: Error }) => void
  TRACKER_CONNECT: (data: { peerId: string; tracker: string }) => void
  PEER_CONNECT: (data: { peerId: string }) => void
  PEER_DISCONNECT: (data: { peerId: string }) => void
  PEER_DATA: (data: { peerId: string; data: any }) => void
}

export type WebRTCEvent = keyof WebRTCEventListeners

export type WebRTCEventListenerOf<T extends keyof WebRTCEventListeners> =
  WebRTCEventListeners[T]

export type WebRTCEventBox = {
  [key in WebRTCEvent]?: Array<WebRTCEventListenerOf<key>>
}

export type OptionalPayload<
  B extends { [key in keyof B]: (...args: any[]) => any },
  T extends keyof B,
> = Parameters<B[T]> extends never
  ? { data?: undefined }
  : { data: Parameters<B[T]>[0] }

export type DataOf<
  B extends { [key in keyof B]: (...args: any[]) => any },
  T extends keyof B,
> = {
  at: number
  event: T
} & OptionalPayload<T, B>
