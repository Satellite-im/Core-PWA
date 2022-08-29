<template src="./Invite.html"></template>

<script lang="ts">
import Vue from 'vue'
import { Conversation } from '~/libraries/Iridium/chat/types'
import iridium from '~/libraries/Iridium/IridiumManager'
import { User } from '~/libraries/Iridium/users/types'

export default Vue.extend({
  data() {
    return {
      recipients: [] as User[],
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
      if (!this.recipients.length || !this.conversationId) {
        return
      }
      this.error = ''
      this.isLoading = true

      try {
        await iridium.chat.addMembersToGroup(
          this.conversationId,
          this.recipients.map((user) => user.did),
        )
      } catch (e) {
        this.error = (e as Error).message
      }
      if (this.error) {
        return
      }
      this.$emit('close')
    },
  },
})
</script>

<style scoped lang="less" src="./Invite.less"></style>
