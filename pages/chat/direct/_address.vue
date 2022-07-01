<template src="./Direct.html" />

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { ConsoleWarning } from '~/utilities/ConsoleWarning'
import { DataStateType } from '~/store/dataState/types'
import { RootState } from '~/types/store/store'
import { Friend } from '~/types/ui/friends'
import iridium from '~/libraries/Iridium/IridiumManager'
import type { FriendRequest } from '~/libraries/Iridium/friends/types'

export default Vue.extend({
  name: 'DirectMessages',
  layout: 'chat',
  data() {
    return {
      messages: [],
    }
  },
  computed: {
    DataStateType: () => DataStateType,
    ...mapState({
      friendsDS: () => iridium.friends?.state,
      friendsExist: () =>
        Object.values(iridium.friends?.state.requests || {}).filter(
          (r: FriendRequest) => r.incoming,
        ).length,
    }),
    ...mapGetters('friends', ['findFriendByAddress']),
    groupedMessages() {
      const { address } = this.$route.params

      const conversation = this.$typedStore.state.textile.conversations[address]
      if (!conversation) return []
      const { messages, replies, reactions } = conversation
      return groupMessages(messages, replies, reactions)
    },
    // Get the active friend
    friend() {
      const { address } = this.$route.params
      return address
    },
  },
  watch: {
    // friend(friend: Friend | undefined) {
    //   const { address } = this.$route.params
    //   // If the friend is not found, redirect to the friends screen
    //   // if (address && !friend) {
    //   //   this.$router.replace('/friends/list')
    //   // }
    // },
    getInitialized: {
      handler(nextValue) {
        if (nextValue) {
          const { address } = this.$route.params
          // if (address) {
          // this.$store.dispatch('textile/fetchMessages', {
          //   address,
          //   setActive: true,
          // })
          // }
        }
      },
      immediate: true,
    },
    // friendsDS: {
    //   handler(nextValue) {
    //     if (nextValue === DataStateType.Ready) {
    //       ConsoleWarning(this.$config.clientVersion, this.$store.state)
    //       const { address } = this.$route.params
    //       const { friends } = this.$store.state
    //       if (address && this.friend) return
    //       // If no address is specified, but we have at least one friend, we can redirect to
    //       // a chat with the first friend in the list
    //       if (!address && friends?.list?.length > 0) {
    //         this.$router.replace(`/chat/direct/${friends.list[0].address}`)
    //         return
    //       }
    //       // Defaults to friends list
    //       this.$router.replace('/friends/list')
    //     }
    //   },
    //   immediate: true,
    // },
  },
  async mounted() {
    if (this.friend) {
      await iridium.chat.subscribeToConversation(this.friend, async (event) => {
        const message = await iridium.connector.load(event.message)
        this.messages.push(message)
      })
    }
  },
})
</script>

<style lang="less" src="./Direct.less"></style>
