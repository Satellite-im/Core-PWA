<template src="./Friend.html"></template>
<script lang="ts">
import { PublicKey } from '@solana/web3.js'
import Vue, { PropType } from 'vue'

import {
  XIcon,
  CheckIcon,
  MoreVerticalIcon,
  MessageSquareIcon,
  CircleIcon,
  SmartphoneIcon,
} from 'satellite-lucide-icons'

import { Friend } from '~/types/ui/friends'
import { ContextMenu } from '~/components/mixins/UI/ContextMenu'

declare module 'vue/types/vue' {
  interface Vue {
    removeFriend: () => void
  }
}

export default Vue.extend({
  components: {
    XIcon,
    CheckIcon,
    MoreVerticalIcon,
    MessageSquareIcon,
    CircleIcon,
    SmartphoneIcon,
  },
  mixins: [ContextMenu],
  props: {
    friend: {
      type: Object as PropType<Friend>,
      default: () => {},
    },
    request: {
      type: Boolean,
      default: false,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    send: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: '' as '' | 'accept' | 'decline' | 'sending' | 'options',
      contextMenuValues: [{ text: 'Remove Friend', func: this.removeFriend }],
    }
  },
  computed: {
    src() {
      if (this.friend?.profilePicture) {
        return `${this.$Config.textile.browser}/ipfs/${this.friend.profilePicture}`
      }
      if (this.friend?.photoHash) {
        return `${this.$Config.textile.browser}/ipfs/${this.friend.photoHash}`
      }
      if (this.friend?.request?.userInfo?.photoHash) {
        return `${this.$Config.textile.browser}/ipfs/${this.friend.request.userInfo.photoHash}`
      }
      return ''
    },
  },
  methods: {
    async createFriendRequest() {
      this.loading = 'sending'
      try {
        await this.$store.dispatch('friends/createFriendRequest', {
          friendToKey: new PublicKey(this.$props.friend.account.accountId),
        })
        this.$emit('requestSent', '')
      } catch (e) {
        this.$emit('requestSent', e.message)
      } finally {
        this.loading = ''
      }
    },
    async acceptFriendRequest() {
      this.loading = 'accept'
      try {
        await this.$store.dispatch('friends/acceptFriendRequest', {
          friendRequest: this.$props.friend.request,
        })
      } finally {
        this.loading = ''
      }
    },
    async declineFriendRequest() {
      this.loading = 'decline'
      try {
        await this.$store.dispatch(
          'friends/denyFriendRequest',
          this.$props.friend.request,
        )
      } finally {
        this.loading = ''
      }
    },
    async removeFriend() {
      this.loading = 'options'
      try {
        await this.$store.dispatch('friends/removeFriend', this.friend)
      } finally {
        this.loading = ''
      }
    },
    sendMessageRequest() {
      this.$router.push(`/chat/direct/${this.$props.friend.address}`)
    },
  },
})
</script>
<style scoped lang="less" src="./Friend.less"></style>
