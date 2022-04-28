<template src="./Alerts.html" />

<script lang="ts">
import Vue, { PropType } from 'vue'

export default Vue.extend({
  data() {
    return {
      alerts: this.$Alerts.all,
    }
  },
  methods: {
    syncAlerts(alerts) {
      this.$data.alerts = alerts
    },
  },
})
</script>

<style scoped lang="less" src="./Alerts.less"></style>
