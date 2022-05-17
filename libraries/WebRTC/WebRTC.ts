import Vue from 'vue'
import type { SignalData } from 'simple-peer'
import { Call, CallPeerDescriptor } from './Call'

import Emitter from '~/libraries/WebRTC/Emitter'
import { WebRTCEventListeners } from '~/libraries/WebRTC/types'
import { WebRTCError } from '~/store/webrtc/types'

export default class WebRTC extends Emitter<WebRTCEventListeners> {
  // Identifier to connect to signaling server with
  originator?: string
  // If this is undefined, the WebRTC services cannot run
  initialized?: boolean
  calls: Map<string, Call>

  // --- Internal ---
  //
  // List of functions to execute after init
  protected _fnQueue: Array<Function>

  constructor() {
    super()
    this._fnQueue = []
    this.calls = new Map()
  }

  /**
   * @method init
   * @description Bind required startup data to the WebRTC class
   * @param originator identifier of the current user
   * @example
   */
  init(originator: string) {
    this.originator = originator

    this.initialized = true
    this._runQueue()
    super.emit('INIT')

    Vue.prototype.$Logger.log('WebRTC', 'Initialized', {
      originator: this.originator,
    })
  }

  /**
   * @computed callCount
   * @description Get the total count of connected calls
   * @returns
   * @example
   */
  get callCount(): number {
    return this.calls ? this.calls.size : 0
  }

  // --- Private Methods ---
  //
  // Methods reserved for internal use

  /**
   * @method _queue
   * @description Queue functions that are executed before init for execution later
   * @param fn
   */
  protected _queue(fn: Function) {
    this._fnQueue.push(fn)
  }

  /**
   * @method _runQueue
   * @description Execute all queued functions
   */
  protected _runQueue() {
    this._fnQueue.forEach((fn) => fn())
  }

  /**
   * @method _connect
   * @description Internal abstraction of connect to allow for connection queueing
   * @param callId identifier of call we're connecting to
   * @param channel Secret communication channel you want to connect with
   * @returns
   * @example
   */
  connect(
    callId: string,
    peers?: CallPeerDescriptor[],
    peerSignals?: { [key: string]: SignalData },
  ): Call {
    if (!this.initialized || !this.originator) {
      throw new Error(WebRTCError.NOT_INITIALIZED)
    }

    let call = this.calls.get(callId)
    if (call) {
      // @ts-ignore
      call.peerSignals = peerSignals
      return call
    }

    call = new Call(callId, peers, peerSignals)
    this.calls.set(callId, call)
    return call
  }

  // --- Public Methods ---
  //
  // Methods who are exposed for interaction

  /**
   * @method exists
   * @description Check if we are connected to a given peer by ID
   * @param peerId identifier of peer we're seeking
   * @returns
   * @example
   */
  exists(callId: string): boolean {
    return this.calls?.has(callId)
  }

  /**
   * @method getCall
   * @description Get a Call from the list of connected calls
   * @param peerId identifier of group or peer we're seeking
   * @returns
   * @example
   */
  getCall(callId: string): Call | undefined {
    return this.calls?.get(callId)
  }

  /**
   * @method destroyCall
   * @description Remove a call from the list of connected calls
   * @param peerId identifier of group or peer we're seeking
   */
  destroyCall(callId: string) {
    const call = this.calls.get(callId)
    if (!call) {
      return
    }
    call.destroy(true, false)
    this.calls.delete(callId)
  }
}

export const $WebRTC = new WebRTC()
