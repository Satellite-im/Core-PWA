<template src="./Friend.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import {
  XIcon,
  CheckIcon,
  MoreVerticalIcon,
  MessageSquareIcon,
  CircleIcon,
  SmartphoneIcon,
  UserPlusIcon,
} from 'satellite-lucide-icons'
import { ContextMenuItem } from '~/store/ui/types'
import { FriendRequest } from '~/libraries/Iridium/friends/types'
import iridium from '~/libraries/Iridium/IridiumManager'
import { User, UserStatus } from '~/libraries/Iridium/users/types'

export default Vue.extend({
  components: {
    XIcon,
    CheckIcon,
    MoreVerticalIcon,
    MessageSquareIcon,
    CircleIcon,
    SmartphoneIcon,
    UserPlusIcon,
  },
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
    request: {
      type: Object as PropType<FriendRequest | null>,
      required: false,
      default: null,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    isPreview: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loadCheck: false,
      loading: false,
    }
  },
  computed: {
    src(): string {
      const hash = this.user?.photoHash
      return hash ? `${this.$Config.ipfs.gateway}${hash}` : ''
    },
    contextMenuValues(): ContextMenuItem[] {
      if (this.isPreview) return []
      return [
        {
          text: this.$t('context.remove'),
          func: this.removeFriend,
          type: 'danger',
        },
      ]
    },
    friendRequest(): FriendRequest | null {
      if (!this.hasFriendRequest) return null
      const userDid = this.user.did
      return iridium.friends.state.requests?.[userDid] || null
    },
    status(): UserStatus | '' {
      return this.showStatus
        ? iridium.users.ephemeral.status[this.user.did] || 'offline'
        : ''
    },
    showStatus(): boolean {
      return !this.isPreview
    },
    isFriend(): boolean {
      return iridium.friends.isFriend(this.user.did)
    },
    hasFriendRequest(): boolean {
      return iridium.friends.hasRequest(this.user.did)
    },
    cancelFriendRequestText(): string {
      return this.$t('friends.cancel_friend_request') as string
    },
  },
  beforeDestroy() {
    this.$store.commit('ui/toggleContextMenu', false)
  },
  methods: {
    async createFriendRequest() {
      this.loading = true
      await iridium.friends?.requestCreate(this.user, false)
      this.loading = false
      this.$emit('requestSent')
    },
    async acceptFriendRequest() {
      this.loading = true
      await iridium.friends?.requestAccept(this.user.did)
      this.loading = false
    },
    async rejectFriendRequest() {
      this.loading = true
      await iridium.friends?.requestReject(this.user.did)
      this.loading = false
    },
    async removeFriend() {
      this.loading = true
      await iridium.friends?.friendRemove(this.user.did)
      if (this.$route.params.id === this.user.did) {
        this.$router.replace('/friends')
      }
      this.loading = false
    },
    async cancelRequest() {
      this.loading = true
      await iridium.friends?.requestReject(this.user.did)
      this.loading = false
    },
    async sendMessageRequest() {
      const isMobile = this.$device.isMobile
      const conversationId = iridium.chat?.directConversationIdFromDid(
        this.user.did,
      )
      this.$router.push(`${isMobile ? '/mobile' : ''}/chat/${conversationId}`)
    },
  },
})
</script>
<style scoped lang="less" src="./Friend.less"></style>
