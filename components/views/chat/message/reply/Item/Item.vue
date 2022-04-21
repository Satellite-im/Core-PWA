<template src="./Item.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { UIMessage, Group } from '~/types/messaging'
import {
  getUsernameFromState,
  convertTimestampToDate,
  getAddressFromState,
} from '~/utilities/Messaging'

export default Vue.extend({
  props: {
    message: {
      type: Object as PropType<UIMessage>,
      default: () => ({
        id: '0',
        at: 1620515543000,
        type: 'text',
        payload: 'Invalid Message',
      }),
    },
    group: {
      type: Object as PropType<Group>,
      default: () => {},
    },
    reply: {
      type: Object,
      default: () => {},
    },
    markdownToHtml: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    ...mapState(['ui', 'friends', 'accounts']),
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
      if (!this.reply.at) {
        return ''
      }
      return convertTimestampToDate(this.$t('friends.details'), this.reply.at)
    },
    src(): string {
      // To check if the sender is you we just compare the from field
      // with your textile public key
      if (this.reply.from === this.$TextileManager?.getIdentityPublicKey()) {
        const myHash = this.accounts.details?.profilePicture
        return myHash ? `${this.$Config.textile.browser}/ipfs/${myHash}` : ''
      }

      // Try to find the friend you are talking to
      const friend = this.$Hounddog.findFriend(this.reply.from, this.friends)

      if (friend?.profilePicture) {
        return `${this.$Config.textile.browser}/ipfs/${friend?.profilePicture}`
      }

      return ''
    },
  },
})
</script>
<style lang="less" src="./Item.less"></style>
