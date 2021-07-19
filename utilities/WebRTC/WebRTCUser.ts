import Peer from 'simple-peer'
// @ts-ignore
import P2PT from 'p2pt'

export type CallEvent =
  | 'call-connected'
  | 'call-stream'
  | 'call-track'
  | 'call-error'
  | 'call-ended'
  | 'call-answered'
  | 'call-busy'

export type CallInternalEvent = 'track' | 'stream' | 'data' | 'connect'

type ListenersObject = { [key: string]: CallableFunction }

export default class WebRTCUser {
  identifier: string
  listeners: ListenersObject
  instance: any
  peer?: Peer.Instance
  isConnected: boolean
  secret: string
  activeCall?: Peer.Instance
  activeStream?: MediaStream
  callListener?: CallableFunction
  incomingCallData?: Peer.SignalData

  constructor(
    identifier: string,
    secret: string,
    announceURLs: Array<string> = [],
    listeners: ListenersObject
  ) {
    this.identifier = identifier
    this.secret = secret
    this.listeners = listeners
    this.isConnected = false

    this.instance = new P2PT(announceURLs, secret)

    this.instance.on('trackerconnect', this.onTrackerConnect.bind(this))

    this.instance.on('peerconnect', (peer: any) => {
      peer.on('connect', this.onConnect.bind(this))
      peer.on('error', this.onError.bind(this))
      peer.on('data', this.onData.bind(this))
      peer.on('track', this.onTrack.bind(this))
      peer.on('stream', this.onStream.bind(this))
      peer.on('close', this.onClose.bind(this))

      this.onConnect()

      this.peer = peer
    })

    this.instance.start()
  }

  /**
   * @method onTrackerConnect
   * @description Handles the callback for the tracker connection event from P2PT library
   */
  public onTrackerConnect(tracker: any, stats: any) {
    if (typeof this.listeners.onTrackerConnect === 'function') {
      this.listeners.onTrackerConnect(this.identifier, tracker, stats)
    }
  }

  /**
   * @method onDisconnect
   * @description Handles the callback for the connect event from SimplePeer
   */
  public onConnect() {
    this.isConnected = true
    if (typeof this.listeners.onConnect === 'function') {
      this.listeners.onConnect(this.identifier)
    }
  }

  /**
   * @method onError
   * @description Handles the callback for the error event from SimplePeer
   * @param error Error received from SimplePeer error event
   */
  public onError(error: Error) {
    console.error(`Failed to connect ${this.identifier}`, error)
    if (typeof this.listeners.onError === 'function') {
      this.listeners.onError(error)
    }
  }

  /**
   * @method onClose
   * @description Handles the callback for the close event from SimplePeer
   */
  public onClose() {
    this.isConnected = false
    if (typeof this.listeners.onClose === 'function') {
      this.listeners.onClose()
    }
  }

  /**
   * @method onData
   * @description Handles the callback for the data event from SimplePeer
   * @param data Data received from SimplePeer data event
   */
  public onData(data: any) {
    const decoder = new TextDecoder()
    const decodedString = decoder.decode(data)
    const parsedData = JSON.parse(decodedString)

    if (parsedData?.type === 'call-request') {
      this.incomingCallData = parsedData.data
      if (typeof this.listeners.onCall === 'function') {
        this.listeners.onCall(parsedData?.type)
      }
    } else if (parsedData?.type === 'call-answer') {
      this.activeCall?.signal(parsedData.data)
    } else if (parsedData?.type === 'call-hangup') {
      this.hangupCall()
    } else if (typeof this.listeners.onData === 'function') {
      this.listeners.onData(parsedData)
    }
  }

  /**
   * @method onTrack
   * @description Handles the callback for the track event from SimplePeer
   * @param track New track received from SimplePeer track event
   * @param stream Stream received from SimplePeer track event
   */
  public onTrack(track: MediaStreamTrack, stream: MediaStream) {
    if (typeof this.listeners.onTrack === 'function') {
      this.listeners.onTrack(track, stream)
    }
  }

