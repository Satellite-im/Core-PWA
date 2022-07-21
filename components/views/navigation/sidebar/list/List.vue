<template src="./List.html"></template>

<script lang="ts">
import Vue from 'vue'
import { UserPlusIcon } from 'satellite-lucide-icons'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  components: {
    UserPlusIcon,
  },
  data: () => ({
    conversations: iridium.chat.state.conversations,
  }),
  methods: {
    navigateAddFriends() {
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

<style scoped lang="less" src="./List.less"></style>
