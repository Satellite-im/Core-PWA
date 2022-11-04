import {
  computed,
  ComputedRef,
  reactive,
  ref,
  onMounted,
  onUnmounted,
} from 'vue'
import { useNuxtApp } from '@nuxt/bridge/dist/runtime/app'
import { Conversation } from '~/libraries/Iridium/chat/types'
import iridium from '~/libraries/Iridium/IridiumManager'
import { User } from '~/libraries/Iridium/users/types'
import { TrackKind } from '~/libraries/WebRTC/types'
import { conversationHooks } from '~/components/compositions/conversations'
import { formatDuration } from '~~/utilities/duration'

export function webrtcHooks(conversationId?: Conversation['id']) {
  const managers = reactive({
    users: iridium.users,
    webrtc: iridium.webRTC,
  })

  const { isGroup, otherDids } = conversationHooks(conversationId)

  // todo remove group check after group call implementation
  const enableRTC: ComputedRef<boolean> = computed(() => {
    if (isActiveCall.value) {
      return false
    }
    return Boolean(
      otherDids.value?.filter(
        (did) => managers.users.ephemeral.status[did] === 'online',
      ).length && !isGroup.value,
    )
  })

  const isActiveCall: ComputedRef<boolean> = computed(() => {
    return managers.webrtc.isActiveCall(conversationId)
  })

  async function call({
    recipient,
    conversationId,
    kinds,
  }: {
    recipient: User['did']
    conversationId: Conversation['id']
    kinds: TrackKind[]
  }) {
    const $nuxt = useNuxtApp()

    if (!enableRTC.value) {
      return
    }

    // todo - refactor to accept multiple recipients for group calls
    try {
      await iridium.webRTC.call({
        recipient,
        conversationId,
        kinds,
      })
      await iridium.chat?.sendMessage({
        conversationId,
        type: 'call',
        at: Date.now(),
        attachments: [],
        call: {},
      })
    } catch (e) {
      if (e instanceof Error) {
        $nuxt.$toast.error($nuxt.$i18n.t(e.message))
      }
    }
  }

  function useDuration() {
    const callDuration = ref<string>('')
    let intervalId: NodeJS.Timer | undefined

    const updateDuration = () => {
      const durationOfCall = Date.now() - managers.webrtc.state.callStartedAt
      callDuration.value = formatDuration(durationOfCall / 1000)
    }

    onMounted(() => {
      updateDuration()
      intervalId = setInterval(updateDuration, 1000)
    })
    onUnmounted(() => {
      clearInterval(intervalId)
    })
    return callDuration
  }

  return { enableRTC, isActiveCall, call, useDuration }
}
