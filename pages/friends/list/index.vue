<template src="./FriendsList.html"></template>

<script lang="ts">
import Vue from 'vue'
import iridium from '~/libraries/Iridium/IridiumManager'
import type { FriendRequest } from '~/libraries/Iridium/friends/types'

export default Vue.extend({
  name: 'FriendsList',
  layout: 'basic',
  data() {
    return {
      route: 'active',
      friends: iridium.friends.state,
    }
  },
  computed: {
    incomingRequests(): Array<FriendRequest> {
      return this.friends.requests.filter((r: FriendRequest) => r.incoming)
    },
    outgoingRequests(): Array<FriendRequest> {
      return this.friends.requests.filter((r: FriendRequest) => !r.incoming)
    },
  },
})
</script>

<style scoped lang="less" src="./FriendsList.less"></style>
