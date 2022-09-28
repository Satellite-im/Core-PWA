<template src="./Alerts.html"></template>

<script lang="ts">
import Vue from 'vue'
import { FlaskConicalIcon } from 'satellite-lucide-icons'
import iridium from '~/libraries/Iridium/IridiumManager'
import { Notification } from '~/libraries/Iridium/notifications/types'
export default Vue.extend({
  components: {
    FlaskConicalIcon,
  },
  data() {
    return {
      notifications: iridium.notifications.state,
    }
  },
  computed: {
    alerts(): Notification[] {
      return this.notifications.notifications
    },
  },
  methods: {
    clearNotifications() {
      return iridium.notifications.deleteAll()
    },
  },
})
</script>

<style scoped lang="less" src="./Alerts.less"></style>
