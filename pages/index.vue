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
import { mapGetters, mapState } from 'vuex'
import { AccountsError } from '~/store/accounts/types'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  name: 'Main',
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['allPrerequisitesReady']),
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
  watch: {
    allPrerequisitesReady: {
      handler(nextValue) {
        if (!nextValue) return
        this.eventuallyRedirect()
      },
      immediate: true,
    },
  },
  mounted() {
    console.info('index mounted')
    // Handle the case that the wallet is not found
    if (this.accounts.encryptedPhrase === '') {
      this.$router.replace('/setup/disclaimer')
      return
    }

    this.loadAccount()

    this.$store.dispatch('ui/activateKeybinds')
  },
  methods: {
    eventuallyRedirect() {
      if (this.accounts.lastVisited === this.$route.path) {
        this.$router.replace('/friends')
        return
      }

      const matcher = this.$router.match(this.accounts.lastVisited)
      if (matcher.matched.length > 0) {
        this.$router.replace(this.accounts.lastVisited)
      }

      this.$router.replace('/friends')
    },
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
      } catch (error: any) {
        if (error.message === AccountsError.USER_NOT_REGISTERED) {
          this.$router.replace('/auth/register')
          return
        }
        if (error.message === AccountsError.USER_DERIVATION_FAILED) {
          this.$router.replace('/setup/disclaimer')
          return
        }

        this.$store.commit('ui/toggleErrorNetworkModal', {
          state: true,
          action: this.loadAccount,
        })
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
