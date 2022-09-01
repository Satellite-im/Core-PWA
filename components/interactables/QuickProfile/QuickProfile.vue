<template src="./QuickProfile.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { ArrowRightIcon } from 'satellite-lucide-icons'
import { User, UserStatus } from '~/libraries/Iridium/users/types'
import { SettingsRoutes } from '~/store/ui/types'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  components: {
    ArrowRightIcon,
  },
  props: {
    user: {
      type: Object as PropType<User>,
      default: () => {},
    },
  },
  data() {
    return {
      isEmptyMessage: false,
      text: '',
    }
  },
  computed: {
    ...mapState(['ui', 'accounts']),
    isMe(): boolean {
      return iridium.id === this.user?.did
    },
    src(): string {
      const hash = this.user?.photoHash
      return hash ? `${this.$Config.ipfs.gateway}${hash}` : ''
    },
    status(): UserStatus {
      return (
        (this.user && iridium.users.ephemeral.status[this.user.did]) ||
        'offline'
      )
    },
  },
  watch: {
    text() {
      if (this.isEmptyMessage && !this.$Config.regex.empty.test(this.text))
        this.isEmptyMessage = false
    },
    isEmptyMessage() {
      this.$nextTick(this.handleOverflow)
    },
  },
  mounted() {
    this.handleOverflow()
  },
  methods: {
    /**
     * @method close
     * @description Closes quickProfile by committing quickProfile false to state
     */
    close() {
      this.$store.commit('ui/quickProfile', false)
    },
    /**
     * @method close
     * @description Ensures quickProfile is positioned correctly by calculating if the div overflows the page and repositioning as needed.
     * Corrects position by committing an adjusted position to setQuickProfilePosition in state
     */
    handleOverflow() {
      if (this.$device.isDesktop) {
        const quickProfile = this.$refs.quickProfile as HTMLElement
        if (quickProfile) {
          const position = this.ui.quickProfilePosition
          let clickX = position.x
          let clickY = position.y
          const widthOverflow =
            clickX + quickProfile.clientWidth - window.innerWidth
          const heightOverflow =
            clickY + quickProfile.clientHeight - window.innerHeight
          if (widthOverflow > -8) {
            clickX -= quickProfile.clientWidth
            this.$store.commit('ui/setQuickProfilePosition', {
              x: clickX,
              y: clickY,
            })
          }
          if (heightOverflow > -8) {
            clickY -= heightOverflow + 12
            this.$store.commit('ui/setQuickProfilePosition', {
              x: clickX,
              y: clickY,
            })
          }
        }
      }
    },
    sendMessage() {
      if (!this.user) return
      if (this.$Config.regex.empty.test(this.text)) {
        this.isEmptyMessage = true
        return
      }
      const conversationId = iridium.chat.directConversationIdFromDid(
        this.user.did,
      ) as string
      iridium.chat.sendMessage({
        at: Date.now(),
        type: 'text',
        body: this.text,
        conversationId,
        attachments: [],
        payload: {},
      })
      this.close()
    },
    openProfile() {
      if (this.user) {
        if (this.isMe) {
          this.close()
          this.$store.commit('ui/setSettingsRoute', SettingsRoutes.PROFILE)
          // hide profile modal depend on this task AP-1717 (https://satellite-im.atlassian.net/browse/AP-1717)
          // return
        }
        // hide profile modal depend on this task AP-1717 (https://satellite-im.atlassian.net/browse/AP-1717)
        // this.$store.dispatch('ui/showProfile', this.user)
      }
    },
  },
})
</script>
<style scoped lang="less" src="./QuickProfile.less"></style>
