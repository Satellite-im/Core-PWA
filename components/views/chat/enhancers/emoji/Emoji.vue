<template src="./Emoji.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'
import { EmojiPicker } from 'vue-emoji-picker'
import iridium from '~/libraries/Iridium/IridiumManager'
import { EmojiUsage } from '~/store/ui/types'

export default Vue.extend({
  components: {
    EmojiPicker,
  },
  data() {
    return {
      search: '',
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
  },
  methods: {
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
    resetSearch(): void {
      this.search = ''
    },
    toggleEnhancers(event: Event) {
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
  },
})
</script>

<style scoped lang="less" src="./Emoji.less"></style>
