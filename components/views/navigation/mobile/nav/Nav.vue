<template src="./Nav.html" />

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
    src(): string {
      const hash = this.accounts.details.profilePicture
      return hash ? `${this.$Config.textile.browser}/ipfs/${hash}` : ''
    },
  },
  methods: {
    toggleModal() {
      this.$store.commit('ui/toggleModal', {
        name: ModalWindows.CALL_TO_ACTION,
        state: !this.ui.modals[ModalWindows.CALL_TO_ACTION],
      })
    },
    /**
     * @method navigateToHome
     * @description Navigate to chat "/chat/direct" without specific user
     */
    navigateToHome() {
      this.$store.commit('ui/setSwiperSlideIndex', 1)
      this.$router.push('/chat/direct')
    },
    /**
     * @method navigateToFriend
     * @description Navigate to chat "/friends/list" showing slide 1 ('friends list slide')
     */
    navigateToFriend() {
      this.$store.commit('ui/setSwiperSlideIndex', 1)
      this.$store.commit('ui/showSidebar', false)
      this.$router.push('/friends/list')
    },
    navigateToFiles() {
      this.$router.push('/files/browse')
    },
  },
})
</script>

<style scoped lang="less" src="./Nav.less"></style>
