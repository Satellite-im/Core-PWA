<template>
  <div>
    <InteractablesInput
      v-if="$route.query.route === 'add'"
      v-model.trim="query"
      :placeholder="$t('friends.search_placeholder')"
      :autofocus="$device.isDesktop"
      type="search"
      @change="
        matches = []
        _searchFriend()
      "
    />
    <TypographyText v-if="error" color="danger">
      {{ error }}
    </TypographyText>
    <UiLoadersLoadingBar v-else-if="searching" />
    <button v-else-if="!query" class="id-button" @click="copyText(shortID)">
      <TypographyText color="dark">
        {{ $t('friends.copy_your_id') }}
      </TypographyText>
    </button>
    <div v-else-if="matches.length" class="matches">
      <FriendsItem
        v-for="user in matches"
        :key="user.did"
        :user="user"
        type="stranger"
        @requestSent="onFriendRequestSent"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { TranslateResult } from 'vue-i18n'
import { debounce } from 'lodash'
import { mapState } from 'vuex'
import iridium from '~/libraries/Iridium/IridiumManager'
import { User } from '~/libraries/Iridium/users/types'
import { RootState } from '~/types/store/store'
import { isDid, isShortDid } from '~/libraries/Iridium/utils'
import { capacitorHooks } from '~/components/compositions/capacitor'

export default Vue.extend({
  setup() {
    const { copyText } = capacitorHooks()

    return {
      copyText,
    }
  },
  data() {
    return {
      error: '' as string | TranslateResult,
      query: '',
      searching: false,
      matches: [] as User[],
      friends: iridium.friends.state,
      users: iridium.users,
    }
  },
  computed: {
    ...mapState({
      accounts: (state) => (state as RootState).accounts,
    }),
    shortID(): string {
      return iridium.shortId
    },
  },
  mounted() {
    if (this.$route.params.id) {
      this.query = this.$route.params.id
      this._searchFriend()
    }
  },
  methods: {
    _searchFriend: debounce(async function (this: any) {
      if (!this.query.length) {
        this.error = ''
        this.searching = false
        return
      }
      this.searching = true
      await this.searchFriend()
      this.searching = false
    }, 500),
    async searchFriend() {
      this.error = ''

      if (this.query === iridium.id || this.query === this.shortID) {
        this.error = this.$t('friends.self_add')
        return
      }

      let matches = await this.users.searchPeer(this.query)

      if (matches.length === 0) {
        this.error = this.$t('friends.not_found')
        return
      }

      if (matches.length === 1) {
        const did = matches[0].did
        const isExact = isShortDid(this.query) || isDid(this.query)
        if (this.friends.friends.includes(did)) {
          this.error = isExact
            ? this.$t('friends.already_friend')
            : this.$t('friends.not_found')
          return
        }

        if (this.friends.requests[did]) {
          this.error = isExact
            ? this.$t('friends.already_request')
            : this.$t('friends.not_found')
          return
        }
      }

      // filter out existing friends and requests
      matches = matches.filter((m) => !this.friends.friends.includes(m.did))
      matches = matches.filter((m) => !this.friends.requests[m.did])

      this.matches = matches
    },
    onFriendRequestSent() {
      this.query = ''
      this.$toast.show(this.$t('friends.request_sent') as string)
    },
  },
})
</script>

<style lang="less" scoped>
.id-button {
  user-select: none;
  margin-left: auto;
  padding: 4px 8px;

  &:hover {
    opacity: 0.8;
  }
}
.matches {
  margin-top: 16px;
}
</style>
