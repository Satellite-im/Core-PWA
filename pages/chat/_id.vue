<template src="./Chat.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  name: 'Chat',
  layout: 'desktop',
  data() {
    return {
      webrtc: iridium.webRTC,
    }
  },
  computed: {
    ...mapState({
      ui: (state) => (state as RootState).ui,
    }),
    isActiveCall(): boolean {
      return this.webrtc.isActiveCall
    },
  },
})
</script>

<style lang="less" src="./Chat.less" scoped></style>
