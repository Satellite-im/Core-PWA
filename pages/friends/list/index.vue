<template src="./FriendsList.html"></template>

<script lang="ts">
import Vue from 'vue'
import iridium from '~/libraries/Iridium/IridiumManager'
import type { Friend, FriendRequest } from '~/libraries/Iridium/friends/types'

export default Vue.extend({
  name: 'FriendsList',
  layout: 'basic',
  data() {
    return {
      route: 'active',
      friends: iridium.friends?.state,
    }
  },
  computed: {
    friendsList(): Array<Friend> {
      return iridium.friends?.list
    },
    friendsRequests(): Array<FriendRequest> {
      return iridium.friends?.requestList
    },
    incomingRequests(): Array<FriendRequest> {
      return iridium.friends?.requestList.filter(
        (r: FriendRequest) => r.incoming && r.status !== 'accepted',
      )
    },
    outgoingRequests(): Array<FriendRequest> {
      return iridium.friends?.requestList.filter(
        (r: FriendRequest) => !r.incoming,
      )
    },
  },
})
</script>

<style scoped lang="less" src="./FriendsList.less"></style>
