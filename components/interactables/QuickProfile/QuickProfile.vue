<template src="./QuickProfile.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { ArrowRightIcon } from 'satellite-lucide-icons'
import { User } from '~/libraries/Iridium/users/types'
import { SettingsRoutes } from '~/store/ui/types'
import iridium from '~/libraries/Iridium/IridiumManager'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  components: {
    ArrowRightIcon,
  },
  data() {
    return {
      text: '',
    }
  },
  computed: {
    ...mapState({
      quickProfile: (state) => (state as RootState).ui.quickProfile,
    }),
    isMe(): boolean {
      return iridium.id === this.user?.did
    },
    user(): User | undefined {
      return this.quickProfile?.user
    },
    src(): string {
      const hash = this.user?.photoHash
      return hash ? `${this.$Config.ipfs.gateway}${hash}` : ''
    },
  },
  mounted() {
    const quick = this.$refs.quick as HTMLElement
    quick.focus()

    if (this.$device.isDesktop && this.quickProfile) {
      quick.style.top = `${this.quickProfile.position.y}px`
      quick.style.left = `${this.quickProfile.position.x}px`
    }
    this.handleOverflow()
  },
  methods: {
    close() {
      this.$store.commit('ui/setQuickProfile', undefined)
    },
    handleOverflow() {
      if (!this.quickProfile || this.$device.isMobile) {
        return
      }
      const quick = this.$refs.quick as HTMLElement
      const clickX = this.quickProfile.position.x
      const clickY = this.quickProfile.position.y
      const widthOverflow = clickX + quick.clientWidth - window.innerWidth
      const heightOverflow = clickY + quick.clientHeight - window.innerHeight
      if (widthOverflow > -8) {
        quick.style.left = `${this.quickProfile.position.x - widthOverflow}px`
      }
      if (heightOverflow > -8) {
        quick.style.top = `${this.quickProfile.position.y - heightOverflow}px`
      }
    },
    sendMessage() {
      if (!this.user || !this.text.length) {
        return
      }
      const conversationId = iridium.chat.directConversationIdFromDid(
        this.user.did,
      )
      if (!conversationId) {
        return
      }

      if (conversationId !== this.$route.params.id) {
        this.$router.push(
          this.$device.isMobile
            ? `/mobile/chat/${conversationId}`
            : `/chat/${conversationId}`,
        )
      }

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
      if (!this.user) {
        return
      }
      if (this.isMe) {
        this.$store.commit('ui/setSettingsRoute', SettingsRoutes.PROFILE)
        this.close()
      } else {
        // hide profile modal depend on this task AP-1717 (https://satellite-im.atlassian.net/browse/AP-1717)
        // this.$store.dispatch('ui/showProfile', this.user)
      }
    },
  },
})
</script>
<style scoped lang="less" src="./QuickProfile.less"></style>
