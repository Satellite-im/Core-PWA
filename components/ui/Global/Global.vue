<template src="./Global.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { ModalWindows } from '~/store/ui/types'
import iridium from '~/libraries/Iridium/IridiumManager'
import { WebRTCIncomingCall } from '~/libraries/Iridium/webrtc/types'
import { PropCommonEnum } from '~/libraries/Enums/enums'
import { RootState } from '~/types/store/store'
import {
  Notification,
  NotificationType,
  NotificationBase,
} from '~/libraries/Iridium/notifications/types'

export default Vue.extend({
  name: 'Global',
  data() {
    return {
      webrtc: iridium.webRTC.state,
    }
  },
  computed: {
    ...mapState({
      ui: (state) => (state as RootState).ui,
      files: (state) => (state as RootState).files,
      settings: (state) => (state as RootState).settings,
      isNewAccount: (state) => (state as RootState).accounts.isNewAccount,
    }),
    ModalWindows: () => ModalWindows,
    incomingCall(): WebRTCIncomingCall | null {
      return this.webrtc.incomingCall
    },
    isBackgroundCall(): boolean {
      return iridium.webRTC.isBackgroundCall(this.$route.params.id)
    },
    isActiveCall(): boolean {
      return iridium.webRTC.isActiveCall(this.$route.params.id)
    },
  },
  watch: {
    'settings.audioInput'(audioInput: string) {
      this.updateWebRTCState({ audioInput })
    },
    'settings.videoInput'(videoInput: string) {
      this.updateWebRTCState({ videoInput })
    },
  },
  mounted() {
    // This determines if we should show the
    let lsVersion = localStorage.getItem('local-version')

    if (!lsVersion) {
      localStorage.setItem('local-version', this.$config.clientVersion)
      lsVersion = this.$config.clientVersion
      return
    }

    const [majorVersion, minorVersion, patchVersion] =
      this.$config.clientVersion.split('.')
    const [lsMajorVersion, lsMinorVersion, lsPatchVersion] =
      lsVersion.split('.')

    // A update which requires resetting of the app has occurred.
    if (lsMinorVersion !== minorVersion) {
      this.$data.requiresUpdate = true
      this.$data.hasMinorUpdate = true
    }

    // A version which brings new features without major changes exists
    if (lsPatchVersion !== patchVersion) {
      this.$data.hasMinorUpdate = true
    }

    if (this.$config.clientVersion !== lsVersion) {
      this.toggleModal(ModalWindows.CHANGELOG)
      localStorage.setItem('local-version', this.$config.clientVersion)
    }

    const { audioInput, videoInput } = this.settings
    this.updateWebRTCState({ audioInput, videoInput })

    const routeCheck = (conversationId: string) => {
      if (conversationId === this.$route.params.id) {
        this.$router.push(this.$device.isMobile ? `/mobile/chat` : `/friends`)
      }
    }

    iridium.friends.on('routeCheck', (conversationId: string) =>
      routeCheck(conversationId),
    )
    iridium.chat.on('routeCheck', (conversationId: string) =>
      routeCheck(conversationId),
    )
    this.listenForNotifications()
  },
  methods: {
    listenForNotifications() {
      iridium.notifications.on(
        'notification/create',
        (data: NotificationBase) => {
          const notification: Notification = {
            at: data.at || Date.now(),
            type: data.type,
            fromName: data.fromName,
            title: this.$t(data.title, data.titleValues) as string,
            description: this.$t(
              data.description,
              data.descriptionValues,
            ) as string,
            seen: false,
            image: data.image || '',
            onNotificationClick: () =>
              this.handleNotificationClick(
                data.type,
                data.notificationClickParams,
              ),
          }

          iridium.notifications.sendNotification(notification)
        },
      )
    },
    handleNotificationClick(
      type: NotificationType,
      params: Record<string, any> = {},
    ) {
      switch (type) {
        case NotificationType.FRIEND_REQUEST: {
          const mobileLink = '/mobile/friends?route=requests'
          const desktopLink = '/friends?route=requests'
          this.$router.push(this.$device.isMobile ? mobileLink : desktopLink)
          break
        }
        case NotificationType.GROUP_MESSAGE:
        case NotificationType.DIRECT_MESSAGE: {
          const conversationId = params.conversationId
          const mobileLink = `/mobile/chat/${conversationId}`
          const desktopLink = `/chat/${conversationId}`
          this.$router.push(this.$device.isMobile ? mobileLink : desktopLink)
          break
        }
      }
    },
    /**
     * @method toggleModal
     * @description
     * @example
     */
    toggleModal(modalName: ModalWindows): void {
      this.$store.commit('ui/toggleModal', {
        name: modalName,
        state: !this.ui.modals[modalName],
      })
    },
    /**
     * @method updateWebRTCState
     * @description Updates the WebRTC state with the given settings.
     * @example this.updateWebRTCState({ audioInput: 'default', videoInput: 'default' })
     */
    updateWebRTCState({
      audioInput,
      videoInput,
    }: {
      audioInput?: string
      videoInput?: string
    }) {
      const streamConstraints = {} as MediaStreamConstraints

      if (audioInput && audioInput !== PropCommonEnum.DEFAULT) {
        streamConstraints.audio = { deviceId: audioInput }
      }
      if (videoInput && videoInput !== PropCommonEnum.DEFAULT) {
        streamConstraints.video = { deviceId: videoInput }
      }

      iridium.webRTC.streamConstraints = streamConstraints
    },
  },
})
</script>
