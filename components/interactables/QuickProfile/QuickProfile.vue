<template src="./QuickProfile.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { ArrowRightIcon } from 'satellite-lucide-icons'
import { User } from '~/types/ui/user'

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
      return this.accounts.details.textilePubkey === this.user?.textilePubkey
    },
    src(): string {
      const hash = this.user?.profilePicture
      return hash ? `${this.$Config.textile.browser}/ipfs/${hash}` : ''
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
      if (this.$Config.regex.empty.test(this.text)) {
        this.isEmptyMessage = true
        return
      }
      this.$store.dispatch('textile/sendTextMessage', {
        to: this.user?.textilePubkey,
        text: this.text,
      })
      this.close()
    },
    openProfile() {
      this.close()
      if (this.user) {
        const isMe = this.user.address === this.accounts.active

        if (isMe) {
          this.$store.commit('ui/toggleSettings', {
            show: true,
            defaultRoute: 'profile',
          })
          return
        }

        this.$store.dispatch('ui/showProfile', this.user)
      }
    },
  },
})
</script>
<style scoped lang="less" src="./QuickProfile.less"></style>
