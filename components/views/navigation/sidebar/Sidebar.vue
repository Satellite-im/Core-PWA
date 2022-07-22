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

import { DataStateType } from '~/store/dataState/types'
import GroupInvite from '~/components/views/group/invite/Invite.vue'
import { RootState } from '~/types/store/store'
import { ModalWindows } from '~/store/ui/types'
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
    GroupInvite,
  },
  props: {
    sidebar: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      friends: iridium.friends.state,
    }
  },
  computed: {
    incomingRequests(): FriendRequest[] {
      return this.friends.requests.filter((r: FriendRequest) => r.incoming)
    },
    DataStateType: () => DataStateType,
    ...mapState({
      ui: (state) => (state as RootState).ui,
      dataState: (state) => (state as RootState).dataState,
    }),
  },
  methods: {
    toggleModal(type: ModalWindows.QUICK_CHAT) {
      this.$store.commit('ui/toggleModal', {
        name: type,
        state: !this.ui.modals[type],
      })
    },
    toggleMenu() {
      this.$store.commit('ui/showSidebar', !this.ui.showSidebar)
    },
  },
})
</script>

<style scoped lang="less" src="./Sidebar.less"></style>
