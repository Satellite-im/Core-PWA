<template src="./Connected.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { CircleIcon } from 'satellite-lucide-icons'
import { RootState } from '~/types/store/store'
import { ConversationParticipant } from '~/store/conversation/types'

export default Vue.extend({
  components: {
    CircleIcon,
  },
  props: {
    typing: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  computed: {
    ...mapState({
      allFriends: (state) => (state as RootState).friends.all,
    }),
    ...mapGetters('conversation', ['otherParticipants', 'onlineParticipants']),
    /**
     * @method participantsText
     * @description
     */
    participantsText(): string {
      // if DM with single person
      if (this.otherParticipants.length === 1) {
        return this.$tc(
          this.onlineParticipants.length
            ? 'ui.online_status'
            : 'ui.offline_status',
          1,
          {
            name: this.otherParticipants[0].name,
          },
        )
      }
      // if group
      return this.$tc('ui.online_status', this.onlineParticipants.length, {
        name: this.onlineParticipants
          .map((p: ConversationParticipant) => p.name)
          .join(', '),
      })
    },
    isOnline(): string {
      return this.onlineParticipants.length ? 'is-online' : 'is-offline'
    },
  },
  watch: {
    'conversation.participants': {
      handler() {},
      deep: true,
      immediate: true,
    },
  },
})
</script>

<style scoped lang="less" src="./Connected.less"></style>
