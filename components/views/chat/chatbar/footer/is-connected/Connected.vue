<template src="./Connected.html" />

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { CircleIcon } from 'satellite-lucide-icons'
import { Config } from '~/config'

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
    ...mapState(['ui', 'webrtc', 'friends', 'conversation']),
    onlineParticipants() {
      return this.conversation.participants
        .filter((participant) => participant.state === 'CONNECTED')
        .map((participant) => participant.name)
    },
    onlineParticipantsText() {
      if (this.onlineParticipants.length === 1) {
        return `${this.onlineParticipants[0]} ${this.$t('ui.is')} ${this.$t(
          'ui.online',
        )}`
      }
      if (this.onlineParticipants.length > 4) {
        return `${this.onlineParticipants.length} ${this.$t(
          'ui.participants',
        )} ${this.$t('ui.are')} ${this.$t('ui.online')}`
      }
      if (this.onlineParticipants.length) {
        return `${this.onlineParticipants.join(', ')} ${this.$t(
          'ui.are',
        )} ${this.$t('ui.online')}`
      }
      if (this.conversation.participants.length === 1) {
        return `${this.conversation.participants[0]} ${this.$t(
          'ui.is',
        )} ${this.$t('ui.offline')}`
      }
      return `${this.conversation.participants.join(', ')} ${this.$t(
        'ui.are',
      )} ${this.$t('ui.offline')}`
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
