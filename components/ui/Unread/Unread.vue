<template src="./Unread.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { User } from '~/types/ui/user'
import ContextMenu from '~/components/mixins/UI/ContextMenu'
import { ContextMenuItem } from '~/store/ui/types'

export default Vue.extend({
  name: 'Unread',
  mixins: [ContextMenu],
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isLoading: false,
    }
  },
  computed: {
    src(): string {
      const hash = this.user?.profilePicture
      return hash ? `${this.$Config.textile.browser}/ipfs/${hash}` : ''
    },
    contextMenuValues(): ContextMenuItem[] {
      return [
        { text: this.$t('context.send'), func: this.navigateToUser },
        { text: this.$t('context.voice'), func: this.testFunc },
        { text: this.$t('context.video'), func: this.testFunc },
        // hide profile modal depend on this task AP-1717 (https://satellite-im.atlassian.net/browse/AP-1717)
        // { text: this.$t('context.profile'), func: this.handleShowProfile },
        {
          text: this.$t('context.remove'),
          func: this.removeUser,
          type: 'danger',
        },
      ]
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
        this.$toast.error(
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
