<template src="./TypingIndicator.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { ConversationParticipant } from '~/store/conversation/types'
export default Vue.extend({
  computed: {
    ...mapGetters('conversation', ['typingParticipants']),
    text(): string {
      return this.$tc('messaging.typing', this.typingParticipants.length, {
        user: this.typingParticipants
          .map((p: ConversationParticipant) => p.name)
          .join(', '),
      })
    },
  },
})
</script>

<style scoped lang="less" src="./TypingIndicator.less"></style>
