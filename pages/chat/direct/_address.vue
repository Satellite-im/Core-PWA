<template src="./Direct.html" />

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { groupMessages } from '~/utilities/Messaging'
import { ConsoleWarning } from '~/utilities/ConsoleWarning'
import { DataStateType } from '~/store/dataState/types'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  name: 'DirectMessages',
  layout: 'chat',
  computed: {
    DataStateType: () => DataStateType,
    ...mapState({
      friendsDS: (state) => (state as RootState).dataState.friends,
      friendsExist: (state) => {
        const friends = (state as RootState).friends
        return friends && friends.all && friends.all.length > 0
      },
    }),
    ...mapGetters('textile', ['getInitialized']),
    groupedMessages() {
      const { address } = this.$route.params
      const conversation = this.$typedStore.state.textile.conversations[address]

      if (!conversation) {
        return []
      }

      const { messages, replies, reactions } = conversation

      return groupMessages(messages, replies, reactions)
    },
  },
  watch: {
    getInitialized: {
      handler(nextValue) {
        if (nextValue) {
          const { address } = this.$route.params
          const { friends } = this.$store.state
          if (address) {
            this.$store.dispatch('textile/fetchMessages', {
              address,
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
          const { address } = this.$route.params
          const { friends } = this.$store.state

          if (address) {
            if (
              this.$Hounddog &&
              this.$Hounddog.findFriendByAddress(address, friends)
            ) {
              return
            }
          }

          if (this.friendsExist) {
            this.$router.replace(`/chat/direct/${friends.all[0].address}`)
            return
          }
          this.$router.replace('/friends/list')
        }
      },
      immediate: true,
    },
  },
  mounted() {
    // This information can be useful for users to help us find and report bugs.
    ConsoleWarning(this.$config.clientVersion, this.$store.state)
    const { address } = this.$route.params
    const { friends } = this.$store.state

    if (address) {
      return
    }

    if (friends && friends.all && friends.all.length > 0) {
      this.$router.replace(`/chat/direct/${friends.all[0].address}`)
      return
    }

    this.$router.replace('/friends/list')
  },
})
</script>

<style lang="less" src="./Direct.less"></style>
