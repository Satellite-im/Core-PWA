<template src="./Add.html"></template>
<script lang="ts">
// @ts-ignore
import QrcodeVue from 'qrcode.vue'
import { UserPlusIcon } from 'satellite-lucide-icons'

import Vue from 'vue'
import { mapState } from 'vuex'
import { debounce } from 'lodash'
import { Friend } from '~/types/ui/friends'
import UsersProgram from '~/libraries/Solana/UsersProgram/UsersProgram'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  components: {
    QrcodeVue,
    UserPlusIcon,
  },
  data() {
    return {
      error: '',
      accountID: '',
      searching: false,
      friend: null as Friend | null,
    }
  },
  computed: {
    ...mapState({
      myAccountID: (state) => (state as RootState).accounts.active,
      allFriends: (state) => (state as RootState).friends.all,
    }),
    friendInviteUrl(): string {
      return `${location.origin}/#/friends/list/${this.myAccountID}`
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
      if (!this.accountID.length) {
        this.error = ''
        this.friend = null
        this.searching = false
        return
      }
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
      if (accountID === this.myAccountID) {
        this.error = this.$t('friends.self_add') as string
        return
      }
      if (
        this.allFriends.some((f: Friend) => f?.account?.accountId === accountID)
      ) {
        this.error = this.$t('friends.already_friend') as string
        return
      }
      this.error = ''
      try {
        const usersProgram: UsersProgram = new UsersProgram(this.$SolanaManager)
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
    onFriendRequestSent(error?: string) {
      if (error) {
        this.error = error
        return
      }
      this.friend = null
      this.accountID = ''
      // @ts-ignore
      const input = this.$refs.input.$refs.input as HTMLInputElement
      input.value = ''
      this.$toast.show(this.$t('friends.request_sent') as string)
    },
  },
})
</script>
<style scoped lang="less" src="./Add.less"></style>
