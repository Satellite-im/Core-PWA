<template src="./User.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState, mapGetters } from 'vuex'

import { SmartphoneIcon, CircleIcon } from 'satellite-lucide-icons'

import ContextMenu from '~/components/mixins/UI/ContextMenu'
import { User } from '~/types/ui/user'
import { Message, TextMessage } from '~/types/textile/mailbox'
import { MessagingTypesEnum } from '~/libraries/Enums/enums'
import { Config } from '~/config'
import {
  refreshTimestampInterval,
  convertTimestampToDate,
} from '~/utilities/Messaging'
import { RootState } from '~/types/store/store'

declare module 'vue/types/vue' {
  interface Vue {
    testFunc: () => void
    navigateToUser: () => void
    handleShowProfile: () => void
    removeUser: () => void
    getDescriptionFromMessage: (message: Message) => string
  }
}

export default Vue.extend({
  components: {
    SmartphoneIcon,
    CircleIcon,
  },
  mixins: [ContextMenu],
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
    isSelected: {
      type: Boolean,
      default: false,
      required: false,
    },
    isTyping: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      contextMenuValues: [
        { text: this.$t('context.send'), func: this.navigateToUser },
        { text: this.$t('context.voice'), func: this.testFunc },
        { text: this.$t('context.video'), func: this.testFunc },
        { text: this.$t('context.profile'), func: this.handleShowProfile },
        { text: this.$t('context.remove'), func: this.removeUser },
      ],
      existConversation: false,
      isLoading: false,
      timestamp: convertTimestampToDate(
        this.$t('friends.details'),
        this.$store.state.textile.conversations[this.user.address]?.lastUpdate,
      ),
      timestampRefreshInterval: null,
    }
  },
  computed: {
    ...mapState({
      ui: (state) => (state as RootState).ui,
      userConversationLastUpdate(state) {
        return (
          (state as RootState).textile.conversations[this.user.address]
            ?.lastUpdate ?? 0
        )
      },
      accounts: (state) => (state as RootState).accounts,
    }),
    ...mapGetters('textile', ['getConversation']),
    lastMessage() {
      const conversation = this.getConversation(this.user.address)
      const lastMessage = conversation?.lastMessage

      return lastMessage
        ? this.getDescriptionFromMessage(lastMessage)
        : this.$t('messaging.say_hi')
    },
    src(): string {
      const hash = this.user?.profilePicture
      return hash ? `${this.$Config.textile.browser}/ipfs/${hash}` : ''
    },
  },
  watch: {
    userConversationLastUpdate: {
      handler(lastUpdate) {
        if (this.$data.timestampRefreshInterval) {
          clearInterval(this.$data.timestampRefreshInterval)
        }

        this.$data.existConversation = lastUpdate > 0
        this.$data.timestamp = convertTimestampToDate(
          this.$t('friends.details'),
          lastUpdate,
        )

        const setTimestamp = (timePassed: number) => {
          if (
            timePassed === this.getConversation(this.user.address)?.lastUpdate
          ) {
            this.$data.timestamp = convertTimestampToDate(
              this.$t('friends.details'),
              timePassed,
            )
          }
        }

        this.$data.timestampRefreshInterval = refreshTimestampInterval(
          lastUpdate,
          setTimestamp,
          Config.chat.timestampUpdateInterval,
        )
      },
      immediate: true,
    },
  },
  beforeDestroy() {
    clearInterval(this.$data.timestampRefreshInterval)
  },
  methods: {
    testFunc() {
      this.$Logger.log('User Context', 'Test func')
    },
    async removeUser() {
      this.isLoading = true
      try {
        await this.$store.dispatch('friends/removeFriend', this.user)
        this.$router.replace('/chat/direct')
      } catch (e) {
        this.$toast.success(
          this.$t('errors.friends.friend_not_removed') as string,
        )
      } finally {
        this.isLoading = false
      }
    },
    /**
     * @method navigateToUser
     * @description Navigates to chat with specific user by pushing "/chat/direct/" + users ID to the router
     * Pretty sure this is just a placeholder for what will be the actual function?
     * @example ---
     */
    navigateToUser() {
      if (this.$device.isMobile) {
        // mobile, show slide 1 which is chat slide, set showSidebar flag false as css related
        this.$store.commit('ui/setSwiperSlideIndex', 1)
        this.$store.commit('ui/showSidebar', false)
      }

      this.$router.push(`/chat/direct/${this.user.address}`)
    },
    async handleShowProfile() {
      this.$store.dispatch('ui/showProfile', this.user)
    },

    getFormattedUnreads(value: Number) {
      if (value < 100) {
        return value.toString()
      }
      if (value >= 100) {
        return '99+'
      }
    },
    getDescriptionFromMessage(message: Message) {
      const sender =
        message.from === this.accounts?.details?.textilePubkey ? 'me' : 'user'

      switch (message.type) {
        case MessagingTypesEnum.TEXT:
          return (message as TextMessage).payload
        case MessagingTypesEnum.FILE:
          return this.$t(`messaging.user_sent.${sender}`, {
            msgType: 'file',
          })
        case MessagingTypesEnum.GLYPH:
          return this.$t(`messaging.user_sent.${sender}`, {
            msgType: 'glyph',
          })
        case MessagingTypesEnum.IMAGE:
          return this.$t(`messaging.user_sent_image.${sender}`, {
            msgType: 'image',
          })
        default:
          return this.$t(`messaging.user_sent_something.${sender}`)
      }
    },
  },
})
</script>

<style scoped lang="less" src="./User.less"></style>
