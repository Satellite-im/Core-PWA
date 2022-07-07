<template src="./FriendsList.html"></template>

<script lang="ts">
import Vue from 'vue'
import iridium from '~/libraries/Iridium/IridiumManager'

type Route = 'active' | 'requests' | 'blocked' | 'add'
export default Vue.extend({
  name: 'FriendsList',
  layout: 'friends',
  data() {
    return {
      route: 'active',
      data: {
        loading: true,
        friends: iridium.friends?.state,
      },
    }
  },
  computed: {
    incomingRequests() {
      if (!iridium.friends?.state.requests) return []
      return Object.entries(iridium.friends?.state.requests).filter(
        ([_key, request]) => request.incoming && request.status === 'pending',
      )
    },
    outgoingRequests() {
      if (!iridium.friends?.state.requests) return []
      return Object.entries(iridium.friends?.state.requests).filter(
        ([_key, request]) => !request.incoming && request.status === 'pending',
      )
    },
  },
  async mounted() {
    this.data.loading = false
    iridium.friends?.on('request/changed', () => this.$forceUpdate())
  },
})
</script>

<style scoped lang="less" src="./FriendsList.less"></style>
