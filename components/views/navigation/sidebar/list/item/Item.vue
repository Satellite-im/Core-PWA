<template src="./Item.html"></template>

<script lang="ts">
import Vue, {
  ComputedRef,
  computed,
  PropType,
  Ref,
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
} from 'vue'
import { useNuxtApp } from '@nuxt/bridge/dist/runtime/app'
import { toHTML } from '~/libraries/ui/Markdown'
import { ContextMenuItem } from '~/store/ui/types'
import iridium from '~/libraries/Iridium/IridiumManager'
import { Conversation } from '~/libraries/Iridium/chat/types'
import { conversationHooks } from '~/components/compositions/conversations'
import { webrtcHooks } from '~/components/compositions/webrtc'
import { Config } from '~/config'
import { $dayjs } from '~/plugins/local/dayjs'
import { getDate, getTimestamp } from '~/utilities/timestamp'

export default Vue.extend({
  props: {
    conversationId: {
      type: String as PropType<Conversation['id']>,
      required: true,
    },
  },
  setup(props) {
    const $nuxt = useNuxtApp()
    const {
      conversation,
      numUnreadMessages,
      otherDids,
      otherParticipants,
      sortedMessages,
    } = conversationHooks(props.conversationId)
    const { enableRTC, call } = webrtcHooks(props.conversationId)

    const isLoading = ref(false)
    const timestamp = ref('')
    const timeoutId: Ref<NodeJS.Timeout | undefined> = ref(undefined)

    const unreadDisplay: ComputedRef<string> = computed(() => {
      return numUnreadMessages.value >= 100
        ? '99+'
        : numUnreadMessages.value.toString()
    })

    const subtitle: ComputedRef<string> = computed(() => {
      const html = toHTML(lastMessageDisplay.value, { liveTyping: false })
      const firstLine = html.split('<br>')[0]

      return firstLine.replace(
        Config.regex.emojiWrapper,
        (emoji) => `<span class="emoji">${emoji}</span>`,
      )
    })

    const lastMessageDisplay: ComputedRef<string> = computed(() => {
      const message = sortedMessages.value[sortedMessages.value.length - 1]
      if (!message) {
        return $nuxt.$i18n.t('messaging.say_hi')
      }

      const name = iridium.users.getUser(message.from)?.name
      const members = message.members
        ?.map((did) => iridium.users.getUser(did)?.name)
        .filter((name) => name)
        .join(', ')

      const fromSelf = message.from === iridium.id

      if (message.attachments.length) {
        return fromSelf
          ? $nuxt.$i18n.t('messaging.you_sent_attachment')
          : $nuxt.$i18n.t('messaging.sent_attachment', { name })
      }

      switch (message.type) {
        case 'glyph':
          return fromSelf
            ? $nuxt.$i18n.t('messaging.you_sent_glyph')
            : $nuxt.$i18n.t('messaging.sent_glyph', { name })
        case 'member_join':
          return $nuxt.$i18n.t('messaging.group_join', {
            name,
            members,
          })
        case 'member_leave':
          return $nuxt.$i18n.t('messaging.group_leave', { name })
        case 'call':
          if (fromSelf) {
            return $nuxt.$i18n.t('messaging.call_outgoing')
          }
          return $nuxt.$i18n.t('messaging.call_incoming', { name })
      }

      return message?.body ?? ''
    })

    const contextMenuValues: ComputedRef<ContextMenuItem[]> = computed(() => {
      return conversation.value?.type === 'direct'
        ? [
            {
              text: $nuxt.$i18n.t('context.voice'),
              func: enableRTC.value ? handleCall : () => {},
              type: enableRTC.value ? 'primary' : 'disabled',
            },
            {
              text: $nuxt.$i18n.t('context.remove'),
              func: removeFriend,
              type: 'danger',
            },
          ]
        : [
            {
              text: $nuxt.$i18n.t('context.voice'),
              func: () => {},
              type: 'disabled',
            },

            {
              text: $nuxt.$i18n.t('context.leave_group'),
              func: leaveGroup,
              type: 'danger',
            },
          ]
    })

    async function handleCall() {
      call({
        recipient: otherDids.value[0],
        conversationId: props.conversationId,
        kinds: ['audio'],
      })
    }

    async function removeFriend() {
      isLoading.value = true
      await iridium.friends
        .friendRemove(otherDids.value[0])
        .catch((e) => $nuxt.$toast.error($nuxt.$i18n.t(e.message)))
      isLoading.value = false
    }

    async function leaveGroup() {
      iridium.chat.leaveGroup(props.conversationId)
    }

    /**
     * "now" for less than 30 sec
     * "hh:mm AM/PM" between 31 sec and a day
     * "yesterday" the day before
     * "2d" 2 days before
     * "MM/DD/YYYY" > 2 days before
     */
    function setTimestamp(): string | undefined {
      const lastMsgAt =
        sortedMessages.value.at(-1)?.at || conversation.value?.createdAt

      if (!lastMsgAt) {
        return
      }

      clearTimeout(timeoutId.value)

      if ($dayjs().diff(lastMsgAt, 'second') < 30) {
        timeoutId.value = setTimeout(setTimestamp, 30000)
        timestamp.value = $nuxt.$i18n.t('time.now')
        return
      }
      if ($dayjs().isSame(lastMsgAt, 'day')) {
        timestamp.value = getTimestamp(lastMsgAt)
      } else if ($dayjs().diff(lastMsgAt, 'day') <= 1) {
        timestamp.value = $nuxt.$i18n.t('time.yesterday')
      } else if ($dayjs().diff(lastMsgAt, 'day') <= 2) {
        timestamp.value = '2 d'
      } else {
        timestamp.value = getDate(lastMsgAt)
      }
      const midnight = $dayjs().add(1, 'day').startOf('day').valueOf()
      // update timestamp at midnight tonight
      timeoutId.value = setTimeout(() => setTimestamp(), midnight - Date.now())
    }

    onMounted(setTimestamp)
    watch(sortedMessages, setTimestamp)
    onBeforeUnmount(() => {
      clearTimeout(timeoutId.value)
    })

    return {
      contextMenuValues,
      isLoading,
      numUnreadMessages,
      otherParticipants,
      sortedMessages,
      subtitle,
      timestamp,
      unreadDisplay,
    }
  },
  computed: {
    conversation(): Conversation {
      return iridium.chat.state.conversations[this.conversationId]
    },
  },
})
</script>

<style scoped lang="less" src="./Item.less"></style>
