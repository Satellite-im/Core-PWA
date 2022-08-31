<template src="./Toolbar.html"></template>

<script lang="ts">
import Vue from 'vue'
import {
  PhoneCallIcon,
  UserPlusIcon,
  MenuIcon,
  VideoIcon,
} from 'satellite-lucide-icons'

import { mapGetters } from 'vuex'
import iridium from '~/libraries/Iridium/IridiumManager'
import { TrackKind } from '~/libraries/WebRTC/types'
import { Conversation } from '~/libraries/Iridium/chat/types'
import { conversationHooks } from '~/components/compositions/conversations'

export default Vue.extend({
  components: {
    PhoneCallIcon,
    UserPlusIcon,
    MenuIcon,
    VideoIcon,
  },
  setup() {
    const { conversation, isGroup, otherDids, enableRTC } = conversationHooks()

    return {
      conversation,
      isGroup,
      otherDids,
      enableRTC,
    }
  },

  data() {
    return {
      users: iridium.users.state,
      userStatus: iridium.users.userStatus,
      isGroupInviteVisible: false,
      webrtc: iridium.webRTC.state,
      chat: iridium.chat.state,
    }
  },
  computed: {
    ...mapGetters('ui', ['allUnseenNotifications']),
    conversationId(): Conversation['id'] | undefined {
      return this.$route.params.id
    },
  },
  methods: {
    async call(kinds: TrackKind[]) {
      if (!this.enableRTC || !this.conversationId) {
        return
      }
      try {
        await iridium.webRTC.call({
          recipient: this.otherDids[0],
          conversationId: this.conversationId,
          kinds,
        })
      } catch (e: any) {
        this.$toast.error(this.$t(e.message) as string)
      }
    },
    async handleCall() {
      if (this.isGroup || !this.enableRTC) {
        return
      }
      await this.call(['audio'])
    },
  },
})
</script>

<style scoped lang="less" src="./Toolbar.less"></style>
