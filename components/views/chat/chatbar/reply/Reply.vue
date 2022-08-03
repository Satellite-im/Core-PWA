<template src="./Reply.html" />
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { XIcon } from 'satellite-lucide-icons'

export default Vue.extend({
  components: {
    XIcon,
  },
  computed: {
    ...mapState(['chat']),
  },
  methods: {
    clearReplyChatbarMessage() {
      this.$store.commit('chat/clearReplyChatbarMessage')
    },
  },
})
</script>
<style lang="less" src="./Reply.less"></style>
