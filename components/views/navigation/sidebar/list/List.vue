<template src="./List.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { UserPlusIcon } from 'satellite-lucide-icons'
import { Conversation } from '~/libraries/Iridium/chat/types'

export default Vue.extend({
  components: {
    UserPlusIcon,
  },
  props: {
    conversations: {
      type: Object as PropType<Array<Conversation>>,
      required: true,
    },
  },
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
