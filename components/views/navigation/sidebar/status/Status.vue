<template src="./Status.html" />

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  computed: {
    ...mapState(['accounts']),
    src() {
      if (this.accounts?.details?.profilePicture) {
        return `${this.$Config.textile.browser}/ipfs/${this.accounts.details.profilePicture}`
      }
      return ''
    },
  },
})
</script>

<style scoped lang="less" src="./Status.less"></style>
