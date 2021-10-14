<template src="./Reactions.html"></template>
<script lang="ts">
// eslint-disable-next-line import/named
import Vue, { PropType } from 'vue'
import { SmileIcon } from 'satellite-lucide-icons'
import { Message, Group, Reply } from '~/types/messaging'

export default Vue.extend({
  components: {
    SmileIcon,
  },
  props: {
    reply: {
      type: Object as PropType<Reply>,
      default: () => ({
        id: '',
        at: 1620515543000,
        type: 'text',
        payload: 'Invalid Reply',
      }),
    },
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
      hovering: false,
    }
  },
  computed: {
    reactions() {
      return this.reply.id
        ? this.$props.reply?.reactions
        : this.$props.message?.reactions
    },
  },
  methods: {
    /**
     * @method emojiReaction DocsTODO
     * @description
     * @example
     */
    emojiReaction() {
      this.$store.commit('settingReaction', {
        status: true,
        groupID: this.$props.group.id,
        messageID: this.$props.message.id,
        replyID: this.$props.reply.id,
      })
      this.$store.commit('toggleEnhancers', { show: true })
    },
    /**
     * @method quickReaction DocsTODO
     * @description
     * @param emoji
     * @example
     */
    quickReaction(emoji: String) {
      this.$store.dispatch('addReaction', {
        emoji,
        reactor: this.$mock.user.name,
        groupID: this.$props.group.id,
        messageID: this.$props.message.id,
        replyID: this.$props.reply.id,
      })
    },
    /**
     * @method toggleReactors DocsTODO
     * @description
     * @param emoji
     * @example
     */
    toggleReactors(emoji: any) {
      this.$data.hovering = emoji
    },
    /**
     * @method didIReact DocsTODO
     * @description
     * @param reaction
     * @returns
     * @example
     */
    didIReact(reaction: any) {
      return reaction.reactors.includes(this.$mock.user.name)
    },
  },
})
</script>
<style lang="less" src="./Reactions.less"></style>
