<template src="./WelcomeModal.html" />

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { RefreshCwIcon, XIcon, CheckIcon } from 'satellite-lucide-icons'
import VueMarkdown from 'vue-markdown'
import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  components: {
    RefreshCwIcon,
    CheckIcon,
    XIcon,
    VueMarkdown,
  },
  data() {
    return {
      profile: iridium.profile.state,
      isLoading: false,
    }
  },
  computed: {
    ...mapState({
      ui: (state) => (state as RootState).ui,
    }),
  },
  methods: {
    toggleVisibility() {
      this.$store.commit('ui/toggleModal', {
        name: 'welcome',
        state: !this.ui.modals.welcome,
      })
      this.$store.commit('ui/welcomeDismiss')
    },
    dismissForever() {
      this.$store.commit('ui/toggleModal', {
        name: 'welcome',
        state: !this.ui.modals.welcome,
      })
      this.$store.dispatch('accounts/setWelcomeMessageDismiss')
    },
  },
})
</script>

<style scoped lang="less" src="./WelcomeModal.less"></style>
