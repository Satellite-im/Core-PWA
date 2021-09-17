<template src="./IncomingCall.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { User } from '~/types/ui/user'

export default Vue.extend({
  name: 'IncomingCall',
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
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./IncomingCall.less"></style>
