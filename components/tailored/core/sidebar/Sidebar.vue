<template src="./Sidebar.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'

// @ts-ignore
import { UsersIcon, FolderIcon, InboxIcon, MenuIcon } from 'vue-feather-icons'

import { mobileSwipe } from '~/components/mixins/Swipe/Swipe'
import { DataStateType } from '~/store/dataState/types'
import { Group } from '~/types/ui/core'
import { User } from '~/types/ui/user'

export default Vue.extend({
  components: {
    UsersIcon,
    FolderIcon,
    InboxIcon,
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
  },
  computed: {
    DataStateType: () => DataStateType,
    ...mapState(['ui', 'dataState', 'media']),
  },
  mounted() {
    /**
     * Opens and closes the left hand sidebar upon clicking on 'direct-chat', 'friends-list', and 'files-browse'
     * when user is on a mobile device
     */
    if (this.$route.name?.includes('chat-direct') && this.$device.isMobile) {
      this.$props.toggle()
    }

    if (this.$route.name?.includes('friends-list') && this.$device.isMobile) {
      this.$props.toggle()
    }

    if (this.$route.name?.includes('files-browse') && this.$device.isMobile) {
      this.$props.toggle()
    }
  },
})
</script>

<style scoped lang="less" src="./Sidebar.less"></style>
