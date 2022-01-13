<template src="./Profile.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  props: {
    closeModal: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    ...mapState(['ui']),
  },
  methods: {
    closeProfileModal() {
      this.closeModal()
      this.$store.commit('ui/setUserProfile', {})
    },
  },
})
</script>

<style scoped lang="less" src="./Profile.less"></style>
