<template src="./Group.html" />

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { groupMessages } from '~/utilities/Messaging'
import { MessageGroup } from '~/types/messaging'

export default Vue.extend({
  name: 'GroupMessages',
  layout: 'chat',
  data() {
    return {
      groupMessages: [],
      groupID: '',
      groupMembers: [],
    }
  },
  computed: {
    ...mapState(['media']),
    ...mapGetters('textile', ['getInitialized']),
    groupedMessages(): MessageGroup {
      const { id } = this.$route.params
      const conversation = this.$typedStore.state.textile.conversations[id]
      if (!conversation) {
        return []
      }

      const { messages, replies, reactions } = conversation

      return groupMessages(messages, replies, reactions)
    },
  },
  watch: {
    getInitialized: {
      handler(nextValue) {
        if (nextValue) {
          const { id } = this.$route.params
          this.getMessages(id)
          this.subscribeToGroup(id)
          this.fetchGroupMembers(id)
        }
      },
      immediate: true,
    },
  },
  methods: {
    async getMessages(id: string) {
      this.$data.groupID = id
      this.$data.groupMessages = await this.$store.dispatch(
        'textile/fetchGroupMessages',
        { groupId: id, setActive: true },
      )
    },
    async subscribeToGroup(id: string) {
      this.$data.groupMessages = await this.$store.dispatch(
        'textile/subscribeToGroup',
        { groupId: id },
      )
    },
    async fetchGroupMembers(id: string) {
      await this.$store.dispatch('groups/fetchGroupMembers', id)
    },
  },
})
</script>

<style lang="less" src="./Group.less"></style>
