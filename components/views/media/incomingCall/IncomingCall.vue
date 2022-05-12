<template src="./IncomingCall.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'

import {
  PhoneIcon,
  PhoneOffIcon,
  VideoIcon,
  VideoOffIcon,
} from 'satellite-lucide-icons'

import { Sounds } from '~/libraries/SoundManager/SoundManager'

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
    ...mapState(['conversation', 'groups', 'friends']),
    group() {
      return (
        this.callType === 'group' &&
        this.$store.state.groups.all.find(
          (g: any) => g.id === this.$store.state.webrtc.incomingCall?.callId,
        )
      )
    },
    friend() {
      return (
        this.callType === 'friend' &&
        this.$store.state.friends.all.find(
          (f: any) =>
            f.peerId === this.$store.state.webrtc.incomingCall?.callId,
        )
      )
    },
    callType() {
      return this.$store.state.webrtc.incomingCall?.callId &&
        RegExp(this.$Config.regex.uuidv4).test(
          this.$store.state.webrtc.incomingCall?.callId?.split('|')?.[1],
        )
        ? 'group'
        : 'friend'
    },
  },
  watch: {
    '$store.state.webrtc.incomingCall': {
      handler() {},
      deep: true,
    },
  },
  mounted() {
    this.$store.dispatch('sounds/playSound', Sounds.CALL)
  },
  beforeDestroy() {
    this.$store.dispatch('sounds/stopSound', Sounds.CALL)
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./IncomingCall.less"></style>
