<template>
  <div class="container">
    <div class="loader-container">
      <UiLoadersLoadingBar />
      <TypographyTitle :size="5" :text="$t('pages.loading.loading')" />
      <TypographySubtitle :size="6" :text="loadingStep" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'
import { AccountsError } from '~/store/accounts/types'

export default Vue.extend({
  name: 'Main',
  data() {
    return {}
  },
  computed: {
    ...mapGetters('accounts', ['getEncryptedPhrase', 'getActiveAccount']),
    ...mapGetters('prerequisites', ['allPrerequisitesReady']),
    ...mapState(['accounts']),
    // Helper method for prettier loading messages
    loadingStep(): string {
      switch (this.getActiveAccount) {
        default:
          return this.$i18n.t('user.loading.loading_account').toString()
      }
    },
  },
  mounted() {
    // Handle the case that the wallet is not found
    if (this.getEncryptedPhrase === '') {
      this.$router.replace('/setup/disclaimer')
      return
    }

    this.loadAccount()
  },
  watch: {
    // this.$router.replace('/chat/direct')
    allPrerequisitesReady(nextValue) {
      if (nextValue) {
        if (this.accounts.lastVisited && this.accounts.lastVisited !== this.$route.path) {
          this.$router.replace(this.accounts.lastVisited)
          return
        }
        this.$router.replace('/chat/direct')
      }
    },
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
      } catch (error: any) {
        if (error.message === AccountsError.USER_NOT_REGISTERED) {
          this.$router.replace('/auth/register')
        }
        if (error.message === AccountsError.USER_DERIVATION_FAILED) {
          this.$router.replace('/setup/disclaimer')
        }
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
  text-align: center;

  .loader-container {
    min-width: 250px;
    align-self: center;
    margin-bottom: 25vh;
  }
}

</style>
