<template src="./Alert.html" />

<script lang="ts">
import Vue, { PropType } from 'vue'

import { mapState } from 'vuex'
import { Alert, AlertType } from '~/libraries/ui/Alerts'

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
      AlertType,
    }
  },
  computed: {
    ...mapState(['ui']),
  },
  methods: {
    dismiss() {
      this.$store.dispatch('ui/removeSeenNotification', this.$props.alert.id)
      this.$data.hidden = true
      setTimeout(() => {
        this.$emit('sync', this.$Alerts.all)
      }, 250)
    },
  },
})
</script>

<style scoped lang="less" src="./Alert.less"></style>
