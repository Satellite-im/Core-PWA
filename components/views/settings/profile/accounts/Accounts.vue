<template>
  <div class="list">
    <SettingsProfileAccountsItem
      v-for="account in accounts"
      :key="account.name"
      :account="account"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { TwitchIcon, YoutubeIcon, TwitterIcon } from 'satellite-lucide-icons'

type Account = {
  name: string
  icon: string
  isVerified: boolean
  displayOnProfile: boolean
}
export default Vue.extend({
  data() {
    return {
      accounts: {
        reddit: {
          name: 'Reddit',
          // TODO: Add icon
          icon: 'reddit',
          username: '',
          isVerified: false,
          displayOnProfile: true,
          verifyUrl: 'https://www.reddit.com/',
        },
        twitch: {
          name: 'Twitch',
          icon: TwitchIcon,
          username: 'Sophia_Kalindi',
          isVerified: true,
          displayOnProfile: true,
          verifyUrl: 'https://www.twitch.com/',
        },
        youtube: {
          name: 'Youtube',
          icon: YoutubeIcon,
          username: 'Sophia_Kalindi94',
          isVerified: false,
          displayMusic: false,
          displayOnProfile: true,
          verifyUrl: 'https://www.youtube.com/',
        },
        twitter: {
          name: 'Twitter',
          icon: TwitterIcon,
          username: 'Sophia_Kalindi94',
          isVerified: true,
          displayOnProfile: true,
          verifyUrl: 'https://www.twitter.com/',
        },
        spotify: {
          name: 'Spotify',
          // TODO: Add icon
          icon: 'spotify',
          username: '',
          isVerified: false,
          displayMusic: true,
          displayOnProfile: true,
          verifyUrl: 'https://www.spotify.com/',
        },
      },
    }
  },
  methods: {
    toggleAccount(account: Account) {
      account.displayOnProfile = !account.displayOnProfile
    },
  },
})
</script>

<style scoped lang="less">
.list {
  display: flex;
  flex-direction: column;
  gap: @large-spacing;
  padding-bottom: 18px;
}
</style>
