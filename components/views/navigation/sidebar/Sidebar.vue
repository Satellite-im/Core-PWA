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

import { mobileSwipe } from '~/components/mixins/Swipe/Swipe'
import { DataStateType } from '~/store/dataState/types'
import { Group } from '~/types/ui/core'
import { User } from '~/types/ui/user'

export default Vue.extend({
  components: {
    UsersIcon,
    UserPlusIcon,
    PlusCircleIcon,
    FolderIcon,
    MessageSquareIcon,
    MenuIcon,
  },
  mixins: [mobileSwipe],
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
  },
  computed: {
    DataStateType: () => DataStateType,
    ...mapState(['ui', 'dataState', 'media', 'friends']),
    toggleView: {
      get() {
        return this.ui.showSidebarUsers
      },
      set(value: Boolean) {
        this.$store.commit('ui/showSidebarUsers', value)
      },
    },
  },
  mounted() {
    /**
     * Opens and closes the left hand sidebar upon clicking on 'direct-chat', 'friends-list', and 'files-browse'
     * when user is on a mobile device
     */
    if (this.$route.name?.includes('chat-direct') && this.$device.isMobile) {
      // this.$props.toggle()
      this.$props.showMenu()
    }

    if (this.$route.name?.includes('friends-list') && this.$device.isMobile) {
      // this.$props.toggle()
      this.$props.showMenu()
    }

    if (this.$route.name?.includes('files-browse') && this.$device.isMobile) {
      // this.$props.toggle()
      this.$props.showMenu()
    }
  },
  methods: {
    toggleModal() {
      this.$store.commit('ui/toggleModal', {
        name: 'quickchat',
        state: !this.ui.modals.quickchat,
      })
    },
  },
})
</script>

<style scoped lang="less" src="./Sidebar.less"></style>
