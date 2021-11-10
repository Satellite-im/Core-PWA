<template src="./Enhancers.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { SmileIcon, GridIcon, ImageIcon } from 'satellite-lucide-icons'
import { EmojiPicker } from 'vue-emoji-picker'

declare module 'vue/types/vue' {
  interface Vue {
    convertRem: (value: string) => number
    toggleEnhancers: () => void
  }
}

export default Vue.extend({
  components: {
    SmileIcon,
    GridIcon,
    ImageIcon,
    EmojiPicker,
  },
  data() {
    return {
      route: 'emoji',
      search: '',
      clickEvent: () => {},
      onScreenLocation: [],
    }
  },
  computed: {
    ...mapState(['ui']),
  },
  watch: {
    route() {
      this.openEmoji()
    },
    'ui.enhancers.show'(value) {
      this.$data.onScreenLocation = this.ui.enhancers.position
      if (value) this.openEmoji()
    },
  },
  mounted() {
    this.openEmoji()
    this.$data.onScreenLocation = this.ui.enhancers.position
    this.toggleEnhancers()
  },
  methods: {
    /**
     * @method openEmoji DocsTODO
     * @description
     * @param
     * @example
     */
    openEmoji() {
      if (this.route !== 'emoji') return
      this.$nextTick(() => {
        setTimeout(() => {
          // @ts-ignore
          this.$refs.emojiInvoker?.click()
        }, 0)
      })
    },
    /**
     * Adds emoji to current text input
     * (emoji: any) Comes from <picker/> select event
     */
    /**
     * @method addEmoji
     * @description Adds emoji to either the users current chatbar or a messages emoji reactions depending on state of this.ui.settingReaction.status
     * TODO: Change reactor in dispatch addReaction to current users name instead of 'Jpanay'
     * @param emoji Emoji-mart emoji event object
     * @example v-on:select="addEmoji"
     */
    addEmoji(emoji: any) {
      if (this.ui.settingReaction.status) {
        this.$store.dispatch('ui/addReaction', {
          emoji,
          reactor: this.$mock.user.name,
          groupID: this.ui.settingReaction.groupID,
          messageID: this.ui.settingReaction.messageID,
          replyID: this.ui.settingReaction.replyID,
        })
      } else {
        this.$store.commit('ui/chatbarContent', this.ui.chatbarContent + emoji)
      }
    },
    /**
     * @method setRoute DocsTODO
     * @description
     * @param route
     * @example
     */
    setRoute(route: string) {
      this.$data.route = route
    },
    /**
     * @method toggleEnhancers DocsTODO
     * @description Toggles enhancers by commiting the opposite of it's current value (this.ui.enhancers.show) to toggleEnhancers in state
     * @example v-on:click="toggleEnhancers"
     */
toggleEnhancers(e: MouseEvent) {
      if (this.ui.enhancers.show) {
        let xVal = this.ui.enhancers[0]
        let yVal = this.ui.enhancers[1]
        if (e) {
          xVal = e.clientX
          yVal = e.clientY
        }
        this.$store.commit('ui/toggleEnhancers', {
          show: !this.ui.enhancers.show,
          floating: true,
          position: [xVal, yVal],
          containerWidth: this.$el.clientWidth,
        })
      }
      if (this.ui.settingReaction.status) {
        this.$store.commit('ui/settingReaction', {
          status: false,
          groupID: null,
          messageID: null,
        })
      }
    },
    calculatePositionOnScreen(x: number): number {
      if (
        this.convertRem(this.ui.enhancers.defaultWidth) + x >
        window.innerWidth
      ) {
        return x - this.convertRem(this.ui.enhancers.defaultWidth) * 2
      }
      return x - this.convertRem(this.ui.enhancers.defaultWidth)
    },
    /**
     * @method convertRem
     * @description This converts an rem value into a pixel value
     * @example convertRem('24rem') => if the document font size is 16px, this returns the value of 24*16, or 384.
     */
    convertRem(value: string): number {
      // Get the font size on the html tag
      const fontSize = parseFloat(
        getComputedStyle(document.documentElement).fontSize // eg 16 (px), 2 (px), etc
      )
      const remNumber = Number(value.replace('rem', ''))
      return remNumber * fontSize
    },
  },
})
</script>
<style scoped lang="less" src="./Enhancers.less"></style>
