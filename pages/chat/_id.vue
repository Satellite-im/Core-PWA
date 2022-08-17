<template src="./Chat.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { RootState } from '~/types/store/store'
import { useWebRTC } from '~/libraries/Iridium/webrtc/WebRTCManager'

export default Vue.extend({
  name: 'Chat',
  layout: 'desktop',
  setup() {
    const { isActiveCall } = useWebRTC()

    return { isActiveCall }
  },
  computed: {
    ...mapState({
      ui: (state) => (state as RootState).ui,
    }),
  },
})
</script>

<style lang="less" src="./Chat.less" scoped></style>
