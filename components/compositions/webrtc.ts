import { computed, ComputedRef, reactive } from 'vue'
import { Conversation } from '~/libraries/Iridium/chat/types'
import iridium from '~/libraries/Iridium/IridiumManager'
import { User } from '~/libraries/Iridium/users/types'
import { TrackKind } from '~/libraries/WebRTC/types'
import { conversationHooks } from '~/components/compositions/conversations'

export function webrtcHooks(conversationId: Conversation['id'] | undefined) {
  const managers = reactive({
    users: iridium.users,
    webrtc: iridium.webRTC,
  })

  const { otherDids } = conversationHooks(conversationId)

  const enableRTC: ComputedRef<boolean> = computed(() => {
    return Boolean(
      otherDids.value?.filter(
        (did) => managers.users.ephemeral.status[did] === 'online',
      ).length,
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
    // @ts-ignore
    const $nuxt = useNuxtApp()

    if (!enableRTC.value) {
      return
    }

    await iridium.chat?.sendMessage({
      conversationId,
      type: 'call',
      at: Date.now(),
      attachments: [],
      call: {},
    })

    // todo - refactor to accept multiple recipients for group calls
    await iridium.webRTC
      .call({
        recipient,
        conversationId,
        kinds,
      })
      .catch((e) => $nuxt.$toast.error($nuxt.$i18n.t(e.message)))
  }
  return { enableRTC, isActiveCall, call }
}
