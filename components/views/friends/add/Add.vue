<template src="./Add.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { FriendRequest, User } from '~/libraries/Iridium/friends/types'
import { RootState } from '~/types/store/store'

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
  computed: {
    ...mapState({
      showSidebar: (state) => (state as RootState).ui.showSidebar,
    }),
  },
})
</script>
<style scoped lang="less" src="./Add.less"></style>
