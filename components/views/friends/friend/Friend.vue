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
    requestIncoming() {
      return this.request && this.request.to === iridium.connector?.id
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
      await iridium.friends?.remove(this.user.did)
      this.loading = false
    },
    async cancelRequest() {
      this.loading = true
      await iridium.friends?.requestReject(this.user.did)
      this.loading = false
    },
    sendMessageRequest() {
      this.$router.push(`/chat/direct/${this.user.did}`)
    },
  },
})
</script>
<style scoped lang="less" src="./Friend.less"></style>
