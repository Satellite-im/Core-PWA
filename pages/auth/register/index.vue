<template src="./Register.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { TranslateResult } from 'vue-i18n'
import { RegistrationStatus } from '~/store/accounts/types'
import { RootState } from '~/types/store/store'
import { UserRegistrationData } from '~/types/ui/user'
import logger from '~/plugins/local/logger'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  name: 'RegisterScreen',
  data() {
    return {
      pin: '',
      error: false,
      storePin: false,
      decrypting: false,
      ready: false,
    }
  },
  computed: {
    ...mapState({
      accounts: (state) => (state as RootState).accounts,
    }),
    hasToRegister(): boolean {
      return this.accounts.registrationStatus === RegistrationStatus.UNKNOWN
    },
    registrationStep(): TranslateResult {
      switch (this.accounts.registrationStatus) {
        case RegistrationStatus.IN_PROGRESS:
          return this.$i18n.t('user.registration.reg_status.in_progress')
        case RegistrationStatus.FUNDING_ACCOUNT:
          return this.$i18n.t('user.registration.reg_status.funding_account')
        case RegistrationStatus.SENDING_TRANSACTION:
          return this.$i18n.t(
            'user.registration.reg_status.sending_transaction',
          )
        default:
          return this.$i18n.t('user.loading.loading_account')
      }
    },
    isRegistered(): boolean {
      return this.accounts.registrationStatus === RegistrationStatus.REGISTERED
    },
  },
  methods: {
    async confirm(userData: UserRegistrationData) {
      try {
        await this.$store.dispatch('accounts/registerUser', {
          name: userData.username,
          image: userData.photoHash,
          status: userData.status,
        })
        logger.info('pages/index/registerUser', 'success, waiting for ready')
        iridium.on('ready', () => {
          this.$router.replace(
            this.$device.isMobile ? 'mobile/chat' : '/friends',
          )
        })
      } catch (error: any) {
        this.$store.commit('ui/toggleErrorNetworkModal', {
          state: true,
          action: () => this.confirm(userData),
        })
      }
    },
  },
})
</script>

<style lang="less" scoped src="./Register.less"></style>
