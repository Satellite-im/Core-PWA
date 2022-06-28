<template src="./FriendsList.html"></template>

<script lang="ts">
import Vue from 'vue'
import iridium from '~/libraries/Iridium/IridiumManager'

type Route = 'active' | 'requests' | 'blocked' | 'add'
export default Vue.extend({
  name: 'FriendsList',
  layout: 'friends',
  data() {
    return {
      route: 'active',
      data: { friends: null, loading: true },
    }
  },
  async mounted() {
    if (iridium.ready) {
      const friends = await iridium.friends?.get('/')
      console.info('friends loaded', friends)
      this.data.friends = friends
      this.data.loading = false
    }
  },
})
</script>

<style scoped lang="less" src="./FriendsList.less"></style>
