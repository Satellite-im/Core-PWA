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
  computed: {
    DataStateType: () => DataStateType,
    ...mapState({
      initialized: (state) => (state as RootState).iridium.initialized,
      friendsDS: () => iridium.friends?.state,
      friendsExist: () =>
        Object.values(iridium.friends?.state.requests || {}).filter(
          (r: FriendRequest) => r.incoming,
        ).length,
    }),
    // Get the active friend
    friend() {
      const { address: did } = this.$route.params

      return iridium.friends?.state.details?.[did]
    },
    messages() {
      // TODO: fetch messages from backend
      // -------
      // const id = await iridium.chat.directConversationId(this.friend)
      // const msgs = (await iridium.chat.loadMessages(id)) || []
      // console.log('debug: | messages | msgs', msgs)
      return []
    },
  },

  watch: {
    friend(friend: Friend | undefined) {
      const { address: did } = this.$route.params

      // If the friend is not found, redirect to the friends screen
      if (did && !friend) {
        this.$router.replace('/friends/list')
      }
    },
    initialized: {
      handler(nextValue) {
        if (nextValue) {
          const { address: did } = this.$route.params

          if (did && this.friend) {
            this.$store.dispatch('iridium/fetchMessages', {
              did,
              setActive: true,
            })
          }
        }
      },
      immediate: true,
    },
    friendsDS: {
      handler(nextValue) {
        if (nextValue === DataStateType.Ready) {
          ConsoleWarning(this.$config.clientVersion, this.$store.state)
          const { address: did } = this.$route.params
          const { friends } = this.$store.state

          // If no address is specified, but we have at least one friend, we can redirect to
          // a chat with the first friend in the list
          /* if (!address && friends?.all?.length > 0) {
            this.$router.replace(`/chat/direct/${friends.all[0].address}`)
            return
          } */

          // Defaults to friends list
          // this.$router.replace('/friends/list')
        }
      },
      immediate: true,
    },
  },
})
</script>

<style lang="less" src="./Direct.less"></style>
