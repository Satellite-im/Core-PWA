<template src="./Alerts.html" />

<script lang="ts">
import Vue, { PropType } from 'vue'
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
  methods: {
    syncAlerts(alerts: PropType<Array<Alert>>) {
      this.$data.alerts = alerts
    },
  },
})
</script>

<style scoped lang="less" src="./Alerts.less"></style>
