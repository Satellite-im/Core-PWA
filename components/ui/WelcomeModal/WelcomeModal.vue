<template src="./WelcomeModal.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { RefreshCwIcon, CheckIcon } from 'satellite-lucide-icons'
import VueMarkdown from 'vue-markdown'
import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  components: {
    RefreshCwIcon,
    CheckIcon,
    VueMarkdown,
  },
  data() {
    return {
      profile: iridium.profile.state,
    }
  },
  computed: {
    ...mapState({
      ui: (state) => (state as RootState).ui,
    }),
  },
  methods: {
    closeModal() {
      this.$store.commit('accounts/setNewAccount', false)
    },
  },
})
</script>

<style scoped lang="less" src="./WelcomeModal.less"></style>
