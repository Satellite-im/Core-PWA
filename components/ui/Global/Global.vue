<template>
  <div>
    <TailoredSettingsModal v-if="ui.showSettings" />
    <InteractablesContextMenu v-if="ui.contextMenuStatus" />
    <UiModal
      v-if="ui.modals.createServer"
      :close-modal="toggleModal"
      :title="$t('servers.create.heading')"
    >
      <TailoredCoreServersCreate
        v-if="ui.modals.createServer"
        v-click-outside="toggleModal"
        :close-modal="toggleModal"
      />
    </UiModal>
    <UiModal
      v-if="$mock.users.find((user) => user.name === media.incomingCall)"
      nopad
    >
      <TailoredCoreIncomingCall
        :user="$mock.users.find((user) => user.name === media.incomingCall)"
        :accept-call="acceptCall"
        :deny-call="denyCall"
      />
    </UiModal>
    <UiModal
      v-if="ui.modals.showMarketPlace"
      :close-modal="toggleMarketPlace"
      nopad
    >
      <TailoredMarketplace
        v-click-outside="toggleMarketPlace"
        :close-modal="toggleMarketPlace"
      />
    </UiModal>
    <transition :name="$device.isMobile ? 'slide' : ''">
      <InteractablesQuickProfile v-if="ui.quickProfile" :user="$mock.user" />
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  name: 'Global',
  computed: {
    ...mapState(['ui', 'media']),
  },
  methods: {
    toggleModal() {
      this.$store.commit('toggleModal', {
        name: 'createServer',
        state: !this.ui.modals.createServer,
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
        state: !this.ui.modals.showMarketPlace,
      })
    },
  },
})
</script>
