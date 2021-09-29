<template>
<div>
  <TailoredSettingsModal v-if="ui.showSettings" />
  <InteractablesContextMenu v-if="ui.contextMenuStatus"/>
  <UiModal v-if="ui.modals.createServer" :closeModal="toggleModal" :title="$t('servers.create.heading')">
    <TailoredCoreServersCreate v-if="ui.modals.createServer" :closeModal="toggleModal"
      v-click-outside="toggleModal" />
  </UiModal>
  <UiModal v-if="$mock.users.find(user => user.name === media.incomingCall)" nopad>
    <TailoredCoreIncomingCall :user="$mock.users.find(user => user.name === media.incomingCall)"
      :acceptCall="acceptCall" :denyCall="denyCall" />
  </UiModal>
  <UiModal v-if="ui.modals.showMarketPlace" :closeModal="toggleMarketPlace" nopad>
    <TailoredMarketplace :closeModal="toggleMarketPlace" v-click-outside="toggleMarketPlace" />
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
    /**
     * @method toggleModal
     * @description
     * @example
     */
    toggleModal() {
      this.$store.commit('toggleModal', {
        name: 'createServer',
        state: !this.ui.modals.createServer,
      })
    },
    /**
     * @method acceptCall DocsTODO
     * @description
     * @example
     */
    acceptCall() {
      this.$store.dispatch('acceptCall')
    },
    /**
     * @method denyCall DocsTODO
     * @description
     * @example
     */
    denyCall() {
      this.$store.dispatch('denyCall')
    },
    /**
     * @method toggleMarketPlace DocsTODO
     * @description
     * @example
     */
    toggleMarketPlace() {
      this.$store.commit('toggleModal', {
        name: 'showMarketPlace',
        state: !this.ui.modals.showMarketPlace,
      })
    },
  },
})
</script>
