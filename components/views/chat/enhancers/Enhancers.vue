<template src="./Enhancers.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapGetters, mapState } from 'vuex'
import { SmileIcon, GridIcon, ImageIcon } from 'satellite-lucide-icons'
import { EmojiPicker } from 'vue-emoji-picker'
import { Friend } from '~/types/ui/friends'
import { EmojiUsage } from '~/store/ui/types'
import iridium from '~/libraries/Iridium/IridiumManager'

declare module 'vue/types/vue' {
  interface Vue {
    convertRem: (value: string) => number
    toggleEnhancers: () => void
    clickEvent: () => void
    resetSearch: () => void
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
      search: '',
      clickEvent: () => {},
      featureReadyToShow: false,
    }
  },
  computed: {
    ...mapState(['ui']),
    ...mapGetters({
      recipient: 'conversation/recipient',
      getSortedMostUsedEmojis: 'ui/getSortedMostUsedEmojis',
    }),
    mostUsedEmojis(): EmojiUsage[] {
      return this.getSortedMostUsedEmojis.slice(0, 10)
    },
    route: {
      get(): string {
        return this.ui.enhancers.route
      },
      set(newRoute: string) {
        const prevRoute = this.ui.enhancers.route
        if (newRoute !== prevRoute) {
          this.$store.commit('ui/toggleEnhancers', {
            show: true,
            route: newRoute,
          })
        }
        this.resetSearch()
      },
    },
  },
  watch: {
    route() {
      this.resetSearch()
    },
    'ui.enhancers.show'() {
      this.resetSearch()
    },
  },
  methods: {
    /**
     * @method addEmoji
     * @description Adds emoji to either the users current chatbar or a messages emoji reactions depending on state of this.ui.settingReaction.status
     * TODO: Change reactor in dispatch addReaction to current users name instead of 'Jpanay' //AP-390
     * @param emoji Emoji-mart emoji event object
     * @example v-on:select="addEmoji"
     */
    addEmoji(emoji: any, emojiName: string) {
      if (this.ui.settingReaction.status) {
        iridium.chat.toggleMessageReaction({
          conversationId: this.ui.settingReaction.conversationId,
          messageId: this.ui.settingReaction.messageId,
          reaction: emoji,
        })
      } else {
        this.$store.dispatch('ui/setChatbarContent', {
          content: this.ui.chatbarContent + emoji,
        })
        this.$store.dispatch('ui/setChatbarFocus')
      }
      this.toggleEnhancers()
      this.$store.commit('ui/updateMostUsedEmoji', { emoji, name: emojiName })
    },
    /**
     * @method setRoute DocsTODO
     * @description
     * @param route
     * @example
     */
    setRoute(route: string) {
      this.$store.commit('ui/toggleEnhancers', {
        show: true,
        floating: !!this.$device.isMobile,
        route,
      })
    },
    /**
     * @method toggleEnhancers DocsTODO
     * @description Toggles enhancers by committing the opposite of it's current value (this.ui.enhancers.show) to toggleEnhancers in state
     * @example v-on:click="toggleEnhancers"
     */
    toggleEnhancers(event: Event) {
      this.clickEvent()
      /* Ignore outside toggling when glyph & emoji toggle btn is clickd (for preventing twice-toggling)  */
      const glyphToggleElm = document.getElementById('glyph-toggle')
      const emojiToggleElm = document.getElementById('emoji-toggle')
      // @ts-ignore
      if (
        !event ||
        !(
          glyphToggleElm?.contains(event.target) ||
          emojiToggleElm?.contains(event.target)
        )
      ) {
        this.$store.commit('ui/toggleEnhancers', {
          show: !this.ui.enhancers.show,
          floating: this.$device.isMobile,
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
    /**
     * @method calculatePositionOnScreen
     * @description This returns a "x cordinate" to have the Enhancer window to load on the right or left screen
     * @example calculatePositionOnScreen(ui.enhancers.position[0])
     */
    calculatePositionOnScreen(locationX: number): number {
      if (
        this.convertRem(this.ui.enhancers.defaultWidth) + locationX >
        window.innerWidth
      ) {
        return locationX - this.convertRem(this.ui.enhancers.defaultWidth) * 2
      }
      return locationX - this.convertRem(this.ui.enhancers.defaultWidth)
    },
    /**
     * @method convertRem
     * @description This converts an rem value into a pixel value
     * @example convertRem('24rem') => if the document font size is 16px, this returns the value of 24*16, or 384.
     * @todo TODO: Move this function into an utility folder
     */
    convertRem(value: string): number {
      const fontSize = parseFloat(
        getComputedStyle(document.documentElement).fontSize, // Get the font size on the html tag, eg 16 (px), 2 (px), etc
      )
      const remNumber = Number(value.replace('rem', ''))
      return remNumber * fontSize
    },
    resetSearch(): void {
      this.search = ''
    },
  },
})
</script>
<style scoped lang="less" src="./Enhancers.less"></style>
