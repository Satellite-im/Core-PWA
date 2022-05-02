<template src="./Alerts.html" />

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { Alert } from '~/libraries/ui/Alerts'

export default Vue.extend({
  props: {
    notifications: {
      type: Array as PropType<Array<Alert>>,
      default: () => [],
      required: false,
    },
  },
  data() {
    return {
      allNotifications: [],
      alerts: this.$Alerts.all,
      allSeen: true,
    }
  },
  computed: {
    ...mapState(['ui']),
  },
  methods: {
    syncAlerts(alerts: PropType<Array<Alert>>) {
      this.$data.alerts = alerts
    },
    clearNotifications() {
      this.$store.dispatch('ui/clearAllNotifications')
    },
  },
})
</script>

<style scoped lang="less" src="./Alerts.less"></style>
