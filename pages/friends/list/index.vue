<template src="./FriendsList.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { DataStateType } from '~/store/dataState/state'

import { getAlphaSorted } from '~/utilities/friends'

type Route = 'active' | 'requests' | 'blocked' | 'add'
declare module 'vue/types/vue' {
  interface Vue {
    friends: any
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
    ...mapState(['friends']),
    alphaSortedFriends() {
      return getAlphaSorted(this.friends.all)
    },
  },
  mounted() {
    this.$store.dispatch('fetchFriends')
  },
  methods: {
    setRoute(route: Route) {
      this.$data.route = route
    },
  },
})
</script>

<style scoped lang="less" src="./FriendsList.less"></style>
