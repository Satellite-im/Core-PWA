import { AudioState } from '~/store/audio/types'

const IS_TALKING_SENSITIVITY = 10 // %
const TALKING_OFF_DELAY = 500 // ms

export class AudioStreamUtils {
  stream: MediaStream
  audio: AudioState | null = null

  requestId: number | null = null
  level = 0
  isTalking = false

  constructor(stream: MediaStream, audio?: AudioState) {
    this.stream = stream
    this.audio = audio || null
  }

  public start() {
    this.listenToMicLevel()
  }

  public destroy() {
    this.stopListeningToMicLevel()
  }

  private listenToMicLevel = () => {
    if (!this.stream?.active) {
      return
    }
    const audioContext = new AudioContext()
    const gainNode = audioContext.createGain()
    const analyser = audioContext.createAnalyser()
    const microphone = audioContext.createMediaStreamSource(this.stream)
    const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1)

    analyser.smoothingTimeConstant = 0

    microphone.connect(gainNode)
    gainNode.connect(analyser)
    analyser.connect(javascriptNode)
    javascriptNode.connect(audioContext.destination)

    const array = new Uint8Array(analyser.frequencyBinCount)

    const updateState = () => {
      if (!this.audio) {
        console.error('No audio state')
        return
      }
      // Update gain based on inputVolume
      gainNode.gain.setValueAtTime(
        this.audio.inputVolume / 100,
        audioContext.currentTime,
      )
      this.requestId = requestAnimationFrame(updateState)

      analyser.getByteFrequencyData(array)
      let values = 0

      const length = array.length
      for (let i = 0; i < length; i++) {
        values += array[i]
      }

      this.level = values / length
      this.updateIsTalking(this.level)
    }

    updateState()
  }

  private stopListeningToMicLevel() {
    if (this.requestId) {
      cancelAnimationFrame(this.requestId)
      this.requestId = null
    }
  }

  private updateIsTalking(micLevel: number) {
    const talking = Math.round(micLevel) > IS_TALKING_SENSITIVITY
    let talkingOffBuffer

    if (!talking && this.isTalking) {
      talkingOffBuffer = setTimeout(() => {
        this.isTalking = false
      }, TALKING_OFF_DELAY)
    } else if (talking && !this.isTalking) {
      this.isTalking = true

      if (talkingOffBuffer) {
        clearTimeout(talkingOffBuffer)
      }
    }
  }
}
