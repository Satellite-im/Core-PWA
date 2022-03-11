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
    ...mapState(['ui', 'webrtc', 'friends']),
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
      if (this.webrtc) {
        return this.webrtc.connectedPeers.includes(friendId)
      }
      return false
    },
  },
})
</script>

<style scoped lang="less" src="./Connected.less"></style>
