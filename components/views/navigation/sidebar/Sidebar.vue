<template src="./Sidebar.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'
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
  computed: {
    DataStateType: () => DataStateType,
    ...mapState({
      ui: (state) => (state as RootState).ui,
      dataState: (state) => (state as RootState).dataState,
      media: (state) => (state as RootState).media,
      friends: (state) => (state as RootState).friends,
      groups: (state) => (state as RootState).groups,
      conversations: (state) =>
        (state as RootState).textile.conversations || [],
    }),
    ...mapGetters('textile', ['getSortedFriendsAndGroups']),
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
  },
})
</script>

<style scoped lang="less" src="./Sidebar.less"></style>
