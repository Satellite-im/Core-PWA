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
import { Friend } from '~/types/ui/friends'
import { Group } from '~/store/groups/types'
import { RootState } from '~/types/store/store'

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
      callId: (state) => (state as RootState).webrtc.incomingCall?.callId,
      friends: (state) => (state as RootState).friends.all,
      groups: (state) => (state as RootState).groups.all,
    }),
    callType(): 'group' | 'friend' | undefined {
      return this.callId &&
        RegExp(this.$Config.regex.uuidv4).test(this.callId?.split('|')?.[1])
        ? 'group'
        : 'friend'
    },
    caller(): Friend | Group | undefined {
      if (!this.callType) {
        return
      }
      if (this.callType === 'friend') {
        return this.friends.find((f: Friend) => f.peerId === this.callId)
      }
      return this.groups.find((g: Group) => g.id === this.callId)
    },
    callerAvatar(): string {
      const hash = this.caller?.profilePicture
      return hash ? `${this.$Config.textile.browser}/ipfs/${hash}` : ''
    },
  },
})
</script>

<style scoped lang="less" src="./IncomingCall.less"></style>
