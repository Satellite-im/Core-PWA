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
import { Conversation } from '~/store/textile/types'
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
    toggle: {
      type: Function,
      default: () => {},
    },
    showMenu: {
      type: Function,
      default: () => {},
    },
    sidebar: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      friends: iridium.friends?.state,
    }
  },
  computed: {
    incomingRequests(): Array<FriendRequest> {
      return Object.values(this.friends?.requests || []).filter(
        (r: FriendRequest) => r.incoming && r.status === 'pending',
      )
    },
    DataStateType: () => DataStateType,
    ...mapState({
      ui: (state) => (state as RootState).ui,
      dataState: (state) => (state as RootState).dataState,
      media: (state) => (state as RootState).media,
      groups: () => iridium.groups?.state,
      conversations: () => ({}),
    }),
  },
  async mounted() {
    iridium.friends?.on('request/changed', () => {
      this.friends = { ...iridium.friends?.state }
    })
  },
  methods: {
    toggleModal(type: ModalWindows.QUICK_CHAT | ModalWindows.CREATE_GROUP) {
      this.$store.commit('ui/toggleModal', {
        name: type,
        state: !this.ui.modals[type],
      })
    },
    closeGroupInviteModal() {
      this.$store.commit('ui/toggleModal', {
        name: 'groupInvite',
        state: { isOpen: false },
      })
    },
    gotoAddFriends() {
      if (this.$route.name?.includes('friends-list')) {
        if (this.$device.isMobile) {
          this.$store.commit('ui/showSidebar', false)
        }
      } else {
        this.$router.push({ path: '/friends/list' })
      }
    },
    sortUserList(conversations: Conversation) {
      this.$store.commit('friends/sortFriends', conversations)
    },
  },
})
</script>

<style scoped lang="less" src="./Sidebar.less"></style>
