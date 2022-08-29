<template src="./Sidebar.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { UsersIcon, PlusIcon, FolderIcon } from 'satellite-lucide-icons'

import { RootState } from '~/types/store/store'
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
    }
  },
  computed: {
    incomingRequestsLength(): number {
      return Object.values(this.friends.requests).filter(
        (r: FriendRequest) => r.status === 'pending' && r.incoming,
      ).length
    },
    ...mapState({
      ui: (state) => (state as RootState).ui,
    }),
  },
  methods: {
    toggleModal() {
      this.isQuickchatVisible = !this.isQuickchatVisible
    },
  },
})
</script>

<style scoped lang="less" src="./Sidebar.less"></style>
