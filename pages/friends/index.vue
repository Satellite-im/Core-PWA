<template src="./Friends.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import iridium from '~/libraries/Iridium/IridiumManager'
import type { Friend, FriendRequest } from '~/libraries/Iridium/friends/types'
import { Tab } from '~/types/ui/tab'
import { FriendsTabs } from '~/store/friends/types'
import { RootState } from '~/types/store/store'

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
    ...mapState({
      showSidebar: (state) => (state as RootState).ui.showSidebar,
    }),
    friendsList(): Friend[] {
      return this.friends.friends.map((did) => {
        return iridium.users.getUser(did)
      })
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
          badge: this.incomingRequests.length,
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
