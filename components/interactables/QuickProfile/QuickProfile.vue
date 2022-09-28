<template src="./QuickProfile.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { ArrowRightIcon, EditIcon } from 'satellite-lucide-icons'
import { User } from '~/libraries/Iridium/users/types'
import { SettingsRoutes } from '~/store/ui/types'
import iridium from '~/libraries/Iridium/IridiumManager'
import { RootState } from '~/types/store/store'
import { Conversation } from '~/libraries/Iridium/chat/types'

export default Vue.extend({
  components: {
    ArrowRightIcon,
    EditIcon,
  },
  data() {
    return {
      text: '',
    }
  },
  computed: {
    ...mapState({
      ui: (state) => (state as RootState).ui,
    }),
    user(): User | undefined {
      return this.ui?.quickProfile?.user
    },
    src(): string {
      const hash = this.user?.photoHash
      return hash ? `${this.$Config.ipfs.gateway}${hash}` : ''
    },
    conversationId(): Conversation['id'] | undefined {
      if (!this.user) {
        return
      }
      return iridium.chat.directConversationIdFromDid(this.user.did)
    },
    about(): string | undefined {
      return this.conversationId
        ? this.user?.about
        : iridium.profile.state?.about ?? ''
    },
    status(): string | undefined {
      return this.conversationId
        ? this.user?.status
        : iridium.profile.state?.status ?? ''
    },
  },
  mounted() {
    const quick = this.$refs.quick as HTMLElement
    quick.focus()

    if (this.$device.isDesktop && this.ui.quickProfile) {
      quick.style.top = `${this.ui.quickProfile.position.y}px`
      quick.style.left = `${this.ui.quickProfile.position.x}px`
    }
    this.handleOverflow()
  },
  methods: {
    close() {
      this.$store.commit('ui/setQuickProfile', undefined)
    },
    handleOverflow() {
      if (!this.ui.quickProfile || this.$device.isMobile) {
        return
      }
      const quick = this.$refs.quick as HTMLElement
      const widthOverflow =
        this.ui.quickProfile.position.x + quick.clientWidth - window.innerWidth
      const heightOverflow =
        this.ui.quickProfile.position.y +
        quick.clientHeight -
        window.innerHeight
      if (widthOverflow > -8) {
        quick.style.left = `${
          this.ui.quickProfile.position.x - widthOverflow - 16
        }px`
      }
      if (heightOverflow > -8) {
        quick.style.top = `${
          this.ui.quickProfile.position.y - heightOverflow - 16
        }px`
      }
    },
    sendMessage() {
      if (!this.user || !this.text.length || !this.conversationId) {
        return
      }

      if (this.conversationId !== this.$route.params.id) {
        this.$router.push(
          this.$device.isMobile
            ? `/mobile/chat/${this.conversationId}`
            : `/chat/${this.conversationId}`,
        )
      }

      iridium.chat.sendMessage({
        at: Date.now(),
        type: 'text',
        body: this.text,
        conversationId: this.conversationId,
        attachments: [],
        payload: {},
      })
      this.close()
    },
    openProfile() {
      if (iridium.id === this.user?.did) {
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
