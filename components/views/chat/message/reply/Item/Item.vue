<template src="./Item.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState, mapGetters } from 'vuex'
import { ConversationMessage } from '~/libraries/Iridium/chat/types'
import { RootState } from '~/types/store/store'
import { toHTML } from '~/libraries/ui/Markdown'
import {
  getUsernameFromState,
  getAddressFromState,
} from '~/utilities/Messaging'

export default Vue.extend({
  props: {
    message: {
      type: Object as PropType<ConversationMessage & { id: string }>,
      required: true,
    },
    reply: {
      type: Object as PropType<(ConversationMessage & { id: string })[]>,
      required: true,
    },
  },
  computed: {
    ...mapState({
      ui: (state) => (state as RootState).ui,
      friends: (state) => (state as RootState).friends,
      accounts: (state) => (state as RootState).accounts,
    }),
    ...mapGetters('friends', ['findFriendByKey']),
    ...mapGetters('settings', ['getTimestamp']),
    address() {
      if (!this.reply.from) {
        return ''
      }
      return getAddressFromState(this.reply.from, this.$store.state)
    },
    username() {
      if (!this.reply.from) {
        return ''
      }
      return getUsernameFromState(this.reply.from, this.$store.state)
    },
    timestamp() {
      return this.getTimestamp({ time: this.reply.at })
    },
    src(): string {
      return ''
      // // To check if the sender is you we just compare the from field
      // // with your textile public key
      // if (this.reply.from === this.$TextileManager?.getIdentityPublicKey()) {
      //   const myHash = this.accounts.details?.profilePicture
      //   return myHash ? `${this.$Config.textile.browser}/ipfs/${myHash}` : ''
      // }

      // // Try to find the friend you are talking to
      // const friend = this.findFriendByKey(this.reply.from)

      // if (friend?.profilePicture) {
      //   return `${this.$Config.textile.browser}/ipfs/${friend?.profilePicture}`
      // }

      // return ''
    },
  },
  methods: {
    markdownToHtml(text: string) {
      return toHTML(text, { liveTyping: false })
    },
    setReplyChatbarMessage() {
      this.$store.commit('ui/setReplyChatbarMessage', this.message)
    },
  },
})
</script>
<style lang="less" src="./Item.less"></style>
