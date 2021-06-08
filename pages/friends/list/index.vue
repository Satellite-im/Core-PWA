<template src="./FriendsList.html"></template>

<script lang="ts">
import Vue from 'vue'

import { getAlphaSorted } from '~/utilities/friends'

type Route = 'active' | 'requests' | 'blocked' | 'add'

export default Vue.extend({
  name: 'FriendsList',
  layout: 'friends',
  computed: {
    alphaSortedFriends() {
      return getAlphaSorted(this.$mock.friends)
    },
  },
  data() {
    return {
      route: 'active',
    }
  },
  methods: {
    setRoute(route: Route) {
      this.$data.route = route
    }
  }
})
</script>

<style scoped lang="less" src="./FriendsList.less"></style>
