<template src="./Sidebar.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import {
  UsersIcon,
  UserPlusIcon,
  PlusIcon,
  PlusCircleIcon,
  FolderIcon,
  MessageSquareIcon,
  MenuIcon,
} from 'satellite-lucide-icons'

import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'
import type { FriendRequest } from '~/libraries/Iridium/friends/types'
export default Vue.extend({
  components: {
    UsersIcon,
    UserPlusIcon,
    PlusIcon,
    PlusCircleIcon,
    FolderIcon,
    MessageSquareIcon,
    MenuIcon,
  },
  props: {
    sidebar: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      requests: iridium.friends.state.requests,
      isQuickchatVisible: false,
    }
  },
  computed: {
    incomingRequests(): number {
      return this.requests.filter((r: FriendRequest) => r.incoming).length
    },
    ...mapState({
      ui: (state) => (state as RootState).ui,
    }),
  },
  methods: {
    toggleModal() {
      this.isQuickchatVisible = !this.isQuickchatVisible
    },
    toggleMenu() {
      this.$store.commit('ui/showSidebar', !this.ui.showSidebar)
    },
  },
})
</script>

<style scoped lang="less" src="./Sidebar.less"></style>
