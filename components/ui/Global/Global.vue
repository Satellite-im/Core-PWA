<template>
<div>
  <TailoredSettingsModal v-if="$store.state.ui.showSettings" />
  <InteractablesContextMenu v-if="$store.state.ui.contextMenuStatus"/>
  <UiModal v-if="$store.state.ui.modals.createServer" :closeModal="toggleModal" :title="$t('servers.create.heading')">
    <TailoredCoreServersCreate v-if="$store.state.ui.modals.createServer" :closeModal="toggleModal"
      v-click-outside="toggleModal" />
  </UiModal>
  <UiModal v-if="$mock.users.find(user => user.name === $store.state.media.incomingCall)" nopad>
    <TailoredCoreIncomingCall :user="$mock.users.find(user => user.name === $store.state.media.incomingCall)"
      :acceptCall="acceptCall" :denyCall="denyCall" />
  </UiModal>
  <UiModal v-if="$store.state.ui.modals.showMarketPlace" :closeModal="toggleMarketPlace" nopad>
    <TailoredMarketplace :closeModal="toggleMarketPlace" v-click-outside="toggleMarketPlace" />
  </UiModal>
  <transition :name="$device.isMobile ? 'slide' : ''">
    <InteractablesQuickProfile v-if="$store.state.ui.quickProfile" :user="$mock.user" />
  </transition>
</div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Global',
  methods: {
    toggleModal() {
      this.$store.commit('toggleModal', {
        name: 'createServer',
        state: !this.$store.state.ui.modals.createServer,
      })
    },
    acceptCall() {
      this.$store.dispatch('acceptCall')
    },
    denyCall() {
      this.$store.dispatch('denyCall')
    },
    toggleMarketPlace() {
      this.$store.commit('toggleModal', {
        name: 'showMarketPlace',
        state: !this.$store.state.ui.modals.showMarketPlace,
      })
    },
  },
})
</script>
