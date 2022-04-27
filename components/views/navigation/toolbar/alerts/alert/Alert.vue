<template src="./Alert.html" />

<script lang="ts">
import Vue, { PropType } from 'vue'

import { Alert, AlertState } from '~/libraries/ui/Alerts'
import { AppNotification } from '~/types/ui/notifications'

export default Vue.extend({
  props: {
    alert: {
      type: Object as PropType<Alert>,
      required: false,
      default: () => {},
    },
    notification: {
      type: Object as PropType<Alert>,
      default: () => {},
      required: false,
    },
  },
  data() {
    return {
      localAlert: this.$props.alert,
      notificationInfo: this.$props.notification,
      hidden: false,
    }
  },
  mounted() {
    console.log(this.$props.alert)
  },
  methods: {
    dismiss() {
      this.$Alerts.delete(this.$props.alert.id)
      this.$data.hidden = true
      setTimeout(() => {
        this.$emit('sync', this.$Alerts.all)
      }, 250)
    },
  },
})
</script>

<style scoped lang="less" src="./Alert.less"></style>
