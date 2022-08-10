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
import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'
import { User } from '~/libraries/Iridium/friends/types'

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
  data() {
    return {
      webrtc: iridium.webRTC.state,
    }
  },
  computed: {
    ...mapState({
      groups: (state) => (state as RootState).groups.all,
      // incomingCall: (state) => (state as RootState).webrtc.incomingCall,
    }),
    incomingCall() {
      return this.webrtc.incomingCall
    },
    caller(): User | undefined {
      if (!this.incomingCall?.type) {
        return
      }
      if (this.incomingCall.type !== 'friend') {
        return
        // return this.groups.find((g: Group) => g.id === this.callId)
      }
      return iridium.friends.getFriend(this.incomingCall.did)
    },
    callerAvatar(): string {
      if (!this.caller) {
        return ''
      }
      const hash = this.caller?.photoHash
      return hash ? `${this.$Config.textile.browser}/ipfs/${hash}` : ''
    },
  },
})
</script>

<style scoped lang="less" src="./IncomingCall.less"></style>
