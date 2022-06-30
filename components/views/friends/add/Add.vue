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
      error: '',
      friendId: '',
      searching: false,
      request: null as FriendRequest | null,
      user: null as User | null,
    }
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
        this.error = ''
        this.user = null
        this.searching = false
        return
      }
      await this.searchFriend()
      this.searching = false
    }, 500),
    async searchFriend() {
      this.user = null
      this.error = ''
      this.searching = true
      const friendId = this.friendId.trim()
      if (friendId === iridium.connector?.id) {
        this.error = this.$t('friends.self_add') as string
        return
      }
      const hasFriend = iridium.friends?.isFriend(friendId)
      if (hasFriend) {
        this.error = this.$t('friends.already_friend') as string
      }

      try {
        const request = await iridium.friends?.createFriendRequest(
          friendId,
          'pending',
        )
        this.user = {
          did: friendId,
          name: friendId,
          status: 'offline',
        }
        this.request = request
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
