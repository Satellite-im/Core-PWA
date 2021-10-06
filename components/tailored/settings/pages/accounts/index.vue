<template src="./Accounts.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

// @ts-ignore
import { ClipboardIcon } from 'vue-feather-icons'

export default Vue.extend({
  name: 'AccountsSettings',
  components: {
    ClipboardIcon,
  },
  layout: 'settings',
  computed: {
    ...mapState(['accounts']),
  },
})
</script>
