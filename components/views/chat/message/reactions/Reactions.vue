<template src="./Reactions.html"></template>
<script lang="ts">
// eslint-disable-next-line import/named
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { SmileIcon } from 'satellite-lucide-icons'
import { Group, UIReply, UIMessage } from '~/types/messaging'
import { getUsernameFromState } from '~/utilities/Messaging'

export default Vue.extend({
  components: {
    SmileIcon,
  },
  props: {
    reply: {
      type: Object as PropType<UIReply>,
      default: () => ({
        id: '',
        at: 1620515543000,
        type: 'text',
        payload: 'Invalid Reply',
      }),
    },
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
  },
  data() {
    return {
      hovering: false,
    }
  },
  computed: {
    ...mapState(['accounts']),
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
    emojiReaction(e: MouseEvent) {
      this.$store.commit('ui/settingReaction', {
        status: true,
        groupID: this.$props.group.id,
        messageID: this.$props.reply.id
          ? this.$props.reply.id
          : this.$props.message.id,
        to:
          this.$props.message.to === this.accounts.details.textilePubkey
            ? this.$props.message.from
            : this.$props.message.to,
      })
      const clickX = e.clientX
      const clickY = e.clientY
      this.$store.commit('ui/toggleEnhancers', {
        show: true,
        floating: !!this.$device.isMobile,
        position: [clickX, clickY],
        containerWidth: this.$el.clientWidth,
      })
    },
    /**
     * @method quickReaction DocsTODO
     * @description
     * @param emoji
     * @example
     */
    quickReaction(emoji: String) {
      this.$store.dispatch('textile/sendReactionMessage', {
        to:
          this.$props.message.to === this.accounts.details.textilePubkey
            ? this.$props.message.from
            : this.$props.message.to,
        emoji,
        reactTo: this.$props.reply.id
          ? this.$props.reply.id
          : this.$props.message.id,
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
      return reaction.reactors.includes(this.accounts.details.textilePubkey)
    },
    getReactorsList(reactors: string[], limit = 3) {
      const numberOfReactors = reactors.length
      const list = reactors
        .slice(0, limit)
        .reduce(
          (reactorsList, reactorPublickey, i) =>
            `${reactorsList}${i === 0 ? '' : ','}${getUsernameFromState(
              reactorPublickey,
              this.$store.state,
            )}`,
          '',
        )
      return `${list}${
        numberOfReactors > limit
          ? `and ${numberOfReactors - limit} more ...`
          : ''
      }`
    },
  },
})
</script>
<style lang="less" src="./Reactions.less"></style>
