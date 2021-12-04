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
  overflow: scroll;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;

  .loader-container {
    min-width: 250px;
    align-self: center;
    margin-bottom: 25vh;
  }
}
</style>
