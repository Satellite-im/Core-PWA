<template src="./Sidebar.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { sortBy } from 'lodash'
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
import { User } from '~/types/ui/user'
import { Conversation } from '~/store/textile/types'
import GroupInvite from '~/components/views/group/invite/Invite.vue'
import { Group } from '~/store/groups/types'

declare module 'vue/types/vue' {
  interface Vue {
    sortUserList: Function
  }
}

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
    users: {
      type: Array as PropType<Array<User>>,
      default: () => [],
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
    ...mapState(['ui', 'dataState', 'media', 'friends', 'textile', 'groups']),
    toggleView: {
      get() {
        return this.ui.showSidebarUsers
      },
      set(value: Boolean) {
        this.$store.commit('ui/showSidebarUsers', value)
      },
    },
    usersAndGroups() {
      const combined = [...this.$props.users, ...this.groups.all]
      return combined.sort((a, b) => a.lastUpdate - b.lastUpdate)
    },
    sortedGroups() {
      return sortBy(this.groups.all, 'name')
    },
  },
  watch: {
    'textile.conversations': {
      handler(newValue) {
        this.sortUserList(newValue)
      },
      deep: true,
      immediate: true,
    },
  },
  beforeMount() {
    this.$store.dispatch('groups/fetchGroups', {}, { root: true })
    this.$store.dispatch('groups/subscribeToGroupInvites', {}, { root: true })
  },
  beforeDestroy() {
    this.$store.dispatch(
      'groups/unsubscribeFromGroupInvites',
      {},
      { root: true },
    )
  },
  methods: {
    toggleModal(type: 'quickchat' | 'creategroup') {
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
