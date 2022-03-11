<template src="./Invite.html" />

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  name: 'GroupInvite',
  data() {
    return {
      isLoading: false,
      recipient: '',
      error: '',
    }
  },
  computed: mapState({
    modal: state => state.ui.modals.groupInvite,
  }),
  methods: {
    async confirm() {
      try {
        this.error = ''
        this.isLoading = true

        await this.$store.dispatch('groups/sendGroupInvite', {
          group: this.modal.group,
          recipient: this.recipient,
        })

        this.$store.commit('ui/toggleModal', {
          name: 'groupInvite',
          state: { isOpen: false },
        })
      } catch (e: any) {
        this.error = e.message
      } finally {
        this.isLoading = false
      }
    },
  },
})
</script>

<style scoped lang="less" src="./Invite.less"></style>
