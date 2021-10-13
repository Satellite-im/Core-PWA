<template src="./Add.html"></template>
<script lang="ts">
// @ts-ignore
import { PublicKey } from '@solana/web3.js'
import QrcodeVue from 'qrcode.vue'

import { UserPlusIcon } from 'satellite-lucide-icons'

import Vue from 'vue'
import ServerProgram from '~/libraries/Solana/ServerProgram/ServerProgram'
import { Friend } from '~/types/ui/friends'
import SolanaManager from '~/utilities/SolanaManager/SolanaManager'

export default Vue.extend({
  components: {
    QrcodeVue,
    UserPlusIcon,
  },
  data() {
    return {
      value: 'https://example.com',
      size: 150,
      error: '',
      accountID: '',
      searching: false,
      friend: null as Friend | null,
    }
  },
  methods: {
    async searchFriend() {
      this.friend = null
      this.searching = true
      const accountID = this.accountID.trim()
      if (accountID === this.$store.state.accounts.active) {
        this.error = "You can't add yourself you silly goose."
        return
      }
      if (
        this.$store.state.friends.all.filter(
          (f: Friend) => f.friendAccount.accountId === accountID
        ).length === 1
      ) {
        this.error = "You're already friends with this user."
        return
      }
      this.error = ''
      try {
        const $SolanaManager: SolanaManager = Vue.prototype.$SolanaManager
        const serverProgram: ServerProgram = new ServerProgram($SolanaManager)

        const friend = await serverProgram.getUser(new PublicKey(accountID))
        if (!friend) {
          this.error = "Hmm, we couldn't find a user at that address"
          return
        }
        this.friend = {
          ...friend,
          state: 'offline',
          friendAccount: {
            accountId: this.accountID,
          },
        }
      } catch (error) {
        console.error(error)
        this.error = 'Invalid account ID'
      }

      this.searching = false
    },
    onFriendRequestSent(error: string) {
      this.friend = null
      if (!error) {
        this.$toast.show('Friend request successfully sent!')
      } else {
        this.error = error
      }
    },
  },
})
</script>
<style scoped lang="less" src="./Add.less"></style>
