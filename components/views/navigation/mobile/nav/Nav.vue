<template src="./Nav.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import {
  HomeIcon,
  MessageSquareIcon,
  FolderIcon,
  UsersIcon,
  SettingsIcon,
  ShoppingBagIcon,
} from 'satellite-lucide-icons'
import { ModalWindows } from '~/store/ui/types'

export default Vue.extend({
  components: {
    HomeIcon,
    MessageSquareIcon,
    FolderIcon,
    UsersIcon,
    SettingsIcon,
    ShoppingBagIcon,
  },
  computed: {
    ...mapState(['accounts', 'ui']),
  },
  methods: {
    toggleModal() {
      this.$store.commit('ui/toggleModal', {
        name: ModalWindows.CALL_TO_ACTION,
        state: !this.ui.modals[ModalWindows.CALL_TO_ACTION],
      })
    },
    isActiveRoute(route: string): boolean {
      return this.$route.path.includes(route)
    },
  },
})
</script>

<style scoped lang="less" src="./Nav.less"></style>
