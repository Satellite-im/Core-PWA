<template src="./Group.html" />

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  name: 'GroupMessages',
  layout: 'chat',
  data() {
    return {
      loading: true,
    }
  },
  computed: {
    ...mapState(['media']),
  },
  mounted() {
    const { id } = this.$route.params
    console.log('group', id)

    this.$store.dispatch('textile/fetchGroupMessages', { groupId: id })
    // setTimeout(() => {
    //   this.$data.loading = false
    //   this.$store.dispatch('ui/setMessages', this.$mock.messages)
    // }, 3000)
    // this.$store.dispatch('friends/fetchFriends')
  },
  methods: {
    sendMessage() {
      const { id } = this.$route.params
      this.$store.dispatch('textile/sendGroupMessage', {
        groupId: id,
        message: 'This is my first group message',
      })
    },
  },
})
</script>

<style lang="less" src="./Group.less"></style>
