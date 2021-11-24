import { TypeOf } from 'io-ts'
import { wireDataMessage, wireIdentificationMessage } from './Encoders'

export enum WireEvents {
  TRACKER_CONNECT = 'TRACKER_CONNECT',
  CONNECT = 'CONNECT',
  ERROR = 'ERROR',
  DATA = 'DATA',
  CLOSE = 'CLOSE',
  TRACK = 'TRACK',
  STREAM = 'STREAM',
  IDENTIFICATION = 'IDENTIFICATION',
}

export interface WireEventListeners {
  [WireEvents.ERROR]: (data: { peerId: string; error: Error }) => void
  [WireEvents.TRACKER_CONNECT]: (data: { tracker: string }) => void
  [WireEvents.CONNECT]: (data: { peerId: string }) => void
  [WireEvents.DATA]: (data: { peerId: string; data: any }) => void
  [WireEvents.CLOSE]: (data: { peerId: string }) => void
  [WireEvents.TRACK]: (data: {
    peerId: string
    track: MediaStreamTrack
    stream: MediaStream
  }) => void
  [WireEvents.STREAM]: (data: { peerId: string; stream: MediaStream }) => void
  [WireEvents.IDENTIFICATION]: (data: { peerId: string }) => void
}

export enum WireMessageTypes {
  IDENTIFICATION = 'IDENTIFICATION',
  DATA = 'DATA',
  START_CALL = 'START_CALL',
  ANSWER_CALL = 'ANSWER_CALL',
  HUNG_UP_CALL = 'HUNG_UP_CALL',
}

export type WireIdentificationMessage = TypeOf<typeof wireIdentificationMessage>
export type WireDataMessage = TypeOf<typeof wireDataMessage>
export type WireMessage = WireIdentificationMessage | WireDataMessage

export enum WebRTCUserEvents {
  INCOMING_CALL = 'INCOMING_CALL',
  CALL_CONNECTED = 'CALL_CONNECTED',
  STREAM_RECEIVED = 'STREAM_RECEIVED',
  TRACK_RECEIVED = 'TRACK_RECEIVED',
  CALL_ENDED = 'CALL_ENDED',
  CALL_ANSWERED = 'CALL_ANSWERED',
  CALL_BUSY = 'CALL_BUSY',
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
