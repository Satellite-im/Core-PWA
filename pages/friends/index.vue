<template src="./Friends.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import iridium from '~/libraries/Iridium/IridiumManager'
import type { Friend, FriendRequest } from '~/libraries/Iridium/friends/types'
import { Tab } from '~/types/ui/tab'
import { RootState } from '~/types/store/store'
import { FriendsTabs } from '~/libraries/Enums/enums'

export default Vue.extend({
  name: 'Friends',
  layout: (ctx) => (ctx.$device.isMobile ? 'mobile' : 'desktop'),
  data() {
    return {
      friends: iridium.friends.state,
    }
  },
  computed: {
    ...mapState({
      showSidebar: (state) => (state as RootState).ui.showSidebar,
    }),
    FriendsTabs: () => FriendsTabs,
    friendsList(): (Friend | undefined)[] {
      return this.friends.friends.map((did) => {
        return (
          iridium.users.getUser(did) || {
            did,
            name: did,
            avatar: '',
          }
        )
      })
    },
    activeTab(): FriendsTabs {
      return this.$route.query.route as FriendsTabs
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
          route: FriendsTabs.DEFAULT,
        },
        {
          text: this.$t('friends.add'),
          route: FriendsTabs.ADD,
        },
        {
          text: this.$t('friends.requests'),
          route: FriendsTabs.REQUESTS,
          badge: this.incomingRequests.length,
        },
      ]
    },
  },
  methods: {
    setRoute(route: string): void {
      this.$router.push({
        query: route ? { route } : {},
      })
    },
  },
})
</script>

<style scoped lang="less" src="./Friends.less"></style>
