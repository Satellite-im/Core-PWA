<template>
  <div>
    <InteractablesInput
      v-model="query"
      :placeholder="$t('friends.search_placeholder')"
      :autofocus="$device.isDesktop"
      @change="_searchFriend"
    />
    <TypographyError v-if="error" :text="$t(error)" />
    <UiLoadersLoadingBar v-else-if="searching" />
    <div v-else-if="!query" class="id-container">
      <button class="id-button" @click="copyId">
        <TypographyText class="id" color="dark">
          {{ $t('friends.copy_your_id') }}
        </TypographyText>
      </button>
    </div>
    <div v-else-if="matches && matches.length">
      <FriendsFriend
        v-for="match in matches"
        :key="match.did"
        :user="match"
        is-preview
        class="friend-item"
        @requestSent="onFriendRequestSent"
      />
    </div>
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
      query: '',
      searching: false,
      request: null as FriendRequest | null,
      user: null as User | null,
      matches: [] as User[],
    }
  },
  computed: {
    ...mapState({
      accounts: (state) => (state as RootState).accounts,
    }),
  },
  async mounted() {
    if (this.$route.params && this.$route.params.id) {
      this.$data.query = this.$route.params.id
      this._searchFriend()
    }
    iridium.friends?.on('request/error', (err: string) => {
      this.error = err
    })
  },
  methods: {
    _searchFriend: debounce(async function (this: any) {
      if (!this.query.length) {
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
      const query = this.query.trim()
      const matches = await iridium.users.searchPeer(query)
      const hasFriend =
        matches.length === 1 && iridium.friends.isFriend(matches[0].did)

      if (
        query === iridium.connector?.id ||
        (matches.length === 1 && matches[0].did === iridium.connector?.id)
      ) {
        this.error = this.$t('friends.self_add') as string
        return
      }
      if (hasFriend) {
        this.error = this.$t('friends.already_friend') as string
      }

      this.matches = matches
      this.searching = false
    },
    onFriendRequestSent() {
      this.request = null
      this.user = null
      this.query = ''
      // @ts-ignore
      this.$toast.show(this.$t('friends.request_sent') as string)
    },
    copyId() {
      if (!iridium.connector) return
      const shortID = iridium.profile.state
        ? `${iridium.profile.state.name}#${iridium.connector.id.substring(
            iridium.connector.id.length - 6,
          )}`
        : `${iridium.connector?.id}`
      navigator.clipboard.writeText(shortID)
      this.$toast.show(this.$t('ui.copied') as string)
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
