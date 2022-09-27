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
  async mounted() {
    try {
      await this.$store.dispatch('accounts/loadAccount')
      const onReady = () => {
        this.$router.push('/auth/unlock')
      }
      if (iridium.ready) {
        this.loaded = true
        onReady()
      } else {
        iridium.on('ready', onReady)
      }
    } catch (error: any) {
      this.loaded = true

      const redirectObj = {
        [AccountsError.MNEMONIC_NOT_PRESENT]: '/auth/unlock',
        [AccountsError.USER_NOT_REGISTERED]: '/auth/register',
        [AccountsError.USER_DERIVATION_FAILED]: '/setup/disclaimer',
      }
      if (this.$route.path === redirectObj[error.message]) {
        return
      }

      if (error.message === AccountsError.TIMED_OUT) {
        this.$toast.error(this.$t('errors.accounts.timed_out') as string)
        this.$store.commit('ui/toggleErrorNetworkModal', {
          state: true,
          action: () => this.$router.replace('/auth/unlock'),
        })
      }

      redirectObj[error.message] &&
        this.$router.push(redirectObj[error.message])
    }
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
