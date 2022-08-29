<template src="./Alert.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import { TranslateResult } from 'vue-i18n'
import {
  Notification,
  NotificationType,
} from '~/libraries/Iridium/notifications/types'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  props: {
    alert: {
      type: Object as PropType<Notification>,
      required: true,
    },
  },
  computed: {
    setTranslateText(): TranslateResult | undefined {
      switch (this.alert?.type) {
        case NotificationType.DIRECT_MESSAGE: {
          return this.$t('messaging.user_sent.user', {
            user: this.alert.fromName,
            msgType: this.alert.type,
          })
        }
        case NotificationType.FRIEND_REQUEST: {
          return this.$t('friends.new_friend_request', {
            user: this.alert.fromName,
          })
        }
      }
      return this.$t('user_sent_something.user')
    },
    // alertImage(): string {
    //   const hash = this.alert?.image
    //   return hash ? `${this.$Config.textile.browser}/ipfs/${hash}` : ''
    // },
  },
  methods: {
    removeNotification() {
      iridium.notifications.deleteNotification(this.alert.id as string)
    },
    notificationLink(alertType: NotificationType) {
      switch (alertType) {
        case NotificationType.FRIEND_REQUEST: {
          this.$router.push({ path: '/friends' })
          break
        }
        case NotificationType.DIRECT_MESSAGE: {
          this.$router.push(
            this.alert.fromAddress ? `/chat/${this.alert.fromAddress}` : `/`,
          )
          break
        }
      }
    },
  },
})
</script>

<style scoped lang="less" src="./Alert.less"></style>
