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
    alertDid: {
      type: String,
      required: true,
    },
  },
  // const friendUser = await this.iridium.friends.getFriend(
  //   this.state.conversation[conversationId].participants.find(
  //     (friendId) => {
  //       return friendId !== this.iridium.connector?.id
  //     },
  //   )!,
  // )
  //       const buildNotification: Partial<Notification> = {
  //         fromName: friendUser?.name,
  //         at: Date.now(),
  //         fromAddress: conversationId,
  //         title: `New message from ${friendUser?.name}`,
  //         description:
  //           msg.body.length > 79 ? `${msg.body.substring(0, 80)}...` : msg.body,
  //         image: friendUser?.photoHash,
  //         type: NotificationType.DIRECT_MESSAGE,
  //         seen: false,
  //       }
  //       this.iridium.notifications?.sendNotification(buildNotification)
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
    alertImage(): string {
      const hash = this.alert?.content?.image
      return hash ? `${this.$Config.ipfs.gateway}${hash}` : ''
    },
  },
  methods: {
    removeNotification(id: string) {
      console.log(this.alert)
      iridium.notifications.deleteNotification(this.alertDid)
    },
    notificationLink(alertType: NotificationType) {
      switch (alertType) {
        case NotificationType.FRIEND_REQUEST: {
          this.$router.push({ path: '/friends/list' })
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
