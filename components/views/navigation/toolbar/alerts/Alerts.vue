<template src="./Alerts.html" />

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapGetters, mapState } from 'vuex'
import { Alert, AlertState } from '~/libraries/ui/Alerts'

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
      alerts: this.$Alerts.all,
      AlertState,
    }
  },
  computed: {
    ...mapState(['ui']),
    ...mapGetters('ui', ['checkUnseenNotifications']),
  },
  methods: {
    syncAlerts(alerts: PropType<Array<Alert>>) {
      this.alerts = alerts
    },
    clearNotifications() {
      this.$store.dispatch('ui/clearAllNotifications')
    },
  },
})
</script>

<style scoped lang="less" src="./Alerts.less"></style>
