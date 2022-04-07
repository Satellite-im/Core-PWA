import Vue from 'vue'
import { Call } from './Call'

import Emitter from '~/libraries/WebRTC/Emitter'
import { WebRTCEventListeners } from '~/libraries/WebRTC/types'
import { WebRTCError } from '~/store/webrtc/types'

export default class WebRTC extends Emitter<WebRTCEventListeners> {
  // Identifier to connect to signaling server with
  originator?: string
  // If this is undefined, the WebRTC services cannot run
  initialized?: boolean
  peers: Map<string, Call>

  // --- Internal ---
  //
  // List of functions to execute after init
  protected _fnQueue: Array<Function>

  constructor() {
    super()
    this._fnQueue = []
    this.peers = new Map()
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
    this.emit('INIT')

    Vue.prototype.$Logger.log('WebRTC', 'Initialized', {
      originator: this.originator,
    })
  }

  /**
   * @computed peerCount
   * @description Get the total count of connected peers
   * @returns
   * @example
   */
  get peerCount(): number {
    return this.peers ? this.peers.size : 0
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
   * @param peerId identifier of peer we're connecting to
   * @param channel Secret communication channel you want to connect with
   * @returns
   * @example
   */
  connect(peerId: string): Call {
    if (!this.initialized || !this.originator) {
      throw new Error(WebRTCError.NOT_INITIALIZED)
    }

    // Avoid multiple connections to the same peer
    if (this.peers.has(peerId)) {
      const peer = this.getPeer(peerId)
      if (!peer) {
        throw new Error(WebRTCError.PEER_NOT_FOUND)
      }
    }

    const peer = new Call(peerId)
    this.peers.set(peerId, peer)
    return peer
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
  exists(peerId: string): boolean {
    if (!this.peers) return false
    return this.peers.has(peerId)
  }

  /**
   * @method getPeer
   * @description Get a Call from the list of connected peers
   * @param peerId identifier of peer we're seeking
   * @returns
   * @example
   */
  getPeer(peerId: string): Call | undefined {
    return this.peers.get(peerId)
  }
}
