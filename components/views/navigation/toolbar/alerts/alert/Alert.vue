<template src="./Alert.html" />

<script lang="ts">
import Vue, { PropType } from 'vue'

import { Alert, AlertState } from '~/libraries/ui/Alerts'

export default Vue.extend({
  props: {
    alert: {
      type: Object as PropType<Alert>,
      required: true,
      default: {},
    },
  },
  data() {
    return {
      localAlert: this.$props.alert,
      hidden: false,
    }
  },
  mounted() {
    if (this.$props.alert.state !== AlertState.READ) {
      const updated = this.$Alerts.mark(AlertState.READ, this.$props.alert.id)
      this.$data.localAlert = updated
    }
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
