<template src="./Friends.html"></template>

<script lang="ts">
import Vue from 'vue'
import iridium from '~/libraries/Iridium/IridiumManager'
import type { Friend, FriendRequest } from '~/libraries/Iridium/friends/types'
import { Tab } from '~/types/ui/tab'
import { FriendsTabs } from '~/store/friends/types'

export default Vue.extend({
  name: 'Friends',
  layout: (ctx) => (ctx.$device.isMobile ? 'mobile' : 'desktop'),
  data() {
    return {
      FriendsTabs,
      friends: iridium.friends.state,
    }
  },
  computed: {
    friendsList(): Friend[] {
      return Object.values(this.friends.details)
    },
    activeTab(): FriendsTabs {
      return this.$store.state.friends.activeTab
    },
    incomingRequests(): FriendRequest[] {
      return Object.values(this.friends.requests).filter(
        (r: FriendRequest) => r.incoming && r.status !== 'accepted',
      )
    },
    tabs(): Tab[] {
      return [
        {
          text: this.$t('friends.friends'),
          route: FriendsTabs.Friends,
        },
        {
          text: this.$t('friends.add'),
          route: FriendsTabs.Add,
        },
        {
          text: this.$t('friends.incoming'),
          route: FriendsTabs.Requests,
          badge: Object.values(iridium.friends.state.requests).filter(
            (r: FriendRequest) => r.incoming && r.status !== 'accepted',
          ).length,
        },
      ]
    },
  },
  methods: {
    setRoute(route: FriendsTabs): void {
      this.$store.commit('friends/setActiveTab', route)
    },
  },
})
</script>

<style scoped lang="less" src="./Friends.less"></style>
