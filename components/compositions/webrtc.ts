import { computed, ComputedRef, reactive } from 'vue'
import { Conversation } from '~/libraries/Iridium/chat/types'
import iridium from '~/libraries/Iridium/IridiumManager'
import { User } from '~/libraries/Iridium/users/types'
import { TrackKind } from '~/libraries/WebRTC/types'
import { conversationHooks } from '~/components/compositions/conversations'
import { WebRTCIncomingCall } from '~/libraries/Iridium/webrtc/types'

export function webrtcHooks(conversationId?: Conversation['id']) {
  const managers = reactive({
    users: iridium.users,
    webrtc: iridium.webRTC,
  })

  const { isGroup, otherDids } = conversationHooks(conversationId)

  // todo remove group check after group call implementation
  const enableRTC: ComputedRef<boolean> = computed(() => {
    return Boolean(
      otherDids.value?.filter(
        (did) => managers.users.ephemeral.status[did] === 'online',
      ).length && !isGroup.value,
    )
  })

  const incomingCall: ComputedRef<WebRTCIncomingCall | null> = computed(() => {
    return managers.webrtc.state.incomingCall
  })

  const isActiveCall: ComputedRef<boolean> = computed(() => {
    return managers.webrtc.isActiveCall(conversationId)
  })

  const isBackgroundCall: ComputedRef<boolean> = computed(() => {
    return managers.webrtc.isBackgroundCall(conversationId)
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
    // @ts-ignore
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
      $nuxt.$toast.error($nuxt.$i18n.t(e.message))
    }
  }
  return { enableRTC, incomingCall, isActiveCall, isBackgroundCall, call }
}
