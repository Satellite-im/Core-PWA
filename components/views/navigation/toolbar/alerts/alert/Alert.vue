<template src="./Alert.html" />

<script lang="ts">
import Vue, { PropType } from 'vue'

import { mapState } from 'vuex'
import { Alert, AlertType } from '~/libraries/ui/Alerts'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  props: {
    alert: {
      type: Object as PropType<Alert>,
      required: false,
      default: () => {},
    },
  },
  data() {
    return {
      hidden: false,
      AlertType,
      translateText: '',
      translateParameter: {},
    }
  },
  computed: {
    ...mapState({ ui: (state) => (state as RootState).ui }),
  },
  mounted() {
    switch (this.alert?.type) {
      case AlertType.DIRECT_MESSAGE: {
        this.translateText = 'messaging.user_sent.user'
        this.translateParameter = {
          user: this.alert.from,
          msgType: this.alert.type,
        }
      }
    }
  },
  methods: {
    dismiss() {
      this.$store.dispatch('ui/removeSeenNotification', this.alert.id)
      this.$data.hidden = true
    },
  },
})
</script>

<style scoped lang="less" src="./Alert.less"></style>
