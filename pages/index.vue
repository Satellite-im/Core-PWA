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
import { mapGetters } from 'vuex'
import { AccountsError } from '~/store/accounts/types'

export default Vue.extend({
  name: 'Main',
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['getEncryptedPhrase', 'getActiveAccount']),
    // Helper method for prettier loading messages
    loadingStep(): string {
      switch (this.getActiveAccount) {
        default:
          return this.$i18n.t('user.loading.loading_account').toString()
      }
    },
  },
  mounted() {
    if (this.getEncryptedPhrase === '') {
      this.$router.replace('/setup/disclaimer')
    } else {
      this.loadAccount()
    }
  },
  methods: {
    /**
     * @method
     * @description
     * @param
     * @returns
     * @example
     */
    async loadAccount() {
      try {
        await this.$store.dispatch('loadAccount')

        this.$router.replace('/allcomponents')
      } catch (error) {
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

  .loader-container {
    min-width: 250px;
    align-self: center;
    margin-bottom: 25vh;
  }
}
</style>