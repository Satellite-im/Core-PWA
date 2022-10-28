<template src="./TypingIndicator.html"></template>

<script lang="ts">
import { useNuxtApp } from '@nuxt/bridge/dist/runtime/app'
import Vue, { ComputedRef, computed } from 'vue'
import { conversationHooks } from '~/components/compositions/conversations'

export default Vue.extend({
  setup() {
    const $nuxt = useNuxtApp()
    const conversationId: ComputedRef<string | undefined> = computed(() => {
      return $nuxt.$route.params.id
    })

    const { otherTypingParticipants } = conversationHooks(conversationId.value)

    const text: ComputedRef<string> = computed(() => {
      return $nuxt.$i18n.tc(
        'messaging.typing',
        otherTypingParticipants.value.length,
        {
          user: otherTypingParticipants.value.map((u) => u?.name).join(', '),
        },
      )
    })

    return { otherTypingParticipants, text }
  },
})
</script>

<style scoped lang="less" src="./TypingIndicator.less"></style>
