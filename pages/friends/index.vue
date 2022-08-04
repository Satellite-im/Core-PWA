<template src="./Friends.html"></template>

<script lang="ts">
import Vue from 'vue'
import iridium from '~/libraries/Iridium/IridiumManager'
import type { Friend, FriendRequest } from '~/libraries/Iridium/friends/types'

export default Vue.extend({
  name: 'Friends',
  layout: (ctx) => (ctx.$device.isMobile ? 'mobile' : 'desktop'),
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
    incomingRequests(): Array<FriendRequest> {
      return iridium.friends?.requestList.filter(
        (r: FriendRequest) => r.incoming && r.status !== 'accepted',
      )
    },
    outgoingRequests(): Array<FriendRequest> {
      return iridium.friends?.requestList.filter(
        (r: FriendRequest) => !r.incoming && r.status === 'pending',
      )
    },
  },
})
</script>

<style scoped lang="less" src="./Friends.less"></style>
