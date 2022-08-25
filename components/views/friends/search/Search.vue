<template>
  <div>
    <InteractablesInput
      v-model="friendId"
      :placeholder="$t('friends.search_placeholder')"
      :autofocus="$device.isDesktop"
      @change="_searchFriend"
    />
    <TypographyError v-if="error" :text="$t(error)" />
    <UiLoadersLoadingBar v-else-if="searching" />
    <div v-else-if="!friendId" class="id-container">
      <button class="id-button" @click="copyId">
        <TypographyText class="id" color="dark">
          {{ $t('friends.copy_your_id') }}
        </TypographyText>
      </button>
    </div>
    <FriendsFriend
      v-else-if="user && user.did"
      :user="user"
      is-preview
      class="friend-item"
      @requestSent="onFriendRequestSent"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { debounce } from 'lodash'
import { mapState } from 'vuex'
import iridium from '~/libraries/Iridium/IridiumManager'
import { FriendRequest, User } from '~/libraries/Iridium/friends/types'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  data() {
    return {
      error: '',
      friendId: '',
      searching: false,
      request: null as FriendRequest | null,
      user: null as User | null,
    }
  },
  computed: {
    ...mapState({
      accounts: (state) => (state as RootState).accounts,
    }),
  },
  async mounted() {
    if (this.$route.params && this.$route.params.id) {
      this.$data.friendId = this.$route.params.id
      this._searchFriend()
    }
    iridium.friends?.on('request/error', (err: string) => {
      this.error = err
    })
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
      await iridium.users.searchPeer(friendId)
      const hasFriend = iridium.friends.isFriend(friendId)
      if (hasFriend) {
        this.error = this.$t('friends.already_friend') as string
      }

      this.user = iridium.users.getUser(friendId)
      this.searching = false
    },
    onFriendRequestSent() {
      this.request = null
      this.user = null
      this.friendId = ''
      // @ts-ignore
      this.$toast.show(this.$t('friends.request_sent') as string)
    },
    copyId() {
      // @ts-ignore
      this.$toast.show(this.$t('ui.copied') as string)
      navigator.clipboard.writeText(this.accounts.active)
    },
  },
})
</script>

<style lang="less" scoped>
.friend-item {
  margin-top: 16px;
}

.id-container {
  display: flex;
  justify-content: flex-end;
  user-select: none;

  .id-button {
    .id {
      white-space: nowrap;
      padding: 4px 8px;

      &:hover {
        opacity: 0.8;
      }
    }
  }
}
</style>
