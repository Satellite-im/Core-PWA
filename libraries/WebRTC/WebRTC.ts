import Vue from 'vue'
import { Peer } from './Peer'
import { Config } from '~/config'

import Emitter from '~/libraries/WebRTC/Emitter'
import { Wire } from '~/libraries/WebRTC/Wire'
import { WebRTCEventListeners, WireEvents } from '~/libraries/WebRTC/types'
import { WebRTCError } from '~/store/webrtc/types'

export default class WebRTC extends Emitter<WebRTCEventListeners> {
  // Identifier to connect to signaling server with
  originator?: string
  // If this is undefined, the WebRTC services cannot run
  initialized?: boolean
  // List of peers we're actively or have been connected to
  peers: Map<string, Peer>

  // --- Internal ---
  //
  // List of functions to execute after init
  protected _fnQueue: Array<Function>
  protected _announceURLs: Array<string> = Config.webtorrent.trackerURLS || []

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
      announceURLs: this._announceURLs,
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
   * @method setAnnounceURLs
   * @description Allow to specify different WebTorrent announce URLs for the signaling
   * @param announceURLs list of announce urls
   * @example
   */
  setAnnounceURLs(option: string) {
    /* only set urls when NUXT_ENV_DEVELOPMENT_TRACKER does not exist */
    if (!Config.webtorrent.trackerURLS) {
      this._announceURLs =
        option === 'public'
          ? Config.webtorrent.publicURLs
          : [
              ...Config.webtorrent.satelliteURLS,
              ...Config.webtorrent.publicURLs,
            ]
    }
  }

  /**
   * @method _connect
   * @description Internal abstraction of connect to allow for connection queueing
   * @param peerId identifier of peer we're connecting to
   * @param channel Secret communication channel you want to connect with
   * @returns
   * @example
   */
  protected _connect(peerId: string, channel: string): void {
    if (!this.initialized || !this.originator) {
      throw new Error(WebRTCError.NOT_INITIALIZED)
    }

    // Avoid multiple connections to the same peer
    if (this.peers.has(peerId)) {
      return
    }

    const peer = new Peer(this.originator, peerId, channel, this._announceURLs)

    this._bindWireListeners(peer.communicationBus)

    this.peers.set(peerId, peer)
  }

  protected _bindWireListeners(wire: Wire) {
    wire.on('CONNECT', ({ peerId }) => {
      this.emit('PEER_CONNECT', { peerId })
    })

    wire.on('DATA', ({ peerId, data }) => {
      Vue.prototype.$Logger.log('WebRTC', 'DATA', { peerId, data })
    })

    wire.on('ERROR', ({ peerId, error }) => {
      this.emit('ERROR', { error })
      Vue.prototype.$Logger.log('WebRTC', 'ERROR', { peerId, error })
    })
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
   * @description Get a Wire from the list of connected peers
   * @param peerId identifier of peer we're seeking
   * @returns
   * @example
   */
  getPeer(peerId: string): Peer | undefined {
    return this.peers.get(peerId)
  }

  /**
   * @method connect
   * @description Connect to a new peer
   * @param peerId identifier of peer we're connecting to
   * @param channel Secret communication channel you want to connect with
   * @example
   */
  connect(peerId: string, channel: string) {
    if (!this.initialized) {
      this._queue(() => this._connect(peerId, channel))
    } else {
      this._connect(peerId, channel)
    }
  }
}
