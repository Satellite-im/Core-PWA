<template src="./FriendsList.html"></template>

<script lang="ts">
import Vue from 'vue'
import iridium from '~/libraries/Iridium/IridiumManager'
import type { FriendRequest } from '~/libraries/Iridium/friends/types'

export default Vue.extend({
  name: 'FriendsList',
  layout: 'friends',
  data() {
    return {
      route: 'active',
      data: {
        loading: true,
        friends: iridium.friends.state,
      },
    }
  },
  computed: {
    incomingRequests(): Array<FriendRequest> {
      return this.data.friends.requests.filter((r: FriendRequest) => r.incoming)
    },
    outgoingRequests(): Array<FriendRequest> {
      return this.data.friends.requests.filter(
        (r: FriendRequest) => !r.incoming,
      )
    },
  },
  mounted() {
    this.data.loading = false
  },
})
</script>

<style scoped lang="less" src="./FriendsList.less"></style>
