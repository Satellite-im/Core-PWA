<template src="./Alerts.html" />

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapGetters, mapState } from 'vuex'
import { Alert, AlertState } from '~/libraries/ui/Alerts'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  props: {
    notifications: {
      type: Array as PropType<Array<Alert>>,
      default: () => [],
      required: false,
    },
  },
  computed: {
    ...mapState({ ui: (state) => (state as RootState).ui }),
    ...mapGetters('ui', ['allUnseenNotifications']),
    AlertState: () => AlertState,
  },
  methods: {
    clearNotifications() {
      this.$store.commit('ui/clearAllNotifications')
    },
  },
})
</script>

<style scoped lang="less" src="./Alerts.less"></style>
