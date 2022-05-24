<template src="./Unread.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { User } from '~/types/ui/user'
import ContextMenu from '~/components/mixins/UI/ContextMenu'

declare module 'vue/types/vue' {
  interface Vue {
    testFunc: () => void
    navigateToUser: () => void
    handleShowProfile: () => void
    removeUser: () => void
  }
}

export default Vue.extend({
  name: 'Unread',
  mixins: [ContextMenu],
  props: {
    user: {
      type: Object as PropType<User>,
      default: () => ({
        name: '',
        address: '',
        profilePicture: '',
        unreadCount: 0,
      }),
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
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
      isLoading: false,
    }
  },
  computed: {
    src(): string {
      const hash = this.user?.profilePicture
      return hash ? `${this.$Config.textile.browser}/ipfs/${hash}` : ''
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
      } catch (e) {
        this.$toast.success(
          this.$t('errors.friends.friend_not_removed') as string,
        )
      } finally {
        this.isLoading = false
      }
    },
    async handleShowProfile() {
      this.$store.dispatch('ui/showProfile', this.user)
    },
    navigateToUser() {
      if (this.$route.params.address === this.user.address) {
        if (this.$device.isMobile) {
          this.$store.commit('ui/showSidebar', false)
        } else {
          this.$store.dispatch('ui/setChatbarFocus')
        }
        return
      }

      this.$store.dispatch('conversation/setConversation', {
        id: this.user.address,
        type: 'friend',
        participants: [this.user],
        calling: false,
      })
      this.$router.push(`/chat/direct/${this.user.address}`)
    },
  },
})
</script>

<style scoped lang="less" src="./Unread.less"></style>
