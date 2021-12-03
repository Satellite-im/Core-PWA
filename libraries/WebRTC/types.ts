import { TypeOf } from 'io-ts'
import {
  wireDataMessage,
  wireIdentificationMessage,
  wireRefuseConnectionMessage,
  wireSignalMessage,
} from './Encoders'
import { SignalData } from 'simple-peer'

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
}

export type WireEvents = keyof WireEventListeners

export type WireIdentificationMessage = TypeOf<typeof wireIdentificationMessage>
export type WireDataMessage = TypeOf<typeof wireDataMessage>
export type WireSignalMessage = TypeOf<typeof wireSignalMessage>
export type WireRefuseConnectionMessage = TypeOf<
  typeof wireRefuseConnectionMessage
>
export interface WireMessages {
  IDENTIFICATION: WireIdentificationMessage
  DATA: WireDataMessage
  SIGNAL: WireSignalMessage
  REFUSE: WireRefuseConnectionMessage
}

export type WireMessageType = keyof WireMessages
export type WireMessage = WireMessages[WireMessageType]

export interface CallEventListeners {
  INCOMING_CALL: (data: { peerId: string }) => void
  CONNECTED: (data: { peerId: string }) => void
  HANG_UP: (data: { peerId: string }) => void
  ERROR: (data: { peerId: string; error: Error }) => void
  TRACK: (data: {
    peerId: string
    track: MediaStreamTrack
    stream: MediaStream
  }) => void
  STREAM: (data: { peerId: string; stream: MediaStream }) => void
}

export type CallEvents = keyof CallEventListeners

export enum WebRTCUserEvents {
  INCOMING_CALL = 'INCOMING_CALL',
  CALL_CONNECTED = 'CALL_CONNECTED',
  STREAM_RECEIVED = 'STREAM_RECEIVED',
  TRACK_RECEIVED = 'TRACK_RECEIVED',
  CALL_ENDED = 'CALL_ENDED',
  CALL_ANSWERED = 'CALL_ANSWERED',
  CALL_BUSY = 'CALL_BUSY',
  TYPING_START = 'TYPING_START',
  TYPING_STOP = 'TYPING_STOP',
}

export interface WebRTCUserEventListeners {
  [WebRTCUserEvents.INCOMING_CALL]: () => void
  [WebRTCUserEvents.CALL_CONNECTED]: () => void
  [WebRTCUserEvents.STREAM_RECEIVED]: () => void
  [WebRTCUserEvents.TRACK_RECEIVED]: () => void
  [WebRTCUserEvents.CALL_ENDED]: () => void
  [WebRTCUserEvents.CALL_ANSWERED]: () => void
  [WebRTCUserEvents.CALL_BUSY]: () => void
}

export enum WebRTCEvents {
  INIT = 'INIT',
  KILL = 'KILL',
  ERROR = 'ERROR',
  CLOSE = 'CLOSE',
  TRACKER_CONNECT = 'TRACKER_CONNECT',
  PEER_CONNECT = 'PEER_CONNECT',
  PEER_DATA = 'PEER_DATA',
}
export interface WebRTCEventListeners {
  [WebRTCEvents.INIT]: () => void
  [WebRTCEvents.KILL]: () => void
  [WebRTCEvents.ERROR]: (data: { error: Error }) => void
  [WebRTCEvents.CLOSE]: (data: { peerId: string }) => void
  [WebRTCEvents.TRACKER_CONNECT]: (data: { tracker: string }) => void
  [WebRTCEvents.PEER_CONNECT]: (data: { peerId: string }) => void
  [WebRTCEvents.PEER_DATA]: (data: { peerId: string; data: any }) => void
}

export type WebRTCEvent = keyof WebRTCEventListeners

export type WebRTCEventListenerOf<T extends keyof WebRTCEventListeners> =
  WebRTCEventListeners[T]

export type WebRTCEventBox = {
  [key in WebRTCEvent]?: Array<WebRTCEventListenerOf<key>>
}

export type OptionalPayload<
  T extends keyof B,
  B extends { [key in keyof B]: (...args: any[]) => any }
> = Parameters<B[T]> extends never
  ? { data?: undefined }
  : { data: Parameters<B[T]>[0] }

export type DataOf<
  T extends keyof B,
  B extends { [key in keyof B]: (...args: any[]) => any }
> = {
  at: number
  event: T
} & OptionalPayload<T, B>
