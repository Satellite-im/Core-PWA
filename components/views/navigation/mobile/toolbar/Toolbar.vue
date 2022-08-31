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
import {
  conversationHooks,
  call,
} from '~/components/compositions/conversations'

export default Vue.extend({
  components: {
    PhoneCallIcon,
    UserPlusIcon,
    MenuIcon,
    VideoIcon,
  },
  setup() {
    const { conversation, isGroup, otherDids, enableRTC } = conversationHooks()

    async function handleCall() {
      if (isGroup.value || !enableRTC.value) {
        return
      }
      await call(['audio'])
    }

    return {
      conversation,
      isGroup,
      otherDids,
      enableRTC,
      handleCall,
    }
  },

  data() {
    return {
      webrtc: iridium.webRTC.state,
      chat: iridium.chat.state,
    }
  },
  computed: {
    ...mapGetters('ui', ['allUnseenNotifications']),
  },
})
</script>

<style scoped lang="less" src="./Toolbar.less"></style>
