<template src="./Invite.html"></template>

<script lang="ts">
import Vue from 'vue'
import { Conversation } from '~/libraries/Iridium/chat/types'
import iridium from '~/libraries/Iridium/IridiumManager'
import { Friend } from '~/libraries/Iridium/friends/types'

export default Vue.extend({
  data() {
    return {
      recipients: [] as Friend[],
      isLoading: false,
      recipient: '',
      error: '',
    }
  },
  computed: {
    groupMembers(): string[] {
      return this.conversation?.participants ?? []
    },
    conversationId(): Conversation['id'] | undefined {
      return this.$route.params.id
    },
    conversation(): Conversation | undefined {
      if (!this.conversationId) {
        return undefined
      }
      return iridium.chat.state.conversations[this.conversationId]
    },
  },
  methods: {
    async confirm() {
      if (!this.recipients.length) {
        return
      }
      this.error = ''
      this.isLoading = true

      await Promise.all(
        this.recipients.map(async (recipient) => {
          await iridium.groups.addMemberToGroup(
            this.$route.params.id,
            recipient.did,
          )
        }),
      ).catch((e) => (this.error = e.message))
      if (this.error) {
        return
      }
      this.$emit('close')
    },
  },
})
</script>

<style scoped lang="less" src="./Invite.less"></style>
