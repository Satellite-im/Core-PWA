<template src="./Reactions.html"></template>
<script lang="ts">
// eslint-disable-next-line import/named
import Vue, { PropType } from 'vue'
import { Message, Group } from '~/types/messaging'

export default Vue.extend({
  props: {
    message: {
      type: Object as PropType<Message>,
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
  },
  data() {
    return {
      showReactors: {},
    }
  },
  methods: {
    emojiReaction() {
      this.$store.commit('settingReaction', {
        status: true,
        groupID: this.$props.group.id,
        messageID: this.$props.message.id,
      })
      this.$store.commit('toggleEnhancers', true)
    },
    quickReaction(emoji: String) {
      this.$store.dispatch('addReaction', {
        emoji,
        reactor: 'user1',
        groupID: this.$props.group.id,
        messageID: this.$props.message.id,
      })
    },
    toggleReactors(toggle: Boolean, emoji: String) {
      console.log(`Toggling ${toggle} for ${emoji}`)
    },
  },
})
</script>
<style lang="less" src="./Reactions.less"></style>
