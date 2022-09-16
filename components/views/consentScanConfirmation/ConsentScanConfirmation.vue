<template>
  <Confirmation :show-confirm-button="true" @confirm="confirm" @close="close">
    <template #title>{{ $t('pages.privacy.consentScan.title') }}</template>
    <template #body>{{ $t('pages.privacy.consentScan.subtitle') }}</template>
  </Confirmation>
</template>

<script lang="ts">
import Vue from 'vue'
import Confirmation from '../../views/confirmation/Confirmation.vue'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  components: { Confirmation },
  props: {
    showModal: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      privacySettings: iridium.settings.state.privacy,
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    async confirm() {
      try {
        await iridium.settings.set('/privacy/consentToScan', true)
        this.$emit('close')
      } catch (error) {
        console.error(error)
      }
    },
  },
})
</script>
