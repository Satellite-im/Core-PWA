<template>
  <div class="container hidden-scroll">
    <div>
      <UiSpacer :height="25" />
      <img src="~/static/icon.png" alt="" />
      <TypographyTitle :size="5" text="Satellite Absolute" />
      <TypographySubtitle :size="5" text="UI Preview" />
      <UiSpacer :height="25" />

      <aside class="menu">
        <p class="menu-label">General</p>
        <ul class="menu-list">
          <li><NuxtLink to="components">Components</NuxtLink></li>
          <li><NuxtLink to="generic/loading">Loading Screen</NuxtLink></li>
        </ul>
        <p class="menu-label">Auth</p>
        <ul class="menu-list">
          <li><NuxtLink to="auth/unlock">Unlok Screen</NuxtLink></li>
        </ul>
        <p class="menu-label">Setup</p>
        <ul class="menu-list">
          <li><NuxtLink to="setup/disclaimer">Account Creation</NuxtLink></li>
          <li><NuxtLink to="setup/phrase">Account Phrase</NuxtLink></li>
        </ul>
        <p class="menu-label">General</p>
        <ul class="menu-list">
          <li><NuxtLink to="settings/profile">Settings</NuxtLink></li>
          <li><NuxtLink to="chat/direct">Chat</NuxtLink></li>
          <li><NuxtLink to="friends/list">Friends</NuxtLink></li>
          <li><NuxtLink to="files/browse">Files</NuxtLink></li>
        </ul>
        <div @click="createFriendRequest()">Send request</div>
        <div @click="acceptFriendRequest()">Accept request</div>
        <div @click="denyFriendRequest()">Deny request</div>
        <div @click="removeFriendRequest()">Remove request</div>
        <div @click="removeFriend()">Remove friend</div>
      </aside>
    </div>
  </div>
</template>

<script lang="ts">
import { PublicKey } from '@solana/web3.js'
import Vue from 'vue'

export default Vue.extend({
  name: 'AllComponents',
  data() {
    return {
      switch1State: false,
      switch2State: true,
    }
  },
  mounted() {
    this.getFriendRequests()
    this.getFriends()
    this.$store.dispatch('subscribeToFriendsEvents')
  },
  methods: {
    async createFriendRequest() {
      try {
        await this.$store.dispatch('createFriendRequest', {
          friendToKey: new PublicKey(
            '4dLvbQbGFwV69hrAZrAenhen1Kg3qTkNcKzY23Q8DFkR'
          ),
          textileMailboxId:
            'bafkwqw5h6zlko43enhmrrlksx3fhitmojzpnwtagbrjcflm737btxbq',
        })
      } catch (e) {
        console.log('error', e)
      }
    },
    async acceptFriendRequest() {
      const friendRequest =
        this.$typedStore.state.friends.incomingRequests[
          this.$typedStore.state.friends.incomingRequests.length - 1
        ]

      try {
        await this.$store.dispatch('acceptFriendRequest', {
          friendRequest,
          textileMailboxId:
            'bafkwqw5h6zlko43enhmrrlksx3fhitmojzpnwtagbrjcflm737btxbq',
        })
      } catch (e) {
        console.log('error', e)
      }
    },
    async denyFriendRequest() {
      const friendAccount =
        this.$typedStore.state.friends.incomingRequests[
          this.$typedStore.state.friends.incomingRequests.length - 1
        ]
      try {
        await this.$store.dispatch('denyFriendRequest', friendAccount)
      } catch (e) {
        console.log('error', e)
      }
    },
    async removeFriendRequest() {
      const friendAccount =
        this.$typedStore.state.friends.outgoingRequests[
          this.$typedStore.state.friends.outgoingRequests.length - 1
        ]
      try {
        await this.$store.dispatch('removeFriendRequest', friendAccount)
      } catch (e) {
        console.log('error', e)
      }
    },
    async removeFriend() {
      const friend =
        this.$typedStore.state.friends.all[
          this.$typedStore.state.friends.all.length - 1
        ]
      try {
        await this.$store.dispatch('removeFriend', friend)
      } catch (e) {
        console.log('error', e)
      }
    },
    async getFriendRequests() {
      try {
        await this.$store.dispatch('fetchFriendRequests')
      } catch (e) {
        console.log('error', e)
      }
    },
    async getFriends() {
      try {
        await this.$store.dispatch('fetchFriends')
      } catch (e) {
        console.log('error', e)
      }
    },
    testAction(): void {
      alert('test')
    },
  },
})
</script>

<style lang="less" scoped>
.container {
  margin: 0 auto;
  max-height: 100vh;
  display: flex;
  justify-content: center;
  text-align: center;
}
@media only screen and (max-width: 768px) {
  /* due to vh issue on mobile devices */
  .container {
    max-height: calc(100vh - 60px);
  }
}
.title {
  margin: 0;
}
.is-6 {
  margin: 0;
  padding: 0;
}
</style>
