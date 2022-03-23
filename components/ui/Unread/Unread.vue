<template src="./Unread.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { User } from '~/types/ui/user'
import ContextMenu from '~/components/mixins/UI/ContextMenu'

declare module 'vue/types/vue' {
  interface Vue {
    testFunc: () => void
    navigateToUser: () => void
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
  },
  data() {
    return {
      contextMenuValues: [
        { text: this.$t('context.send'), func: this.testFunc },
        { text: this.$t('context.voice'), func: this.testFunc },
        { text: this.$t('context.video'), func: this.testFunc },
        { text: this.$t('context.profile'), func: this.testFunc },
        { text: this.$t('context.remove'), func: this.testFunc },
      ],
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
    navigateToUser() {
      if (
        this.$route.params.address === this.user.address &&
        this.$device.isMobile
      ) {
        this.$store.commit('ui/showSidebar', false)
      }
      this.$router.push(`/chat/direct/${this.user.address}`)
    },
  },
})
</script>

<style scoped lang="less" src="./Unread.less"></style>
