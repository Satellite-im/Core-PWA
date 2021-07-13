import { WebRTCUser } from '~/types/webrtc/User'

export default class WebRTC {
  // Identifier to connect to signaling server with
  id: string | undefined
  // If this is undefined, the WebRTC services cannot run
  initalized: boolean | undefined
  // List of peers we're actively or have been connected to
  peers: Map<string, WebRTCUser> | undefined

  // --- Internal ---
  //
  // List of functions to execute after init
  _fnQueue: Array<Function>

  constructor() {
    this._fnQueue = []
    this.peers = new Map()
  }

  /** @method
   * Bind required startup data to the WebRTC class
   * @id identifier to connect to the signaling server with
   */
  init(id: string) {
    this.id = id

    this.initalized = true
    this._runQueue()
  }

  /** @computed
   * Get the total count of connected peers
   */
  get peerCount(): number {
    return this.peers ? this.peers.size : 0
  }

  // --- Private Methods ---
  //
  // Methods reserved for internal use

  /** @method
   * Queue functions that are exectued before init for execution later
   */
  protected _queue(fn: Function) {
    this._fnQueue.push(fn)
  }

  /** @method
   * Execute all queued functions
   */
  protected _runQueue() {
    this._fnQueue.forEach((fn) => fn())
  }

  /** @method
   * Internal abstraction of connect to allow for
   * connection queueing
   * @peerId identifier of peer we're connecting to
   */
  protected _connect(peerId: string): void {
    console.log('connecting to', peerId)
    return undefined
  }

  // --- Public Methods ---
  //
  // Methods who are exposed for interaction

  /** @method
   * Check if we are connected to a given peer by ID
   * @peerId identifier of peer we're seeking
   */
  connected(peerId: string): boolean {
    if (!this.peers) return false
    return this.peers.has(peerId)
  }

  /** @method
   * Get a WebRTCUser from the list of connected peers
   * @peerId identifier of peer we're seeking
   */
  getPeer(peerId: string): WebRTCUser | undefined {
    return this.peers?.get(peerId)
  }

  /** @method
   * Connect to a new peer
   * @peerId identifier of peer we're connecting to
   */
  connect(peerId: string) {
    if (!this.initalized) {
      this._queue(() => this._connect(peerId))
    } else {
      this._connect(peerId)
    }
  }
}
