<template src="./FriendsList.html"></template>

<script lang="ts">
import Vue from 'vue'
import iridium from '~/libraries/Iridium/IridiumManager'
import type { FriendRequest } from '~/libraries/Iridium/friends/types'

type Route = 'active' | 'requests' | 'blocked' | 'add'
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
      console.log('incoming req')
      return this.data.friends.requests.filter(
        (r: FriendRequest) => r.incoming && r.status === 'pending',
      )
    },
    outgoingRequests(): Array<FriendRequest> {
      console.log('outoging req')
      return this.data.friends.requests.filter(
        (r: FriendRequest) => !r.incoming && r.status === 'pending',
      )
    },
  },
  async mounted() {
    this.data.loading = false
  },
})
</script>

<style scoped lang="less" src="./FriendsList.less"></style>
