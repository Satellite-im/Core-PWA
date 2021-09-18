<template src="./Accounts.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  name: 'AccountsSettings',
  layout: 'settings',
  computed: {
    ...mapState(['accounts']),
  },
})
</script>
