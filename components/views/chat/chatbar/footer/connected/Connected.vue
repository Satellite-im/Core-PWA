<template src="./Connected.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { CircleIcon } from 'satellite-lucide-icons'
import { RootState } from '~/types/store/store'
import { Conversation } from '~/libraries/Iridium/chat/types'
import iridium from '~/libraries/Iridium/IridiumManager'
import { UserType } from '~/libraries/Iridium/users/types'

export default Vue.extend({
  components: {
    CircleIcon,
  },
  data() {
    return {
      userStatus: iridium.users.userStatus,
    }
  },
  computed: {
    ...mapState({
      allFriends: (state) => (state as RootState).friends.all,
    }),
    conversationId(): Conversation['id'] | undefined {
      return this.$route.params.id
    },
    conversation(): Conversation | undefined {
      if (!this.conversationId) {
        return undefined
      }
      return iridium.chat.state.conversations[this.conversationId]
    },
    isGroup(): boolean {
      return this.conversation?.type === 'group'
    },
    participants(): UserType[] {
      if (!this.conversation) return []

      return this.conversation.participants.map((did) => ({
        ...iridium.users.getUser(did),
        did,
        status: this.userStatus[did] || 'offline',
      }))
    },
    otherParticipants(): UserType[] {
      return this.participants.filter((p) => p.did !== iridium.connector?.id)
    },
    onlineParticipants(): UserType[] {
      return this.otherParticipants.filter((p) => p.status === 'online')
    },
    /**
     * @method participantsText
     * @description builds translated string for online/offline status
     */
    participantsText(): string {
      if (!this.conversation) {
        return ''
      }

      if (!this.isGroup) {
        return this.$tc(
          this.onlineParticipants.length ? 'ui.online' : 'ui.offline',
          1,
          {
            name: this.otherParticipants[0].name,
          },
        )
      }

      return this.$tc('ui.online', this.onlineParticipants.length, {
        name: this.onlineParticipants.map((p) => p.name).join(', '),
      })
    },
    /**
     * @method connectedStatus
     * @description sets css class
     */
    connectedStatus(): string {
      return this.onlineParticipants.length ? 'is-online' : 'is-offline'
    },
  },
})
</script>

<style scoped lang="less" src="./Connected.less"></style>
