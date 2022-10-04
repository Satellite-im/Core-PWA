<template>
  <div v-if="loaded" id="app" :class="`theme-${theme}`">
    <UiModal
      v-if="$store.state.ui.modals.errorNetwork.isOpen"
      :show-close-button="false"
    >
      <UiPopupsErrorNetwork />
    </UiModal>
    <Nuxt />
    <v-style>
      :root { --flair-color: {{ flair.primary }}; --flair-color-secondary:
      {{ flair.secondary }}; --flair-color-rgb: {{ flair.primaryRGB }}; }
    </v-style>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import useMeta from '~/components/compositions/useMeta'
import iridium from '~/libraries/Iridium/IridiumManager'
import { AccountsError } from '~/store/accounts/types'
import { flairs } from '~/libraries/Iridium/settings/types'

export default Vue.extend({
  name: 'Default',
  setup() {
    useMeta()
  },
  data() {
    return {
      loaded: false,
      theme: iridium.settings.state.theme,
      flair: flairs[iridium.settings.state.flair],
    }
  },
  mounted() {
    this.checkAccount()
  },
  methods: {
    async checkAccount() {
      try {
        await this.$store.dispatch('accounts/loadAccount')
        const onReady = () => {
          this.$router.replace('/auth/unlock')
        }
        if (iridium.ready) {
          this.loaded = true
          onReady()
        } else {
          iridium.on('ready', onReady)
        }
      } catch (error: any) {
        this.loaded = true
        if (error.message === AccountsError.MNEMONIC_NOT_PRESENT) {
          await this.$router.replace('/auth/unlock')
          return
        }
        if (error.message === AccountsError.USER_NOT_REGISTERED) {
          await this.$router.replace('/auth/register')
          return
        }
        if (error.message === AccountsError.USER_DERIVATION_FAILED) {
          await this.$router.replace('/setup/disclaimer')
        }
      }
    },
  },
})
</script>

<style lang="less" scoped>
#app {
  display: flex;
  justify-content: center;
  height: 100%;
  overflow-y: auto;
}
</style>
