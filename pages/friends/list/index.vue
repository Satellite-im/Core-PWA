<template src="./FriendsList.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { cloneDeep } from 'lodash'
import { DataStateType } from '~/store/dataState/types'

import { getAlphaSorted } from '~/libraries/ui/Friends'
import { OutgoingRequest } from '~/types/ui/friends'

type Route = 'active' | 'requests' | 'blocked' | 'add'
declare module 'vue/types/vue' {
  interface Vue {
    friends: any
    initRoute: () => void
  }
}
export default Vue.extend({
  name: 'FriendsList',
  layout: 'friends',
  data() {
    return {
      route: 'active',
      featureReadyToShow: false,
    }
  },
  computed: {
    DataStateType: () => DataStateType,
    ...mapState(['friends', 'dataState']),
    alphaSortedFriends() {
      return getAlphaSorted(this.friends.all)
    },
    alphaSortedOutgoing() {
      return cloneDeep(this.friends.outgoingRequests).sort(
        (a: OutgoingRequest, b: OutgoingRequest) =>
          a.userInfo?.name.localeCompare(b.userInfo?.name),
      )
    },
  },
  watch: {
    '$route.query'() {
      this.initRoute()
    },
  },
  mounted() {
    this.initRoute()
  },
  methods: {
    /**
     * @method setRoute DocsTODO
     * @description
     * @param route
     * @example
     */
    setRoute(route: Route) {
      this.$router.replace({ path: this.$route.path, query: { tab: route } })
    },
    /**
     * @method initRoute DocsTODO
     * @description
     * @param
     * @example
     */
    initRoute() {
      const query = this.$route.query
      if (query && query.tab) {
        this.$data.route = query.tab
        return
      }
      this.$data.route = 'active'
    },
  },
})
</script>

<style scoped lang="less" src="./FriendsList.less"></style>
