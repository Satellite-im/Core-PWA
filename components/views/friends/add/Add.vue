<template src="./Add.html"></template>
<script lang="ts">
import Vue from 'vue'
import { FriendRequest } from '~/libraries/Iridium/friends/types'
import { User } from '~/libraries/Iridium/users/types'

export default Vue.extend({
  data() {
    return {
      error: '',
      friendId: '',
      searching: false,
      request: null as FriendRequest | null,
      user: null as User | null,
    }
  },
})
</script>
<style scoped lang="less" src="./Add.less"></style>
