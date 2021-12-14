type StreamType = 'local' | 'remote'
type AudioStream = typeof Audio
export default class StreamManager {
  _contraints: MediaStreamConstraints
  _localStreams: { [key: string]: MediaStream }
  _remoteStreams: { [key: string]: MediaStream }
  _localAudio: { [key: string]: AudioStream }
  _remoteAudio: { [key: string]: AudioStream }
  
  constructor (constraints: MediaStreamConstraints) {
    this._contraints = constraints
    this._localStreams = {}
    this._remoteStreams = {}
    this._localAudio = {}
    this._remoteAudio = {}
  }

  get constraints () {
    return this._contraints
  }

  get localStreams () {
    return this._localStreams
  }

  get remoteStreams () {
    return this._remoteStreams
  }

  public updateConstraints (constraints: MediaStreamConstraints) {
    console.log(`StreamManager: updateConstraints(${constraints})`)
    this._contraints = constraints
  }

  public addLocalStream (identifier: string, stream: MediaStream) {
    console.log(`$StreamManager: addLocalStream(${identifier}, ${stream})`)
    if (this._localStreams[identifier]) {
      console.warn('Local stream already exist')
      return
    }
    this._localStreams[identifier] = stream
  }

  public addRemoteStream (identifier: string, stream: MediaStream) {
    console.log(`$StreamManager: addRemoteStream(${identifier}, ${stream})`)
    if (this._remoteStreams[identifier]) {
      console.warn('Remote stream already exist')
      return
    }
    this._remoteStreams[identifier] = stream
  }

  public toggleLocalStreams (muted: boolean, video: boolean) {
    console.log(`$StreamManager: toggleLocalStreams(${muted}, ${video})`)
    if (typeof muted === 'undefined') return

    Object.entries<MediaStream>(this._localStreams).forEach(
      ([identifier, stream]) => {
        stream.getAudioTracks().forEach(track => {
          track.enabled = !muted
        })

        if (typeof video === 'undefined') return

        stream.getVideoTracks().forEach(track => {
          track.enabled = video
        })
      }
    )
  }

  public toggleRemoteStreams (muted: boolean, video: boolean) {
    console.log(`$StreamManager: toggleRemoteStreams(${muted}, ${video})`)
    if (typeof muted === 'undefined') return

    Object.values<MediaStream>(this._remoteStreams).forEach(stream => {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !muted
      })

      if (typeof video === 'undefined') return

      stream.getVideoTracks().forEach(track => {
        track.enabled = video
      })
    })
  }


  public toggleLocalVideo(enable: boolean) {
    console.log(`$StreamManager: toggleLocalVideo(${enable})`)
    Object.entries<MediaStream>(this._localStreams).forEach(
      async ([identifier, stream]) => {
        let videoTracks = stream.getVideoTracks()
        videoTracks.forEach(track => { track.enabled = enable })
      }
    )
  }

  private stopAllTracks (stream: MediaStream) {
    console.log(`$StreamManager: stopAllTracks(${stream})`)
    stream.getAudioTracks().forEach(track => {
      track.stop()
    })
    stream.getVideoTracks().forEach(track => {
      track.stop()
    })
  }

  private killStreamsByType (streamType: StreamType) {
    console.log(`$StreamManager: killStreamsByType(${streamType})`)
    const propertyName = `_${streamType}Streams`
    // @ts-ignore
    Object.values<MediaStream>(this[propertyName]).forEach(this.stopAllTracks)
    // @ts-ignore
    this[propertyName] = {}
  }

  public playStream (streamType: StreamType, identifier: string) {
    console.log(`$StreamManager: playStream(${streamType}, ${identifier})`)
    const streamTypeId = `_${streamType}Streams`
    const audioTypeId = `_${streamType}Audio`
    // @ts-ignore
    const stream: MediaStream | undefined = this[streamTypeId][identifier]

    if (!stream) {
      console.warn('playStream: Stream not found')
      return
    }
    // @ts-ignore
    if (this[audioTypeId]?.[identifier]) {
      console.warn('Audio stream already active')
      return
    }

    const audioStream = new Audio()
    audioStream.muted = false
    audioStream.srcObject = stream
    audioStream.play()
    // @ts-ignore
    this[audioTypeId] = audioStream
  }

  public stopStream (streamType: StreamType, identifier: string) {
    console.log(`$StreamManager: stopStream(${streamType}, ${identifier})`)
    const streamTypeId = `_${streamType}Streams`
    const audioTypeId = `_${streamType}Audio`
    // @ts-ignore
    const stream: MediaStream | undefined = this[streamTypeId][identifier]

    if (!stream) {
      console.warn('stopStream: Stream not found')
      return
    }

    this.stopAllTracks(stream)
    // @ts-ignore
    delete this[streamTypeId][identifier]
    // @ts-ignore
    const audioStream = this[audioTypeId]?.[identifier]
    
    if (audioStream) {
      audioStream.pause()
      // @ts-ignore
      delete this[audioTypeId][identifier]
    }
  }

  public killAllStreams () {
    console.log(`$StreamManager: killAllStreams`)
    this.killStreamsByType('local')
    this.killStreamsByType('remote')
  }
}
