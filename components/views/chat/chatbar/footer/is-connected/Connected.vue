<template src="./Connected.html" />

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { CircleIcon } from 'satellite-lucide-icons'
import { Config } from '~/config'
import { ConversationConnection } from '~/store/conversation/types.ts'

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
    ...mapState(['friends', 'conversation']),
    /**
     * @method participantStatus
     * @description Get an object that has all participants, connected, and disconnected. The filtering !== null filters out your own username
     */
    participantStatus(): object {
      return {
        PARTICIPANTS: this.conversation.participants
          .filter((participant) => participant.name != null)
          .map((participant) => {
            return participant.name
          }),
        CONNECTED: this.conversation.participants
          .filter(
            (participant) =>
              participant.state === ConversationConnection.CONNECTED &&
              participant.name != null,
          )
          .map((participant) => {
            return participant.name
          }),
        DISCONNECTED: this.conversation.participants
          .filter(
            (participant) =>
              participant.state === ConversationConnection.DISCONNECTED &&
              participant.name != null,
          )
          .map((participant) => {
            return participant.name
          }),
      }
    },
    /**
     * @method participantsText
     * @description three possible strings returned, one for single user, one for multiple users, or no participants (used only for groups)
     */
    participantsText(): object {
      // if there is only one participant (DM) OR there is only one connected user (1 of group chat), use singular
      if (
        this.participantStatus.PARTICIPANTS.length === 1 ||
        this.participantStatus.CONNECTED.length === 1
      ) {
        return {
          names: this.participantStatus.PARTICIPANTS[0],
          description: `${this.$t('ui.is')} ${
            this.participantStatus.CONNECTED.length
              ? this.$t('ui.online')
              : this.$t('ui.offline')
          }`,
        }
      }
      // if there are multiple connected (2+ group) user plural
      if (
        this.participantStatus.PARTICIPANTS.length > 1 &&
        this.participantStatus.CONNECTED.length > 1
      ) {
        return {
          names: this.participantStatus.CONNECTED.join(', '),
          description: `${this.$t('ui.are')} ${this.$t('ui.online')}`,
        }
      }
      return { names: null, description: this.$t('ui.all_offline') }
    },
  },
  watch: {
    'conversation.participants': {
      handler() {},
      deep: true,
      immediate: true,
    },
  },
  methods: {
    /**
     * @method friendConnected
     * @description Send the user ID/address in, get a boolean of it the signal is currently open
     * @param friendId Address of the current user
     * @example
     * friendConnected('user1') // true
     */
    friendConnected(friendId: string): boolean {
      return (
        this.friends.all.find((friend) => friend.address === friendId).state ===
        'online'
      )
    },
  },
})
</script>

<style scoped lang="less" src="./Connected.less"></style>
