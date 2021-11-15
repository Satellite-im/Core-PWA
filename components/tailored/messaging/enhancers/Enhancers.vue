<template src="./Enhancers.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { SmileIcon, GridIcon, ImageIcon } from 'satellite-lucide-icons'
import { EmojiPicker } from 'vue-emoji-picker'

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
    }
  },
  computed: {
    ...mapState(['ui']),
    route: {
      get() {
        return this.ui.enhancers.route
      },
      set(data: string) {
        this.$store.commit('ui/toggleEnhancers', {
          show: true,
          route: data,
        })
      }
    }
  },
  watch: {
    route() {
      this.openEmoji()
    },
    'ui.enhancers.show'(value) {
      if (value) this.openEmoji()
    },
  },
  mounted() {
    this.openEmoji()
  },
  methods: {
    /**
     * @method openEmoji DocsTODO
     * @description
     * @param
     * @example
     */
    openEmoji() {
      if (this.route !== 'emotes') return
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
        this.$store.dispatch('textile/sendReactionMessage', {
          to: this.ui.settingReaction.to,
          emoji,
          reactTo: this.ui.settingReaction.messageID,
        })
        this.toggleEnhancers()
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
      this.$store.commit('ui/toggleEnhancers', {
        show: true,
        route,
      })
    },
    /**
     * @method toggleEnhancers DocsTODO
     * @description Toggles enhancers by commiting the opposite of it's current value (this.ui.enhancers.show) to toggleEnhancers in state
     * @example v-on:click="toggleEnhancers"
     */
    toggleEnhancers(event: Event) {
      this.clickEvent()
      /* Prevent toggle twice when toggle enhancer button is clicked (for mobile case ) */
      const chatToggleEnhancer = document.getElementById('chat-enhancer-toggle')
      // @ts-ignore
      if (!chatToggleEnhancer?.contains(event.target)) {
        this.$store.commit('ui/toggleEnhancers', {
          show: !this.ui.enhancers.show,
        })
      }
      this.$store.commit('ui/toggleEnhancers', {
        show: !this.ui.enhancers.show,
      })
      if (this.ui.settingReaction.status) {
        this.$store.commit('ui/settingReaction', {
          status: false,
          groupID: null,
          messageID: null,
        })
      }
    },
  },
})
</script>
<style scoped lang="less" src="./Enhancers.less"></style>
