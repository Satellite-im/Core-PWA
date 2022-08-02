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
    ...mapState(['ui']),
  },
  methods: {
    clearReplyChatbarMessage() {
      this.$store.commit('ui/clearReplyChatbarMessage')
    },
  },
})
</script>
<style lang="less" src="./Reply.less"></style>
