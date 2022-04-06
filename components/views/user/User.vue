<template src="./User.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState, mapGetters } from 'vuex'

import { SmartphoneIcon, CircleIcon } from 'satellite-lucide-icons'

import ContextMenu from '~/components/mixins/UI/ContextMenu'
import { User } from '~/types/ui/user'
import { Conversation } from '~/store/textile/types'
import { Message, TextMessage } from '~/types/textile/mailbox'
import { MessagingTypesEnum } from '~/libraries/Enums/enums'
import { Config } from '~/config'
import {
  refreshTimestampInterval,
  convertTimestampToDate,
} from '~/utilities/Messaging'

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
    ...mapState(['ui', 'textile']),
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
    'textile.conversations': {
      handler(newValue) {
        this.existMessage(newValue)
        this.$data.timestamp = convertTimestampToDate(
          this.$t('friends.details'),
          newValue[this.user.address]?.lastUpdate,
        )
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    const setTimestamp = (timePassed: number) => {
      this.$data.timestamp = convertTimestampToDate(
        this.$t('friends.details'),
        timePassed,
      )
    }

    this.$data.timestampRefreshInterval = refreshTimestampInterval(
      this.$store.state.textile.conversations[this.user.address]?.lastUpdate,
      setTimestamp,
      Config.chat.timestampUpdateInterval,
    )
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
    existMessage(textileObj: Conversation) {
      const currentUserInfo = textileObj[this.user.address]

      this.$data.existConversation = !(
        !currentUserInfo || currentUserInfo?.lastUpdate <= 0
      )
    },
    getDescriptionFromMessage(message: Message) {
      switch (message.type) {
        case MessagingTypesEnum.TEXT:
          return (message as TextMessage).payload
        case MessagingTypesEnum.FILE:
          return this.$t('messaging.user_sent', {
            msgType: 'file',
          })
        case MessagingTypesEnum.GLYPH:
          return this.$t('messaging.user_sent', {
            msgType: 'glyph',
          })
        case MessagingTypesEnum.IMAGE:
          return this.$t('messaging.user_sent_image', {
            msgType: 'image',
          })
        default:
          return this.$t('messaging.user_sent_something')
      }
    },
  },
})
</script>

<style scoped lang="less" src="./User.less"></style>
