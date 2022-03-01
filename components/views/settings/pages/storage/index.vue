<template src="./Storage.html" />

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'StorageSettings',
  layout: 'settings',
  data() {
    return {
      isLoading: false,
      deleteVerify: false,
      featureReadyToShow: false,
    }
  },
  methods: {
    async clearLocalStorage() {
      this.isLoading = true
      try {
        await this.$store.dispatch('settings/clearLocalStorage')
        this.$toast.success(
          this.$t('pages.settings.storage.clear.message') as string,
        )
      } catch (e: any) {
        this.$toast.error(this.$t(e.message) as string)
      } finally {
        this.isLoading = false
      }
    },
  },
})
</script>
