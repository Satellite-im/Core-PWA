<template src="./Edit.html"></template>

<script lang="ts">
import Vue from 'vue'

import { SmileIcon } from 'satellite-lucide-icons'
import { Config } from '~/config'
import { KeybindingEnum } from '~/libraries/Enums/enums'
import Editable from '~/components/interactables/Editable/Editable.vue'

export default Vue.extend({
  components: {
    SmileIcon,
    Editable,
  },
  props: {
    message: {
      type: String,
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
    lengthCount(): number {
      return this.content.length
    },
    charlimit(): boolean {
      return this.lengthCount > this.maxChars
    },
  },
  mounted() {
    this.content = this.message
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
  },
})
</script>

<style lang="less" src="./Edit.less"></style>
