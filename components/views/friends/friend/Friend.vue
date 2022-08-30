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
} from 'satellite-lucide-icons'
import { ContextMenuItem } from '~/store/ui/types'
import { FriendRequest, User } from '~/libraries/Iridium/friends/types'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  components: {
    XIcon,
    CheckIcon,
    MoreVerticalIcon,
    MessageSquareIcon,
    CircleIcon,
    SmartphoneIcon,
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
      return [
        {
          text: this.$t('context.remove'),
          func: this.removeFriend,
          type: 'danger',
        },
      ]
    },
    requestIncoming(): boolean | null {
      return this.request && this.request.incoming
    },
  },
  beforeDestroy() {
    this.$store.commit('ui/toggleContextMenu', false)
  },
  methods: {
    async createFriendRequest() {
      this.loading = true
      await iridium.friends?.requestCreate(this.user.did)
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
      this.$router.push(
        `/chat/${iridium.chat?.directConversationIdFromDid(this.user.did)}`,
      )
    },
  },
})
</script>
<style scoped lang="less" src="./Friend.less"></style>
