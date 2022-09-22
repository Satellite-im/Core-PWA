<template src="./TypingIndicator.html"></template>

<script lang="ts">
import Vue, { ComputedRef, computed } from 'vue'
import { conversationHooks } from '~/components/compositions/conversations'

export default Vue.extend({
  setup() {
    // @ts-ignore
    const $nuxt = useNuxtApp()

    const { otherTypingParticipants } = conversationHooks()

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
