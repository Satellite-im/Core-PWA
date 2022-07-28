<template src="./FriendsList.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import iridium from '~/libraries/Iridium/IridiumManager'
import type { Friend, FriendRequest } from '~/libraries/Iridium/friends/types'
import { RootState } from '~/types/store/store'

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
    ...mapState({
      showSidebar: (state) => (state as RootState).ui.showSidebar,
    }),

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

<style scoped lang="less" src="./FriendsList.less"></style>
