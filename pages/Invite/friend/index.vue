<template>
  <div>
    <TypographyText> {{ username }}</TypographyText>
    <button @click="createFriendRequest">
      <TypographyText> Send Request </TypographyText>
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { TranslateResult } from 'vue-i18n'
import iridium from '~/libraries/Iridium/IridiumManager'
import { isShortDid, isDid } from '~/libraries/Iridium/utils'
import { User } from '~/libraries/Iridium/users/types'

export default Vue.extend({
  name: 'InviteFriend',
  data() {
    return {
      error: '' as string | TranslateResult,
      username: this.$route.query.username + '#' + this.$route.query.did,
      matches: [] as User[],
      friends: iridium.friends.state,
      users: iridium.users,
      user: null as User | null,
    }
  },
  async mounted() {
    if (!this.username) {
      return
    }
    if (isShortDid(this.username)) {
      const matches = await this.users.searchPeer(this.username)

      if (matches.length === 0) {
        this.error = this.$t('friends.not_found')
        return
      }

      if (matches.length === 1) {
        const did = matches[0].did
        const isExact = isShortDid(this.username) || isDid(this.username)
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
        window.console.log(matches[0])
        this.user = matches[0]
      }
    }
  },
  methods: {
    async createFriendRequest() {
      if (this.user) {
        await iridium.friends.requestCreate(this.user, false)
        this.$emit('requestSent')
      }
    },
  },
})
</script>
