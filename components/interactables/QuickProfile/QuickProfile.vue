<template src="./QuickProfile.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import {
  ArrowRightIcon,
  ChevronRightIcon,
  EditIcon,
} from 'satellite-lucide-icons'
import { User, UserStatus } from '~/libraries/Iridium/users/types'
import { SettingsRoutes } from '~/store/ui/types'
import iridium from '~/libraries/Iridium/IridiumManager'
import { RootState } from '~/types/store/store'
import { Conversation } from '~/libraries/Iridium/chat/types'

export default Vue.extend({
  components: {
    ArrowRightIcon,
    ChevronRightIcon,
    EditIcon,
  },
  data() {
    return {
      text: '',
      isStatusMenuVisible: false,
      users: iridium.users,
    }
  },
  computed: {
    ...mapState({
      quickProfile: (state) => (state as RootState).ui.quickProfile,
    }),
    user(): User | undefined {
      return this.quickProfile?.user
    },
    isMe(): boolean {
      return iridium.id === this.user?.did
    },
    conversationId(): Conversation['id'] | undefined {
      if (!this.user) {
        return
      }
      return iridium.chat.directConversationIdFromDid(this.user.did)
    },
    status(): UserStatus {
      if (!this.user?.did) {
        return 'offline'
      }
      return this.isMe
        ? 'online'
        : this.users?.ephemeral.status[this.user.did] ?? 'offline'
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
      const widthOverflow =
        this.quickProfile.position.x + quick.clientWidth - window.innerWidth
      const heightOverflow =
        this.quickProfile.position.y + quick.clientHeight - window.innerHeight
      if (widthOverflow > -8) {
        quick.style.left = `${
          this.quickProfile.position.x - widthOverflow - 16
        }px`
      }
      if (heightOverflow > -8) {
        quick.style.top = `${
          this.quickProfile.position.y - heightOverflow - 16
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
    openProfile() {},
    openSettings() {
      this.$store.commit('ui/setSettingsRoute', SettingsRoutes.PROFILE)
      this.close()

      if (this.$device.isMobile) {
        this.$router.push('/mobile/settings')
      }
    },
    setMenuVis(val: boolean) {
      this.isStatusMenuVisible = val
    },
  },
})
</script>
<style scoped lang="less" src="./QuickProfile.less"></style>
