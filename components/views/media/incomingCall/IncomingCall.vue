<template src="./IncomingCall.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import {
  PhoneIcon,
  PhoneOffIcon,
  VideoIcon,
  VideoOffIcon,
} from 'satellite-lucide-icons'
import { Iridium } from '../../../../../iridium'
import { Group } from '~/store/groups/types'
import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'
import { User } from '~/libraries/Iridium/types'

export default Vue.extend({
  name: 'IncomingCall',
  components: {
    PhoneIcon,
    PhoneOffIcon,
    VideoIcon,
    VideoOffIcon,
  },
  props: {
    acceptCall: {
      type: Function,
      default: () => {},
      required: false,
    },
    denyCall: {
      type: Function,
      default: () => {},
      required: false,
    },
  },
  computed: {
    ...mapState({
      groups: (state) => (state as RootState).groups.all,
      incomingCall: (state) => (state as RootState).webrtc.incomingCall,
    }),
    caller(): User | undefined {
      if (!this.incomingCall?.type) {
        return
      }
      if (this.incomingCall.type !== 'friend') {
        return
        // return this.groups.find((g: Group) => g.id === this.callId)
      }
      let did
      try {
        did = Iridium.peerIdToDID(this.incomingCall.peerId)
      } catch (error) {}
      const friend = iridium.friends.getFriend(did)
      return friend
    },
    callerAvatar(): string {
      const hash = this.caller?.photoHash
      return hash ? `${this.$Config.textile.browser}/ipfs/${hash}` : ''
    },
  },
})
</script>

<style scoped lang="less" src="./IncomingCall.less"></style>
