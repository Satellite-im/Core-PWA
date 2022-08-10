<template src="./Connected.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { CircleIcon } from 'satellite-lucide-icons'
import { RootState } from '~/types/store/store'
import { ConversationParticipant } from '~/store/conversation/types'
import iridium from '~/libraries/Iridium/IridiumManager'
import { Conversation } from '~/libraries/Iridium/chat/types'

export default Vue.extend({
  components: {
    CircleIcon,
  },
  data() {
    return {
      chat: iridium.chat,
    }
  },
  computed: {
    ...mapState({
      allFriends: (state) => (state as RootState).friends.all,
    }),
    conversationId(): Conversation['id'] | undefined {
      return this.$route.params.id
    },
    otherParticipants() {
      if (!this.conversationId) {
        return
      }
      return this.chat.getOtherParticipants(this.conversationId)
    },
    onlineParticipants() {
      if (!this.conversationId) {
        return
      }
      return this.chat.getOnlineParticipants(this.conversationId)
    },
    /**
     * @method participantsText
     * @description builds translated string for online/offline status
     */
    participantsText(): string {
      // if DM with single person
      if (this.otherParticipants.length === 1) {
        return this.$tc(
          this.onlineParticipants.length ? 'ui.online' : 'ui.offline',
          1,
          {
            name: this.otherParticipants[0].name,
          },
        )
      }
      // if group
      return this.$tc('ui.online', this.onlineParticipants.length, {
        name: this.onlineParticipants
          .map((p: ConversationParticipant) => p.name)
          .join(', '),
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
