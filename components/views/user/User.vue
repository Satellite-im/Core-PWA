<template src="./User.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'

import { SmartphoneIcon, CircleIcon } from 'satellite-lucide-icons'

import ContextMenu from '~/components/mixins/UI/ContextMenu'
import { User } from '~/types/ui/user'
import { Conversation } from '~/store/textile/types'

declare module 'vue/types/vue' {
  interface Vue {
    testFunc: () => void
    navigateToUser: () => void
    handleShowProfile: () => void
    removeUser: () => void
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
    isTyping: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      contextMenuValues: [
        { text: 'Send Message', func: this.navigateToUser },
        { text: 'Voice Call', func: this.testFunc },
        { text: 'Video Call', func: this.testFunc },
        { text: 'Remove Friend', func: this.removeUser },
        { text: 'Profile', func: this.handleShowProfile },
      ],
      existConversation: false,
      isLoading: false,
    }
  },
  computed: {
    ...mapState(['ui', 'textile']),
    src(): string {
      const hash = this.user?.profilePicture
      return hash ? `${this.$Config.textile.browser}/ipfs/${hash}` : ''
    },
  },
  watch: {
    'textile.conversations': {
      handler(newValue) {
        this.existMessage(newValue)
      },
      deep: true,
      immediate: true,
    },
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
      if (
        this.$route.params.address === this.user.address &&
        this.$device.isMobile
      ) {
        this.$store.commit('ui/showSidebar', false)
      }
      this.$router.push(`/chat/direct/${this.user.address}`)
    },
    handleShowProfile() {
      this.$store.commit('ui/toggleModal', {
        name: 'userProfile',
        state: !this.ui.modals.userProfile,
      })
      this.$store.commit('ui/setUserProfile', this.user)
    },
    getLastUpdate() {
      const currentUserInfo =
        this.$store.state.textile.conversations[this.user.address]

      const lastMessageAt = currentUserInfo?.messages
        ? Math.max.apply(
            null,
            Object.values(currentUserInfo.messages).map((msg: any) => msg.at),
          )
        : 0

      const uLastUpdate =
        (this.user.lastUpdate ||
          currentUserInfo?.lastUpdate ||
          lastMessageAt) ??
        0

      const today = new Date().setHours(0, 0, 0, 0)

      if (uLastUpdate) {
        const uDay = new Date(uLastUpdate).setHours(0, 0, 0, 0)

        if (today === uDay) {
          return this.$dayjs(uLastUpdate).format('HH:mm')
        }
        return this.$dayjs(uLastUpdate).format('YYYY-MM-DD')
      }

      return 'No message'
    },
    existMessage(textileObj: Conversation) {
      const currentUserInfo = textileObj[this.user.address]

      this.$data.existConversation = !(
        !currentUserInfo || currentUserInfo?.lastUpdate <= 0
      )
    },
  },
})
</script>

<style scoped lang="less" src="./User.less"></style>
