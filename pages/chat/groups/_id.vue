<template src="./Group.html" />

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { groupMessages } from '~/utilities/Messaging'

export default Vue.extend({
  name: 'GroupMessages',
  layout: 'chat',
  data() {
    return {
      groupMessages: [],
      groupID: '',
    }
  },
  computed: {
    ...mapState(['media']),
    groupedMessages() {
      const { id } = this.$route.params
      const conversation = this.$typedStore.state.textile.conversations[id]

      if (!conversation) {
        return []
      }

      const { messages, replies, reactions } = conversation

      return groupMessages(messages, replies, reactions)
    },
  },
  mounted() {
    const { id } = this.$route.params
    this.getMessages(id)
    this.subscribeToGroup(id)
  },
  methods: {
    async getMessages(id: string) {
      this.$data.groupID = id
      this.$data.groupMessages = await this.$store.dispatch(
        'textile/fetchGroupMessages',
        { groupId: id },
      )
    },
    async subscribeToGroup(id: string) {
      this.$data.groupMessages = await this.$store.dispatch(
        'textile/subscribeToGroup',
        { groupId: id },
      )
    },
  },
})
</script>

<style lang="less" src="./Group.less"></style>
