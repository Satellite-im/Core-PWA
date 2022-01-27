<template src="./Sidebar.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'

import {
  UsersIcon,
  UserPlusIcon,
  PlusCircleIcon,
  FolderIcon,
  MessageSquareIcon,
  MenuIcon,
} from 'satellite-lucide-icons'

import { DataStateType } from '~/store/dataState/types'
import { Group } from '~/types/ui/core'
import { User } from '~/types/ui/user'

declare module 'vue/types/vue' {
  interface Vue {
    sortUserList: Function
  }
}

export default Vue.extend({
  components: {
    UsersIcon,
    UserPlusIcon,
    PlusCircleIcon,
    FolderIcon,
    MessageSquareIcon,
    MenuIcon,
  },
  data() {
    return {
      userList: [],
    }
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
    groups: {
      type: Array as PropType<Array<Group>>,
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
    ...mapState(['ui', 'dataState', 'media', 'friends', 'textile']),
    toggleView: {
      get() {
        return this.ui.showSidebarUsers
      },
      set(value: Boolean) {
        this.$store.commit('ui/showSidebarUsers', value)
      },
    },
  },
  methods: {
    toggleModal() {
      this.$store.commit('ui/toggleModal', {
        name: 'quickchat',
        state: !this.ui.modals.quickchat,
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
    sortUserList(textileObj: any) {
      this.$store.commit('friends/sortFriends', textileObj)
    },
  },
  watch: {
    textile: {
      handler(newValue) {
        this.sortUserList(newValue)
      },
      deep: true,
    },
  },
  mounted() {
    this.sortUserList(this.$store.state.textile)
  },
})
</script>

<style scoped lang="less" src="./Sidebar.less"></style>
