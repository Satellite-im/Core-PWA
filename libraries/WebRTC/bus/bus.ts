import type { SignalData } from 'simple-peer'
import Emitter from '~/libraries/WebRTC/Emitter'

export type DefaultBusOptions = {}
export type BusOptions<T> = DefaultBusOptions & T

export interface BusListeners<T> {
  message: (data: { type: string; message: T }) => void
  signal: (data: { type: string; from: string; signalData: SignalData }) => void
}

export interface Bus<T, O> extends Emitter<BusListeners<T>> {
  type: string
  onMessage: (message: T) => void
  sendMessage: (message: T, opts: BusOptions<O>) => void
  destroy: () => void
}
