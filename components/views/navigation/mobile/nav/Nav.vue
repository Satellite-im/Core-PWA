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
import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'
import { UserStatus } from '~/libraries/Iridium/users/types'
export default Vue.extend({
  components: {
    HomeIcon,
    MessageSquareIcon,
    FolderIcon,
    UsersIcon,
    SettingsIcon,
    ShoppingBagIcon,
  },
  data() {
    return {
      userStatus: iridium.users.ephemeral.status,
    }
  },
  computed: {
    ...mapState({
      accounts: (state) => (state as RootState).accounts,
      ui: (state) => (state as RootState).ui,
    }),
    status(): UserStatus {
      return 'online'
    },
    isMobileNavVisible: {
      get(): boolean {
        return this.ui.isMobileNavVisible
      },
      set(value: boolean) {
        this.$store.commit('ui/setIsMobileNavVisible', value)
      },
    },
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
