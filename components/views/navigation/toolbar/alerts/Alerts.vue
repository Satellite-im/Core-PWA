<template src="./Alerts.html" />

<script lang="ts">
import Vue, { PropType } from 'vue'
import { AppNotification } from '~/types/ui/notifications'

export default Vue.extend({
  props: {
    notifications: {
      type: Array as PropType<Array<AppNotification>>,
      default: () => {},
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
  mounted() {
    if (this.$props.notifications?.includes(false, ['seen'])) {
      this.allSeen = false
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
