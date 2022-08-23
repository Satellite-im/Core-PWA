<template src="./Quick.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { TranslateResult } from 'vue-i18n'
import iridium from '~/libraries/Iridium/IridiumManager'
import { Friend } from '~/libraries/Iridium/friends/types'
import { RootState } from '~/types/store/store'
import { Conversation } from '~/libraries/Iridium/chat/types'

export default Vue.extend({
  data() {
    return {
      friends: [] as Friend[],
      conversations: iridium.chat.state.conversations,
      isLoading: false,
      error: '' as TranslateResult,
      name: '',
    }
  },
  computed: {
    ...mapState({
      accounts: (state) => (state as RootState).accounts,
    }),
    isInvalidName(): boolean {
      return (
        !this.name ||
        this.name.length < this.$Config.chat.groupNameMinLength ||
        this.name.length > this.$Config.chat.groupNameMaxLength
      )
    },
  },
  methods: {
    async confirm() {
      this.error = ''
      // if only 1 friend, direct to DM instead
      if (this.friends.length === 1) {
        this.$router.push(
          `/chat/${iridium.chat?.directConversationIdFromDid(
            this.friends[0].did,
          )}`,
        )
        this.$emit('toggle')
        return
      }
      // validate group name, then create group
      if (this.isInvalidName) {
        this.error = this.$t('errors.chat.group_name', {
          min: this.$Config.chat.groupNameMinLength,
          max: this.$Config.chat.groupNameMaxLength,
        })
        return
      }
      this.isLoading = true
      try {
        if (!iridium.connector) {
          return
        }
        const participants = [
          iridium.connector.id,
          ...this.friends.map((friend) => friend.did),
        ]
        const id = await iridium.chat.createGroupConversation({
          name: this.name,
          participants,
        })
        this.$emit('toggle')
        this.$router.push(`/chat/${id}`)
      } catch (e: any) {
        this.error = this.$t(e.message)
      } finally {
        this.isLoading = false
      }
    },
  },
})
</script>

<style scoped lang="less" src="./Quick.less"></style>
