<template src="./Alert.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import { TranslateResult } from 'vue-i18n'
import { Alert, AlertType } from '~/libraries/ui/Alerts'

export default Vue.extend({
  props: {
    alert: {
      type: Object as PropType<Alert>,
      required: true,
    },
  },
  computed: {
    setTranslateText(): TranslateResult | undefined {
      switch (this.alert?.type) {
        case AlertType.DIRECT_MESSAGE: {
          return this.$t('messaging.user_sent.user', {
            user: this.alert.fromName,
            msgType: this.alert.type,
          })
        }
        case AlertType.GROUP_MESSAGE: {
          return this.$t('messaging.user_sent_group_message.user', {
            user: this.alert.fromName,
            group: this.alert.groupName,
          })
        }
        case AlertType.MISSED_CALL: {
          return this.$t('pages.settings.notifications.missed_call_from', {
            user: this.alert.fromName,
          })
        }
      }
      return this.$t('user_sent_something.user')
    },
    alertImage(): string {
      const hash = this.alert?.content?.image
      return hash ? `${this.$Config.textile.browser}/ipfs/${hash}` : ''
    },
  },
  methods: {
    removeNotification() {
      this.$store.commit('ui/removeNotification', this.alert.id)
    },
  },
})
</script>

<style scoped lang="less" src="./Alert.less"></style>
