<template src="./Edit.html"></template>

<script lang="ts">
import { number } from 'io-ts'
import Vue from 'vue'

// @ts-ignore
import { SmileIcon } from 'vue-feather-icons'
import { Config } from '~/config'
import { KeybindingEnum } from '~/libraries/Enums/enums'
import Editable from '~/components/views/chat/chatbar/Editable.vue'

declare module 'vue/types/vue' {
  interface Vue {
    saveMessage: Function
    cancelMessage: Function
    lengthCount: number
    charlimit: boolean
  }
}

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
    lengthCount() {
      return this.$data.content.length
    },
    charlimit() {
      return this.lengthCount > this.maxChars
    },
  },
  mounted() {
    this.$data.content = this.$props.message
  },
  methods: {
    saveMessage() {
      this.$emit('commitMessage', this.$data.content.slice(0, this.maxChars))
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
