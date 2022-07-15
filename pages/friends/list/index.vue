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
        friends: iridium.friends?.state,
      },
    }
  },
  computed: {
    incomingRequests(): Array<FriendRequest> {
      return Object.values(this.data.friends?.requests || []).filter(
        (r: FriendRequest) => r.incoming && r.status === 'pending',
      )
    },
    outgoingRequests(): Array<FriendRequest> {
      return Object.values(this.data.friends?.requests || []).filter(
        (r: FriendRequest) => !r.incoming && r.status === 'pending',
      )
    },
  },
  async mounted() {
    this.data.loading = false
    iridium.friends?.on('request/changed', () => {
      this.data.friends = { ...iridium.friends?.state }
    })
  },
})
</script>

<style scoped lang="less" src="./FriendsList.less"></style>
