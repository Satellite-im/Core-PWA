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
import type { Friend, FriendRequest } from '~/libraries/Iridium/friends/types'
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
      friendsList: iridium.friends.list,
      isQuickchatVisible: false,
     }
  },
  computed: {
    incomingRequests(): Array<FriendRequest> {
      return iridium.friends.requestList.filter(
        (r: FriendRequest) => r.incoming,
      )
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
