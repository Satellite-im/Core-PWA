<template>
  <div class="container">
    <UiLoadersPageLoader
      :is-loading="true"
      :title="$t('pages.loading.loading')"
      :subtitle="loadingStep"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import logger from '~/plugins/local/logger'
import { AccountsError } from '~/store/accounts/types'
import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  name: 'Main',
  computed: {
    ...mapState({
      accounts: (state) => (state as RootState).accounts,
    }),
    // Helper method for prettier loading messages
    loadingStep(): string {
      switch (this.accounts.active) {
        default:
          return this.$i18n.t('user.loading.loading_account').toString()
      }
    },
  },
  async mounted() {
    // Handle the case that the wallet is not found
    if (this.accounts.encryptedPhrase === '') {
      this.$router.replace('/setup/disclaimer')
      return
    }

    await this.loadAccount()

    this.$store.dispatch('ui/activateKeybinds')
  },
  methods: {
    /**
     * @method loadAccount
     * @description Load user account by dispatching the loadAccount action in store/accounts/actions.ts,
     * if successful route user to home page at /allcomponents,
     * if an error is thrown route user to authentication at /auth/register
     * @example mounted() { this.loadAccount() }
     */
    async loadAccount() {
      try {
        await this.$store.dispatch('accounts/loadAccount')
        logger.info('pages/index/loadAccount', 'success, waiting for ready')
        iridium.on('ready', () => {
          this.$router.replace(
            this.$device.isMobile ? '/mobile/chat' : '/friends',
          )
        })
      } catch (error: any) {
        if (error.message === AccountsError.USER_NOT_REGISTERED) {
          await this.$router.replace('/auth/register')
          return
        }
        if (error.message === AccountsError.USER_DERIVATION_FAILED) {
          await this.$router.replace('/setup/disclaimer')
          return
        }

        logger.error('pages/index/loadAccount', 'error loading account', {
          error,
        })
        this.$store.commit('ui/toggleErrorNetworkModal', {
          state: true,
          action: this.loadAccount,
        })
        this.$router.replace('/')
      }
    },
  },
})
</script>

<style scoped lang="less">
.container {
  margin: 0 auto;
  display: flex;
  justify-content: center;
  text-align: left;
}
</style>
