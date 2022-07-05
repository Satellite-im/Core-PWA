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
import ContextMenu from '~/components/mixins/UI/ContextMenu'
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
  mixins: [ContextMenu],
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
      this.loading = true
      await iridium.friends?.createFriendRequest(this.user.did)
      this.loading = false
      this.$emit('requestSent', '')
    },
    async acceptFriendRequest() {
      if (!this.request) return
      this.loading = true
      await iridium.friends?.acceptFriendRequest(this.request.user.did)
      this.loading = false
    },
    async rejectFriendRequest() {
      if (!this.request) return
      this.loading = true
      await iridium.friends?.rejectFriendRequest(this.request.user.did)
      this.loading = false
    },
    async removeFriend() {
      if (!this.request) return
      this.loading = true
      await iridium.friends?.removeFriend(this.request.user.did)
      this.loading = false
    },
    async cancelRequest() {
      if (!this.request) return
      this.loading = true
      await iridium.friends?.rejectFriendRequest(this.request.user.did)
      this.loading = false
    },
    sendMessageRequest() {
      this.$router.push(`/chat/direct/${this.user.did}`)
    },
  },
})
</script>
<style scoped lang="less" src="./Friend.less"></style>
