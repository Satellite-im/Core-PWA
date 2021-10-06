<template src="./IncomingCall.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'

// @ts-ignore
import { PhoneIcon, PhoneOffIcon } from 'vue-feather-icons'

import { Sounds } from '~/libraries/SoundManager/SoundManager'
import { User } from '~/types/ui/user'

export default Vue.extend({
  name: 'IncomingCall',
  components: {
    PhoneIcon,
    PhoneOffIcon,
  },
  props: {
    user: {
      type: Object as PropType<User>,
      default: () => {},
      required: true,
    },
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
  mounted() {
    this.$Sounds.playSound(Sounds.CALL)
  },
  beforeDestroy() {
    this.$Sounds.stopSound(Sounds.CALL)
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./IncomingCall.less"></style>
