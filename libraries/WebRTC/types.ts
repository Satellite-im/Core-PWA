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
  ERROR: (data: { did: string; error: Error }) => void
  TRACKER_CONNECT: (data: { tracker: string }) => void
  CONNECT: (data: { did: string }) => void
  DATA: (data: { did: string; data: any }) => void
  RAW_DATA: (data: { did: string; data: any }) => void
  CLOSE: (data: { did: string }) => void
  IDENTIFICATION: (data: { did: string }) => void
  SIGNAL: (data: { did: string; data: SignalData }) => void
  REFUSE: (data: { did: string }) => void
  TYPING_STATE: (data: {
    state: TypeOf<typeof KeyboardStates>
    did: string
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
  INCOMING_CALL: (data: {
    did: string
    callId?: string
    data: SignalData
  }) => void
  OUTGOING_CALL: (data: { did: string; callId?: string }) => void
  CONNECTED: (data: { did: string; callId?: string }) => void
  HANG_UP: (data: { did: string; callId?: string }) => void
  ERROR: (data: { did: string; error: Error; callId?: string }) => void
  REMOTE_TRACK_RECEIVED: (data: {
    did: string
    callId?: string
    kind?: string
    track: MediaStreamTrack
    stream: MediaStream
  }) => void
  REMOTE_TRACK_UNMUTED: (data: {
    did: string
    kind?: string
    trackId: string
  }) => void
  REMOTE_TRACK_REMOVED: (data: {
    did: string
    callId?: string
    kind?: string
    track: MediaStreamTrack
    stream: MediaStream
  }) => void
  REMOTE_TRACK_MUTED: (data: {
    did: string
    kind?: string
    trackId: string
  }) => void
  STREAM: (data: {
    did: string
    callId?: string
    kind?: string
    stream: MediaStream
  }) => void
  TRACK_MUTE_CHANGED: (data: {
    did: string
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
  LOCAL_TRACK_UNMUTED: (data: {
    track: MediaStreamTrack
    stream: MediaStream
    kind?: string
  }) => void
  DESTROY: (data: { did: string; callId?: string }) => void
  ANSWERED: (data: { did: string; callId?: string }) => void
}

export type CallEvents = keyof CallEventListeners

export interface WebRTCEventListeners {
  INIT: () => void
  KILL: () => void
  ERROR: (data: { error: Error }) => void
  TRACKER_CONNECT: (data: { did: string; tracker: string }) => void
  PEER_CONNECT: (data: { did: string }) => void
  PEER_DISCONNECT: (data: { did: string }) => void
  PEER_DATA: (data: { did: string; data: any }) => void
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
