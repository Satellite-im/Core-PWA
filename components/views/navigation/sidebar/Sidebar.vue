<template src="./Sidebar.html"></template>

<script lang="ts">
import Vue from 'vue'
import { UsersIcon, PlusIcon, FolderIcon } from 'satellite-lucide-icons'
import iridium from '~/libraries/Iridium/IridiumManager'
import type { FriendRequest } from '~/libraries/Iridium/friends/types'
export default Vue.extend({
  components: {
    UsersIcon,
    PlusIcon,
    FolderIcon,
  },
  data() {
    return {
      isQuickchatVisible: false,
      friends: iridium.friends.state,
      filter: '',
    }
  },
  computed: {
    incomingRequestsLength(): number {
      return Object.values(this.friends.requests).filter(
        (r: FriendRequest) => r.status === 'pending' && r.incoming,
      ).length
    },
  },
  methods: {
    toggleModal() {
      this.isQuickchatVisible = !this.isQuickchatVisible
    },
  },
})
</script>

<style scoped lang="less" src="./Sidebar.less"></style>
