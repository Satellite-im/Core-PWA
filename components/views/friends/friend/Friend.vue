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
import ContextMenu from '~/components/mixins/UI/ContextMenu'
import { AddFriendEnum } from '~/libraries/Enums/enums'
import { Config } from '~/config'

declare module 'vue/types/vue' {
  interface Vue {
    removeFriend: () => void
    loading: AddFriendEnum
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
      required: true,
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
    outgoing: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loadCheck: false,
      loading: '' as AddFriendEnum,
      contextMenuValues: [
        { text: this.$t('context.remove'), func: this.removeFriend },
      ],
    }
  },
  computed: {
    src(): string {
      const hash =
        this.friend?.photoHash ||
        this.friend?.profilePicture ||
        this.friend?.request?.userInfo?.photoHash
      return hash ? `${this.$Config.textile.browser}/ipfs/${hash}` : ''
    },
  },
  methods: {
    async createFriendRequest() {
      this.loading = AddFriendEnum.SENDING
      try {
        await this.$store.dispatch('friends/createFriendRequest', {
          friendToKey: new PublicKey(this.$props.friend.account.accountId),
        })
        this.$emit('requestSent', '')
      } catch (e: any) {
        this.$emit('requestSent', e.message)
      } finally {
        this.loading = AddFriendEnum.EMPTY
      }
    },
    async acceptFriendRequest() {
      this.loading = AddFriendEnum.ACCEPT
      this.loadCheck = true
      try {
        await this.$store.dispatch('friends/acceptFriendRequest', {
          friendRequest: this.$props.friend.request,
        })
        const query = { limit: Config.chat.defaultMessageLimit, skip: 0 }
        this.$store.commit('textile/setConversation', {
          address: this.$props.friend.address,
          messages: [],
          limit: query.limit,
          skip: query.skip,
        })
      } catch (e: any) {
        this.loadCheck = false
        throw new Error(e)
      } finally {
        this.loadCheck = false
        this.loading = AddFriendEnum.EMPTY
      }
    },
    async declineFriendRequest() {
      this.loading = AddFriendEnum.DECLINE
      try {
        await this.$store.dispatch(
          'friends/denyFriendRequest',
          this.$props.friend.request,
        )
      } finally {
        this.loading = AddFriendEnum.EMPTY
      }
    },
    async removeFriend() {
      this.loading = AddFriendEnum.OPTIONS
      try {
        await this.$store.dispatch('friends/removeFriend', this.friend)
      } catch (e) {
        this.$toast.success(
          this.$t('errors.friends.friend_not_removed') as string,
        )
      } finally {
        this.loading = AddFriendEnum.EMPTY
      }
    },
    // todo - remove friend request for both users on click
    async cancelRequest() {},
    sendMessageRequest() {
      this.$router.push(`/chat/direct/${this.$props.friend.address}`)
    },
  },
})
</script>
<style scoped lang="less" src="./Friend.less"></style>
