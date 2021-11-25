<template src="./FriendsList.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { DataStateType } from '~/store/dataState/types'

import { getAlphaSorted } from '~/libraries/ui/Friends'

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
    }
  },
  computed: {
    DataStateType: () => DataStateType,
    ...mapState(['friends', 'dataState']),
    alphaSortedFriends() {
      return getAlphaSorted(this.friends.all)
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
