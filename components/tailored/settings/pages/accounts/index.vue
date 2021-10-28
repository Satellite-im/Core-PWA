<template src="./Accounts.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import { ClipboardIcon } from 'satellite-lucide-icons'

export default Vue.extend({
  name: 'AccountsSettings',
  components: {
    ClipboardIcon,
  },
  layout: 'settings',
  data() {
    return {}
  },
  computed: {
    ...mapState(['accounts']),
    storePin: {
      set(state) {
        this.$store.commit('accounts/setStorePin', state)
      },
      get() {
        return this.accounts.storePin
      },
    },
  },
})
</script>
