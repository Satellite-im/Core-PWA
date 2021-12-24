<template src="./Personalize.html" />

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Themes } from '~/store/ui/types.ts'
export default Vue.extend({
  name: 'PersonalizeSettings',
  layout: 'settings',
  data() {
    return {
      themes: Themes,
    }
  },
  computed: {
    ...mapState(['ui']),
    // React to v-model changes to echoCancellation and update
    // the state accordingly with the mutation
    theme: {
      set(state) {
        console.log('themes', Themes)
        const activeTheme = Themes.find((th) => {
          console.log('th', th)
          return th.value === state
        })
        console.log('activeTheme', activeTheme)
        console.log('state', state)
        this.$store.commit('ui/updateTheme', activeTheme)
      },
      get() {
        return this.ui.theme.base.value
      },
    },
  },
})
</script>
