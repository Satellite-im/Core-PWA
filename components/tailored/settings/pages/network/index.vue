<template src="./Network.html"></template>

<script lang="ts">
import Vue from 'vue'

import { Realm } from '~/types/ui/core'

export default Vue.extend({
  name: 'NetworkSettings',
  layout: 'settings',
  computed: {
    realms() {
      return this.$Config.realms.map((r: Realm) => {
        const d: any = { ...r }
        d.text = `${r.nickname} (${r.id})`
        d.value = r.id
        return d
      })
    },
  },
})
</script>
