<template src="./Register.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { RegistrationStatus } from '~/store/accounts/types'
import { UserRegistrationData } from '~/types/ui/user'

export default Vue.extend({
  name: 'RegisterScreen',
  data() {
    return {
      pin: '',
      error: false,
      storePin: false,
      decrypting: false,
    }
  },
  computed: {
    ...mapGetters(['getRegistrationStatus']),
    hasToRegister() {
      return this.getRegistrationStatus === RegistrationStatus.UKNOWN
    },
    registrationStep() {
      switch (this.getRegistrationStatus) {
        case RegistrationStatus.IN_PROGRESS:
          return this.$i18n.t('user.registration.reg_status.in_progress')
        case RegistrationStatus.FUNDING_ACCOUNT:
          return this.$i18n.t('user.registration.reg_status.funding_account')
        case RegistrationStatus.SENDING_TRANSACTION:
          return this.$i18n.t(
            'user.registration.reg_status.sending_transaction'
          )
        default:
          return this.$i18n.t('user.registration.reg_status.registered')
      }
    },
    isRegistered() {
      return this.getRegistrationStatus === RegistrationStatus.REGISTERED
    },
  },
  mounted() {},
  methods: {
    async confirm(userData: UserRegistrationData) {
      // TODO: upload picture to pinata first
      await this.$store.dispatch('accounts/registerUser', {
        name: userData.username,
        photoHash: '',
        status: userData.status,
      })

      this.$router.replace('/allcomponents')
    },
  },
})
</script>

<style lang="less" scoped src="./Register.less"></style>
