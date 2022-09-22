<template>
  <transition name="modal">
    <UiModal v-if="showModal" @close="close">
      <Confirmation
        :show-confirm-button="showConfirmButton"
        @confirm="confirm"
        @close="close"
      >
        <template #title><slot name="title" /></template>
        <template #body><slot name="body" /></template>
      </Confirmation>
    </UiModal>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue'
import Confirmation from '../../views/confirmation/Confirmation.vue'

export default Vue.extend({
  components: { Confirmation },
  props: {
    showModal: {
      type: Boolean,
      default: false,
    },
    showConfirmButton: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    close() {
      this.$emit('close')
    },
    confirm() {
      this.$emit('confirm')
    },
  },
})
</script>
