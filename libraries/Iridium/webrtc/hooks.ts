import { Ref, UnwrapNestedRefs } from 'vue'
import dayjs from 'dayjs'
import { Call, CallPeerStreams } from '~/libraries/WebRTC/Call'
import { User } from '~/libraries/Iridium/friends/types'
import iridium from '~/libraries/Iridium/IridiumManager'
import { $WebRTC } from '~/libraries/WebRTC/WebRTC'
import { TrackKind } from '~/libraries/WebRTC/types'

export function useCallElapsedTime() {
  const state: UnwrapNestedRefs<{
    interval: ReturnType<typeof setInterval> | null
    elapsedTime: string
  }> = reactive({ interval: null, elapsedTime: '' })

  const updateElapsedTime = () => {
    const duration = dayjs.duration(Date.now() - iridium.webRTC.state.createdAt)
    const hours = duration.hours()
    state.elapsedTime = `${hours > 0 ? hours + ':' : ''}${duration.format(
      'mm:ss',
    )}`
  }

  const startInterval = () => {
    if (
      !state.interval &&
      iridium.webRTC.state.createdAt &&
      iridium.webRTC.state.activeCall
    ) {
      updateElapsedTime()
      state.interval = setInterval(updateElapsedTime, 1000)
    }
  }

  const clearTimer = () => {
    if (state.interval !== null) clearInterval(state.interval)
  }

  return {
    elapsedTime: toRef(state, 'elapsedTime'),
    startInterval,
    clearTimer,
  }
}

export function useUserStreams(did: string) {
  const { call } = useWebRTC()

  const streams: Ref<CallPeerStreams | undefined> = computed(() => {
    if (!did || !call.value) return

    return call.value.streams[did]
  })

  const getStream = (type: TrackKind): Ref<MediaStream | undefined> => {
    return computed(() => {
      const isMuted =
        !did || Boolean(iridium.webRTC.state.streamMuted[did]?.[type] ?? true)

      if (isMuted || !call.value) return

      return streams.value?.[type]
    })
  }

  return {
    streams,
    getStream,
  }
}

export function useWebRTC() {
  // THIS SHOULD BE IN ITS OWN useConversation Hook
  const $nuxt = useNuxtApp()
  const conversationId: Ref<string> = computed(() => {
    return $nuxt.$route.params.id
  })

  const call: Ref<Call | undefined> = computed(() => {
    if (!iridium.webRTC.state.activeCall?.callId) return

    return $WebRTC.getCall(iridium.webRTC.state.activeCall.callId)
  })

  const isActiveCall: Ref<boolean> = computed(() => {
    if (!iridium.webRTC.state.activeCall?.callId || !conversationId.value) {
      return false
    }
    return iridium.webRTC.state.activeCall.callId === conversationId.value
  })

  const isBackgroundCall: Ref<boolean> = computed(() => {
    if (!iridium.webRTC.state.activeCall?.callId) {
      return false
    }
    return iridium.webRTC.state.activeCall.callId !== conversationId.value
  })

  const localParticipant: Ref<User | undefined> = computed(() => {
    const id = iridium.webRTC.state.activeCall?.did
    if (!id) {
      return
    }
    return iridium.profile.state
  })

  const remoteParticipants: Ref<User[]> = computed(() => {
    const id = iridium.webRTC.state.activeCall?.callId

    if (!id || !iridium.chat.hasConversation(id)) {
      return []
    }

    const conversation = iridium.chat.getConversation(id)

    const dids = conversation.participants.filter(
      (f) => f !== iridium.connector?.id,
    )

    return dids.map((did) => iridium.users.getUser(did))
  })

  return {
    call,
    isActiveCall,
    isBackgroundCall,
    localParticipant,
    remoteParticipants,
  }
}
