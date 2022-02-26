<template src="./Add.html"></template>
<script lang="ts">
import { PublicKey } from '@solana/web3.js'
// @ts-ignore
import QrcodeVue from 'qrcode.vue'

import { UserPlusIcon } from 'satellite-lucide-icons'

import Vue from 'vue'
import { mapState } from 'vuex'

import { debounce } from 'lodash'
import { Friend } from '~/types/ui/friends'
import ServerProgram from '~/libraries/Solana/ServerProgram/ServerProgram'
import SolanaManager from '~/libraries/Solana/SolanaManager/SolanaManager'
import UsersProgram from '~/libraries/Solana/UsersProgram/UsersProgram'

export default Vue.extend({
  components: {
    QrcodeVue,
    UserPlusIcon,
  },
  data() {
    return {
      size: 150,
      featureReadyToShow: false,
      error: '',
      accountID: '',
      searching: false,
      friend: null as Friend | null,
    }
  },
  computed: {
    ...mapState(['accounts']),
    friendInviteUrl(): string {
      return `${location.origin}/#/friends/list/${this.accounts.active}`
    },
  },
  mounted() {
    if (this.$route.params && this.$route.params.id) {
      this.$data.accountID = this.$route.params.id
      this._searchFriend()
    }
  },
  methods: {
    _searchFriend: debounce(async function (this: any) {
      if (this.accountID.length >= 40) {
        return await this.searchFriend()
      }
      this.error = this.$t('friends.invalid_id') as string
      this.searching = false
    }, 500),
    async searchFriend() {
      this.friend = null
      this.searching = true
      const accountID = this.accountID.trim()
      if (accountID === this.$store.state.accounts.active) {
        this.error = this.$t('friends.self_add') as string
        return
      }

      if (
        this.$store.state.friends.all.filter(
          (f: Friend) => f.account.accountId === accountID,
        ).length === 1
      ) {
        this.error = this.$t('friends.already_friend') as string
        return
      }
      this.error = ''
      try {
        const $SolanaManager: SolanaManager = Vue.prototype.$SolanaManager
        const usersProgram: UsersProgram = new UsersProgram($SolanaManager)

        const friend = await usersProgram.getUserInfo(accountID)
        if (!friend) {
          this.error = this.$t('friends.not_found') as string
          return
        }
        // TODO : fix when all information are available - AP-398
        this.friend = {
          ...friend,
          state: 'offline',
          // @ts-ignore
          account: {
            accountId: this.accountID,
          },
          address: this.accountID,
        }
      } catch (error) {
        this.error = this.$t('friends.invalid_id') as string
      }

      this.searching = false
    },
    onFriendRequestSent(error: string) {
      this.friend = null
      this.accountID = ''
      if (!error) {
        this.$toast.show(this.$t('friends.request_sent') as string)
      } else {
        this.error = error
      }
    },
  },
})
</script>
<style scoped lang="less" src="./Add.less"></style>
