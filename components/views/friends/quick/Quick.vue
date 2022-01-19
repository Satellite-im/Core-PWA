<template src="./Quick.html" />

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'Quick',
  data() {
    return {
      friends: [],
    }
  },
  methods: {
    confirm() {
      /* Create Group and Start Chat.  For now Group Messages needs some changes on Solana & IPFS so leave this blank  */
      console.log(this.friends)
      if (this.$data.friends.length === 1) {
        this.$router.push(`/chat/direct/${this.$data.friends[0].address}`)
      } else {
        // logic for creating group chat
      }

      // close quickchat modal after redirecting to chat
      this.$store.commit('ui/toggleModal', {
        name: 'quickchat',
        state: false,
      })
    },
  },
})
</script>

<style scoped lang="less" src="./Quick.less"></style>
