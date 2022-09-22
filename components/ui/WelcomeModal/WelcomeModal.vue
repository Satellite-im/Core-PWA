<template>
  <ModalDialog :primary-button="primaryButton">
    <template #image>
      <img src="~/assets/svg/mascot/new_things.svg" />
    </template>

    <template #title>
      {{ $t('welcome_message.welcome', { user: profile.name }) }}
    </template>

    <template #subtitle>{{ $t('welcome_message.ea_warning') }}</template>
  </ModalDialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { CheckIcon } from 'satellite-lucide-icons'
import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  data() {
    return {
      profile: iridium.profile.state,
    }
  },
  computed: {
    ...mapState({
      ui: (state) => (state as RootState).ui,
    }),
    primaryButton() {
      return {
        text: this.$t('modal.update_modal.got_it'),
        action: this.closeModal,
        icon: CheckIcon,
      }
    },
  },
  methods: {
    closeModal() {
      this.$store.commit('accounts/setNewAccount', false)
    },
  },
})
</script>
