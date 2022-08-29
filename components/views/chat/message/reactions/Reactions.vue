<template src="./Reactions.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { SmileIcon } from 'satellite-lucide-icons'
import { ConversationMessage } from '~/libraries/Iridium/chat/types'
import iridium from '~/libraries/Iridium/IridiumManager'
import { RootState } from '~/types/store/store'

type Reaction = {
  emoji: string
  names: string[]
  dids: string[]
}

export default Vue.extend({
  components: {
    SmileIcon,
  },
  props: {
    message: {
      type: Object as PropType<ConversationMessage>,
      required: true,
    },
  },
  computed: {
    ...mapState({
      accounts: (state) => (state as RootState).accounts,
      ui: (state) => (state as RootState).ui,
    }),
    reactions(): Reaction[] {
      if (!this.message.reactions) {
        return []
      }
      const didsForEmoji: { [key: string]: string[] } = {}
      Object.entries(this.message.reactions).forEach(([did, emojis]) => {
        emojis.forEach((emoji) => {
          if (!didsForEmoji[emoji]) {
            didsForEmoji[emoji] = [did]
            return
          }
          didsForEmoji[emoji].push(did)
        })
      })
      const reactions = Object.entries(didsForEmoji).map(([emoji, dids]) => ({
        emoji,
        names: dids.map((did) => iridium.users.getUser(did)?.name),
        dids,
      }))
      return reactions
    },
  },
  methods: {
    /**
     * @method quickReaction DocsTODO
     * @description
     * @param emoji
     * @example
     */
    quickReaction(emoji: string) {
      iridium.chat.toggleMessageReaction({
        conversationId: this.message.conversationId,
        messageId: this.message.id,
        reaction: emoji,
      })
    },
    /**
     * @method didIReact DocsTODO
     * @description
     * @param reaction
     * @returns
     * @example
     */
    didReact(reaction: Reaction) {
      if (!iridium.connector) {
        return false
      }
      return reaction.dids.includes(iridium.connector.id)
    },
    emojiReaction() {
      this.$store.commit('ui/settingReaction', {
        status: true,
        conversationId: this.message.conversationId,
        messageId: this.message.id,
      })
      this.$store.commit('ui/toggleEnhancers', {
        show: !this.ui.enhancers.show,
        floating: true,
      })
    },
  },
})
</script>
<style lang="less" src="./Reactions.less"></style>
