<template src="./Friend.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'

import ContextMenu from '~/components/mixins/UI/ContextMenu'
import { User } from '~/types/ui/user'
import { Conversation } from '~/store/textile/types'

declare module 'vue/types/vue' {
  interface Vue {
    selectUserAddress: (address: string) => void
  }
}

export default Vue.extend({
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
    selectUserAddress: {
      type: Function,
      default: (address: string) => {},
    },
    selectedAddress: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      existConversation: false,
      isLoading: false,
      address: '',
      checked: false,
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
    /**
     * Watch checked state
     * if false, set selected as ''
     * if true, set selected user address
     */
    checked(newValue, oldValue) {
      if (oldValue === newValue) return
      if (newValue === false) {
        this.selectUserAddress('')
      } else {
        this.selectUserAddress(this.user.address)
      }
    },
  },
  methods: {
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
    toggleSelect() {
      this.checked = !this.checked
    },
  },
})
</script>

<style scoped lang="less" src="./Friend.less"></style>
