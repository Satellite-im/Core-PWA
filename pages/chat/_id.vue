<template src="./Chat.html"></template>

<script lang="ts">
import Vue, { computed, ComputedRef } from 'vue'
import { conversationHooks } from '~/components/compositions/conversations'
import { webrtcHooks } from '~/components/compositions/webrtc'

export default Vue.extend({
  name: 'Chat',
  layout: 'desktop',
  setup() {
    // @ts-ignore
    const $nuxt = useNuxtApp()
    const conversationId: ComputedRef<string> = computed(() => {
      return $nuxt.$route.params.id
    })

    const { isGroup } = conversationHooks(conversationId.value)
    const { isActiveCall } = webrtcHooks(conversationId.value)

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
  padding: 16px 0 0 16px;
  min-width: 0;

  .outer-wrapper {
    display: flex;
    overflow: hidden;
    flex-grow: 1;
    padding-bottom: 16px;

    .inner-wrapper {
      width: 100%;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      padding-right: 16px;
    }
  }
}
</style>