  /**
   * @method onStream
   * @description Handles the callback for the steram event from SimplePeer
   * @param stream Steram received from SimplePeer stream event
   */
  public onStream(stream: MediaStream) {
    if (typeof this.listeners.onStream === 'function') {
      this.listeners.onStream(stream)
    }
  }

  /**
   * @method subscribeToCallEvents
   * @description Allows to subscribe to call events
   * @param callback Callback to be invoked when a call event occour
   */
  public subscribeToCallEvents(callback: CallableFunction) {
    this.callListener = callback
  }

  /**
   * @method emitCallEvent
   * @description Internal function to emit a new call event
   * @param event Event name to be emitted
   * @arg args List of arguments to be emitted for the given event
   */
  private emitCallEvent(event: CallEvent, ...args: any[]) {
    if (this.callListener) {
      this.callListener(event, ...args)
    }
  }

  /**
   * @method createCallPeer
   * @description Internal function to create a new SimplePeer instance
   * related to che current call
   * @param options SimplePeer options object for the call connection
   */
  private createCallPeer(options: Peer.Options): Peer.Instance {
    const callPeer = new Peer(options)

    callPeer.on('signal', (data: any) => {
      const type = data.type === 'offer' ? 'call-request' : 'call-answer'
      this.peer?.send(JSON.stringify({ type, data }))
    })

    callPeer.on('connect', () => {
      this.emitCallEvent('call-connected')
    })

    callPeer.on('stream', (stream: MediaStream) => {
      this.emitCallEvent('call-stream', stream)
    })

    callPeer.on('track', (track: MediaStreamTrack, stream: MediaStream) => {
      this.emitCallEvent('call-track', track, stream)
    })

    callPeer.on('error', (error: Error) => {
      this.emitCallEvent('call-error', error)
    })

    callPeer.on('close', () => {
      this.emitCallEvent('call-ended', this.identifier)
    })

    return callPeer
  }

  public call(stream: MediaStream) {
    if (!this.isConnected)
      return new Error('Parent connection not established.')

    if (this.activeCall) {
      console.warn('Call already active')
      return null
    }

    const callPeer = this.createCallPeer({
      initiator: true,
      trickle: false,
      stream,
    })

    this.activeCall = callPeer
    // Store the active stream to destroy it after hangup
    this.activeStream = stream
  }

  public answerCall(stream: MediaStream, sendToRemote?: boolean) {
    const callPeer = this.createCallPeer({
      initiator: false,
      trickle: false,
      stream,
    })

    if (this.incomingCallData) {
      callPeer.signal(this.incomingCallData)
    }

    this.activeCall = callPeer
    // Store the active stream to destroy it after hangup
    this.activeStream = stream

    if (sendToRemote) this.peer?.send(JSON.stringify({ type: 'call-answered' }))
  }

  public addStream(stream: any) {
    // @ts-ignore
    this.activeCall.addStream(stream)
  }

  public removeStream(stream: any) {
    // @ts-ignore
    this.activeCall.removeStream(stream)
    // @ts-ignore
  }

  public addTrack(track: any, stream: any) {
    // @ts-ignore
    this.activeCall.addTrack(track, stream)
  }

  public removeTrack(track: any, stream: any) {
    // @ts-ignore
    this.activeCall.removeTrack(track, stream)
  }

  public replaceTrack(oldTrack: any, newTrack: any, stream: any) {
    // @ts-ignore
    this.activeCall.replaceTrack(oldTrack, newTrack, stream)
  }

  public hangupCall(sendToRemote?: boolean) {
    if (this.activeCall) {
      this.activeCall?.destroy()
      this.activeCall = undefined
      this.activeStream?.getTracks().forEach(function (track) {
        track.stop()
      })
    } else {
      this.emitCallEvent('call-ended', this.identifier)
    }

    if (sendToRemote) this.peer?.send(JSON.stringify({ type: 'call-hangup' }))
  }

  public send(data: any) {
    this.peer?.send(data)
  }

  public destroy() {
    this.activeCall?.destroy()
    this.peer?.destroy()
  }
}
