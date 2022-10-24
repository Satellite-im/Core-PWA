<template src="./Emoji.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'
import { EmojiPicker } from 'vue-emoji-picker'
import iridium from '~/libraries/Iridium/IridiumManager'
import { EmojiUsage } from '~/store/ui/types'
import { RootState } from '~/types/store/store'

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
    ...mapState({
      chatbarContent: (state) => (state as RootState).ui.chatbarContent,
      messageReaction: (state) => (state as RootState).chat.messageReaction,
    }),
    ...mapGetters({
      recipient: 'conversation/recipient',
      getSortedMostUsedEmojis: 'ui/getSortedMostUsedEmojis',
    }),
    mostUsedEmojis(): EmojiUsage[] {
      return this.getSortedMostUsedEmojis.slice(0, 10)
    },
  },
  methods: {
    async addEmoji(emoji: string, emojiName: string) {
      if (this.messageReaction?.messageId) {
        await iridium.chat.toggleMessageReaction({
          conversationId: this.messageReaction.conversationId,
          messageId: this.messageReaction.messageId,
          reaction: emoji,
        })
        this.$store.commit('chat/setMessageReaction', undefined)
      } else {
        this.$store.dispatch('ui/setChatbarContent', {
          content: this.chatbarContent + emoji,
        })
        this.$store.dispatch('ui/setChatbarFocus')
      }
      this.$store.commit('chat/setEnhancersRoute', '')
      this.$store.commit('ui/updateMostUsedEmoji', { emoji, name: emojiName })
    },
    resetSearch(): void {
      this.search = ''
    },
  },
})
</script>

<style scoped lang="less" src="./Emoji.less"></style>
