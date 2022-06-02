<template src="./Alerts.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'
import { AlertState } from '~/libraries/ui/Alerts'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  computed: {
    ...mapState({
      notifications: (state) => (state as RootState).ui.notifications,
    }),
    ...mapGetters('ui', ['allUnseenNotifications']),
    AlertState: () => AlertState,
  },
  methods: {
    clearNotifications() {
      this.$store.commit('ui/setNotifications', [])
    },
  },
})
</script>

<style scoped lang="less" src="./Alerts.less"></style>
