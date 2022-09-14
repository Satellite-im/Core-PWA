<template src="./Chat.html"></template>

<script lang="ts">
import Vue, { computed, ComputedRef, reactive } from 'vue'
import iridium from '~/libraries/Iridium/IridiumManager'
import { conversationHooks } from '~/components/compositions/conversations'

export default Vue.extend({
  name: 'Chat',
  layout: 'desktop',
  setup() {
    const { conversationId, isGroup } = conversationHooks()

    const state = reactive({
      webrtc: iridium.webRTC,
    })

    const isActiveCall: ComputedRef<boolean> = computed(() => {
      return state.webrtc.isActiveCall(conversationId.value)
    })

    return { isGroup, isActiveCall }
  },
})
</script>

<style lang="less" scoped>
.chat {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: flex-end;
  padding: 16px 0 16px 16px;
  min-width: 0;

  .outer-wrapper {
    display: flex;
    overflow: hidden;
    flex-grow: 1;

    .inner-wrapper {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      padding-right: 16px;
    }
  }
}
</style>
