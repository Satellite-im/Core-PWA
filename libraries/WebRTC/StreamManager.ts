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
    this._contraints = constraints
  }

  public addLocalStream (identifier: string, stream: MediaStream) {
    if (this._localStreams[identifier]) {
      console.warn('Local stream already exist')
      return
    }
    this._localStreams[identifier] = stream
  }

  public addRemoteStream (identifier: string, stream: MediaStream) {
    if (this._remoteStreams[identifier]) {
      console.warn('Remote stream already exist')
      return
    }
    this._remoteStreams[identifier] = stream
  }

  public toggleLocalStreams (muted: boolean, video: boolean) {
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
    Object.entries<MediaStream>(this._localStreams).forEach(
      async ([identifier, stream]) => {
        let videoTracks = stream.getVideoTracks()
        videoTracks.forEach(track => { track.enabled = enable })
      }
    )
  }

  private stopAllTracks (stream: MediaStream) {
    stream.getAudioTracks().forEach(track => {
      track.stop()
    })
    stream.getVideoTracks().forEach(track => {
      track.stop()
    })
  }

  private killStreamsByType (streamType: StreamType) {
    const propertyName = `_${streamType}Streams`
    // @ts-ignore
    Object.values<MediaStream>(this[propertyName]).forEach(this.stopAllTracks)
    // @ts-ignore
    this[propertyName] = {}
  }

  public playStream (streamType: StreamType, identifier: string) {
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
    this.killStreamsByType('local')
    this.killStreamsByType('remote')
  }
}
