<template src="./UpdateModal.html"></template>

<script lang="ts">
import Vue from 'vue'

import { RefreshCwIcon, XIcon } from 'satellite-lucide-icons'

export default Vue.extend({
  components: {
    RefreshCwIcon,
    XIcon,
  },
  data() {
    return {
      hasMinorUpdate: false,
      requiresUpdate: false,
    }
  },
  mounted() {
    let lsVersion = localStorage.getItem('local-version')
    if (!lsVersion) {
      localStorage.setItem('local-version', this.$config.clientVersion)
      lsVersion = this.$config.clientVersion
      return
    }

    const minorVersion = this.$config.clientVersion.split('.')[1]
    const patchVersion = this.$config.clientVersion.split('.')[2]

    // A update which requires resetting of the app has occured.
    if (lsVersion.split('.')[1] !== minorVersion) {
      this.$data.requiresUpdate = true
      this.$data.hasMinorUpdate = true
      return
    }
    // A version which brings new features without major changes exists
    if (lsVersion.split('.')[2] !== patchVersion) {
      this.$data.hasMinorUpdate = true
      localStorage.setItem('local-version', this.$config.clientVersion)
    }
  },
  methods: {
    clearAndReload() {
      localStorage.clear()
      window.location.reload()
    },
    skipVersion() {
      localStorage.setItem('local-version', this.$config.clientVersion)
      this.$data.requiresUpdate = false
      this.$data.hasMinorUpdate = false
    }
  }
})
</script>

<style scoped lang="less" src="./UpdateModal.less"></style>
