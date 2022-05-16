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
    ...mapGetters('accounts', ['getRegistrationStatus']),
    ...mapGetters(['allPrerequisitesReady']),
    hasToRegister() {
      return this.getRegistrationStatus === RegistrationStatus.UNKNOWN
    },
    registrationStep() {
      switch (this.getRegistrationStatus) {
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
    isRegistered() {
      return this.getRegistrationStatus === RegistrationStatus.REGISTERED
    },
  },
  watch: {
    allPrerequisitesReady(nextValue) {
      console.log(nextValue)
      if (!nextValue) return
      this.$router.replace('/chat/direct')
    },
  },
  mounted() {
    if (this.allPrerequisitesReady) {
      this.$router.replace('/chat/direct')
    }
  },
  methods: {
    async confirm(userData: UserRegistrationData) {
      try {
        await this.$store.dispatch('accounts/registerUser', {
          name: userData.username,
          image: userData.photoHash,
          status: userData.status,
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
