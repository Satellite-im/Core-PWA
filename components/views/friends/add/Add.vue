<template src="./Add.html"></template>
<script lang="ts">
// @ts-ignore
import QrcodeVue from 'qrcode.vue'
import { UserPlusIcon } from 'satellite-lucide-icons'

import Vue from 'vue'
import { debounce } from 'lodash'
import iridium from '~/libraries/Iridium/IridiumManager'
import { FriendRequest, User } from '~/libraries/Iridium/friends/types'

export default Vue.extend({
  components: {
    QrcodeVue,
    UserPlusIcon,
  },
  data() {
    return {
      friendId: '',
      searching: false,
      request: null as FriendRequest | null,
      user: null as User | null,
    }
  },
  computed: {
    friendRequestError() {
      return iridium.friends.state.error
    },
  },
  mounted() {
    if (this.$route.params && this.$route.params.id) {
      this.$data.friendId = this.$route.params.id
      this._searchFriend()
    }
  },
  methods: {
    _searchFriend: debounce(async function (this: any) {
      if (!this.friendId.length) {
        iridium.friends.clearError()
        this.user = null
        this.searching = false
        return
      }
      await this.searchFriend()
      this.searching = false
    }, 500),
    searchFriend() {
      iridium.friends.clearError()
      this.user = null
      this.searching = true
      const friendId = this.friendId.trim()

      this.user = {
        did: friendId,
        name: friendId,
        status: 'offline',
      }
      this.searching = false
    },
    onFriendRequestSent() {
      this.request = null
      this.user = null
      this.friendId = ''
      // @ts-ignore
      const input = this.$refs.input.$refs.input as HTMLInputElement
      input.value = ''
      this.$toast.show(this.$t('friends.request_sent') as string)
    },
  },
})
</script>
<style scoped lang="less" src="./Add.less"></style>
