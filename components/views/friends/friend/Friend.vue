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
import { mapState, mapGetters } from 'vuex'

import { ContextMenuItem } from '~/store/ui/types'
import { Friend } from '~/types/ui/friends'
import ContextMenu from '~/components/mixins/UI/ContextMenu'
import { AddFriendEnum } from '~/libraries/Enums/enums'
import { Config } from '~/config'

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
    }
  },
  computed: {
    ...mapState(['accounts']),
    src(): string {
      const hash =
        this.friend?.photoHash ||
        this.friend?.profilePicture ||
        this.friend?.request?.userInfo?.photoHash
      return hash ? `${this.$Config.textile.browser}/ipfs/${hash}` : ''
    },
    contextMenuValues(): ContextMenuItem[] {
      return [{ text: this.$t('context.remove'), func: this.removeFriend }]
    },
  },
  beforeDestroy() {
    this.$store.commit('ui/toggleContextMenu', false)
  },
  methods: {
    async createFriendRequest() {
      this.loading = AddFriendEnum.SENDING
      try {
        await this.$store.dispatch('friends/createFriendRequest', {
          friendToKey: new PublicKey(this.friend.account.accountId),
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
          friendRequest: this.friend.request,
        })
        const query = { limit: Config.chat.defaultMessageLimit, skip: 0 }
        this.$store.commit('textile/setConversation', {
          address: this.friend.address,
          messages: [],
          limit: query.limit,
          skip: query.skip,
        })
      } catch (e: any) {
        this.loadCheck = false
        this.$toast.error(this.$t('errors.friends.request_not_found') as string)
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
          this.friend.request,
        )
      } catch (e) {
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
    async cancelRequest() {
      this.loading = AddFriendEnum.OPTIONS
      try {
        await this.$store.dispatch(
          'friends/removeFriendRequest',
          this.friend.request,
        )
      } catch (e) {
      } finally {
        this.loading = AddFriendEnum.EMPTY
      }
    },
    sendMessageRequest() {
      this.$store.dispatch('conversation/setConversation', {
        id: this.friend.peerId,
        type: 'friend',
        participants: [this.friend],
        calling: false,
      })
      this.$router.push(`/chat/direct/${this.friend.address}`)
    },
  },
})
</script>
<style scoped lang="less" src="./Friend.less"></style>
