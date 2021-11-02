<template src="./Realms.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Realm } from '~/types/ui/core'

export default Vue.extend({
  name: 'RealmsSettings',
  layout: 'settings',
  computed: {
    ...mapState(['settings']),
    realms() {
      return this.$Config.realms.map((r: Realm) => {
        const d: any = { ...r }
        d.text = `${r.nickname} (${r.id})`
        d.value = r.id
        return d
      })
    },
    isAllowEmbeddedLinks: {
      set(state) {
        this.$store.commit('embeddedLinks', state)
      },
      get() {
        return this.settings.embeddedLinks
      },
    },
  },
})
</script>
