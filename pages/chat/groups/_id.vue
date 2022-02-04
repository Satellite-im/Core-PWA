<template src="./Group.html" />

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

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
  },
  mounted() {
    const { id } = this.$route.params
    this.getMessages(id)
    // setTimeout(() => {
    //   this.$data.loading = false
    //   this.$store.dispatch('ui/setMessages', this.$mock.messages)
    // }, 3000)
    // this.$store.dispatch('friends/fetchFriends')
  },
  methods: {
    sendMessage() {
      const { id } = this.$route.params
      this.$data.groupID = { id }
      this.$store.dispatch('textile/sendGroupMessage', {
        groupId: id,
        message: 'This is my first group message',
      })
    },
    async getMessages(id: string) {
      this.$data.groupID = id
      this.$data.groupMessages = await this.$store.dispatch(
        'textile/fetchGroupMessages',
        { groupId: id },
      )
      console.log(' in FRONTEND', this.$data.groupMessages)
    },
  },
})
</script>

<style lang="less" src="./Group.less"></style>
