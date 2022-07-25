<template src="./List.html"></template>

<script lang="ts">
import Vue from 'vue'
import { UserPlusIcon } from 'satellite-lucide-icons'
import iridium from '~/libraries/Iridium/IridiumManager'
import { Conversation } from '~/libraries/Iridium/chat/types'

export default Vue.extend({
  components: {
    UserPlusIcon,
  },
  data: () => ({
    conversations: iridium.chat.state.conversations,
    friends: iridium.friends.state,
  }),
  computed: {
    conversationsWithFriends(): Array<Conversation> {
      return Object.values(this.conversations).filter((conversation) => {
        const { participants } = conversation

        let doesConversationsContainsActualFriends = true

        participants.forEach((participant) => {
          if (participant === iridium.connector?.id) {
            return
          }

          if (!this.friends.list.find((friend) => friend.did === participant)) {
            doesConversationsContainsActualFriends = false
          }
        })

        return doesConversationsContainsActualFriends
      })
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
