<template src="./Network.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { RootState } from '~~/types/store/store'
import { Realm } from '~~/types/ui/realm'

export default Vue.extend({
  name: 'NetworkSettings',
  layout: 'settings',
  data: () => ({
    network: 'testnet',
  }),
  computed: {
    ...mapState({
      settings: (state) => (state as RootState).settings,
    }),
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
        this.$store.commit('settings/embeddedLinks', state)
      },
      get() {
        return this.settings.embeddedLinks
      },
    },
  },
})
</script>
