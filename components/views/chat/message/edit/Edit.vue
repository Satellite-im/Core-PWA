<template src="./Edit.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { SmileIcon } from 'satellite-lucide-icons'
import { Config } from '~/config'
import { KeybindingEnum } from '~/libraries/Enums/enums'
import Editable from '~/components/interactables/Editable/Editable.vue'
import { ConversationMessage } from '~/libraries/Iridium/chat/types'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  components: {
    SmileIcon,
    Editable,
  },
  props: {
    message: {
      type: Object as PropType<ConversationMessage>,
      default: null,
      required: true,
    },
    maxChars: {
      type: Number,
      default: Config.chat.messageMaxChars,
    },
  },
  data() {
    return {
      content: '',
    }
  },
  computed: {
    ...mapState({
      ui: (state) => (state as RootState).ui,
    }),
    lengthCount(): number {
      return this.content.length
    },
    charlimit(): boolean {
      return this.lengthCount > this.maxChars
    },
    isError(): boolean {
      return this.charlimit || !this.content.length
    },
  },
  mounted() {
    this.content = this.message.body ?? ''
  },
  methods: {
    saveMessage() {
      if (this.content.trim().length === 0) {
        this.$toast.error(this.$t('errors.chat.empty_message_error') as string)
        return
      }
      this.$emit('commitMessage', this.content.slice(0, this.maxChars))
    },
    cancelMessage() {
      this.$emit('cancelMessage')
    },
    /**
     * Called from chatbar's keydown event to process key events for typing in chatbar.
     */
    handleInputKeydown(event: KeyboardEvent) {
      switch (event.key) {
        case KeybindingEnum.ENTER:
          if (!event.shiftKey) {
            event.preventDefault()
            this.saveMessage()
          }
          break
        case KeybindingEnum.ESCAPE:
          this.cancelMessage()
          break
        default:
          break
      }
    },
    emojiReaction() {
      this.$store.commit('ui/toggleEnhancers', {
        show: !this.ui.enhancers.show,
        floating: true,
      })
    },
  },
})
</script>

<style lang="less" src="./Edit.less"></style>
