<template src="./Notifications.html"></template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'NotificationsSettings',
  layout: 'settings',
  data() {
    return {
      NotificationsEnabled: false,
      NotificationStatus: '',
      Platform: 'android',
      NotificationText: '',
    }
  },
  computed: {
    isNotificationsEnabled: {
      set(state: boolean) {
        // @ts-ignore
        this.$notifications.requestNotificationPermission()
        this.$data.NotificationsEnabled = state
      },
      get() {
        return this.$data.NotificationsEnabled
      },
    },
    // notificationResponse: () => {
    //   // @ts-ignore
    //   return this.$notifications.registerNotificationWatch()
    // }
  },
  mounted() {
    // Check for new input sources

    // @ts-ignore
    this.$data.Platform = this.$notifications.currentPlatform
    // @ts-ignore
    this.$data.NotificationStatus = this.$notifications.notificationPermission

    // @ts-ignore
    switch (this.$notifications.notificationPermission) {
      case 'granted':
        this.$data.NotificationsEnabled = true
        break
      default:
        this.$data.NotificationsEnabled = false
    }
  },
  methods: {
    /**
     * @method requestPermissions DocsTODO
     * @description Uses the local $notifcations plugins requestNotificationPermission method
     * which prompts the platform to request the users permission to send notifications
     * (Based on the Notification object in notifications.ts)
     * @example ---
     */
    requestPermissions() {
      // @ts-ignore
      this.$notifications.requestNotificationPermission()
    },
    /**
     * @method sendNotification DocsTODO
     * @description Uses the local $notifcations plugins sendNotifications method to send the user a notification
     * (Based on the Notification object in notifications.ts)
     * @example ---
     */
    sendNotification() {
      this.$notifications
        // @ts-ignore
        .sendNotifications(
          'Satellite',
          'Satellite',
          this.$data.NotificationText
        )
    },
  },
})
</script>
