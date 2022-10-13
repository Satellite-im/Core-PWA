<template src="./QuickProfile.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import {
  ArrowRightIcon,
  ChevronRightIcon,
  EditIcon,
} from 'satellite-lucide-icons'
import { createFocusTrap, FocusTrap, Options } from 'focus-trap'
import { User, UserStatus } from '~/libraries/Iridium/users/types'
import { SettingsRoutes } from '~/store/ui/types'
import iridium from '~/libraries/Iridium/IridiumManager'
import { RootState } from '~/types/store/store'
import { Conversation } from '~/libraries/Iridium/chat/types'
import { handleEsc } from '~/components/compositions/events'

export default Vue.extend({
  components: {
    ArrowRightIcon,
    ChevronRightIcon,
    EditIcon,
  },
  setup(props, { emit }) {
    function close() {
      emit('close')
    }

    handleEsc(close)

    return {
      close,
    }
  },
  data: () => ({
    text: '',
    isStatusMenuVisible: false,
    users: iridium.users,
    trap: null as FocusTrap | null,
  }),
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
  beforeDestroy() {
    this.trap?.deactivate()
  },
  mounted() {
    const quick = this.$refs.quick as HTMLElement

    // non friend quick profiles do not have buttons. will add profile link later and remove this check
    if (this.conversationId || this.isMe) {
      const options: Options = {
        allowOutsideClick: true,
        escapeDeactivates: false,
      }
      this.trap = createFocusTrap(quick, options)
      this.trap.activate()
    }

    if (this.$device.isDesktop && this.quickProfile) {
      quick.style.top = `${this.quickProfile.position.y}px`
      quick.style.left = `${this.quickProfile.position.x}px`
    }
    this.handleOverflow()
  },
  methods: {
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
      if (!this.user || !this.conversationId) {
        return
      }
      this.$router.push(
        `${this.$device.isMobile ? '/mobile' : ''}/chat/${this.conversationId}`,
      )
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
