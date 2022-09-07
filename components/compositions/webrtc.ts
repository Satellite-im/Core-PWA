import { reactive, computed } from 'vue'
import iridium from '~/libraries/Iridium/IridiumManager'
import { CallPeerStreams } from '~/libraries/WebRTC/Call'

export const withState = <T extends { [key: string]: any }>(
  target: T,
  state: any,
) => {
  Object.keys(state).forEach((prop) => {
    target[prop] = computed(() => state[prop], {
      onTrigger: (event) => console.log('MANUEL trigger', event),
    })
  })
  return target
}

type StreamsStore = {
  streams: { [did: string]: CallPeerStreams }
  screenStreams: { [did: string]: string }
}

const store = reactive<StreamsStore>({ streams: {}, screenStreams: {} })

iridium.webRTC.on('callConnected', () => {
  if (!iridium.webRTC.state.activeCall?.callId) return

  const call = iridium.webRTC.state.calls.get(
    iridium.webRTC.state.activeCall?.callId,
  )

  if (!call) return

  function onTrackChange() {
    console.log('ON TRACK CHANGE')
    store.streams = { ...call?.streams }
    store.screenStreams = { ...call?.screenStreams }
  }

  call.on('REMOTE_TRACK_RECEIVED', onTrackChange)
  call.on('REMOTE_TRACK_REMOVED', onTrackChange)
  call.on('REMOTE_TRACK_MUTED', onTrackChange)
  call.on('REMOTE_TRACK_UNMUTED', onTrackChange)

  console.log('subscribed to track change')
})

// iridium.webRTC.on('callAnswered', () => {
//   console.log('MANUEL Call answered', { ...iridium.webRTC.state })
// })

export function useWebrtc() {
  const webrtc = withState<StreamsStore>(
    { streams: {}, screenStreams: {} },
    store,
  )

  //   this.console.log('Friends', friends)
  return {
    streams: webrtc.streams,
    screenStreams: webrtc.screenStreams,
  }
}
