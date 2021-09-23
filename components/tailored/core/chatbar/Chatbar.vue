<template src="./Chatbar.html"></template>

<script lang="ts">
import Vue from 'vue'
import FileUpload from '../fileupload/FileUpload.vue'
import { mapState } from 'vuex'
import {
  containsCommand,
  parseCommand,
  commands,
  isArgsValid,
} from '~/libraries/ui/Commands'

export default Vue.extend({
  components: {
    FileUpload,
  },
  data() {
    return {
      text: '',
      maxChars: 256,
      showEmojiPicker: false,
    }
  },
  computed: {
    /**
     * Computes the amount of characters left
     */
    /**
     * @method charlimit DocsTODO
     * @description
     * @returns
     * @example
     */
    charlimit() {
      return this.$data.text.length > this.$data.maxChars
    },
    /**
     * @method hasCommand DocsTODO
     * @description
     * @returns
     * @example
     */
    hasCommand() {
      return (
        containsCommand(this.$store.state.ui.chatbarContent) &&
        commands.some((cmd) =>
          cmd.name.startsWith(
            parseCommand(this.$store.state.ui.chatbarContent).name.toLowerCase()
          )
        )
      )
    },
    /**
     * @method isValidCommand DocsTODO
     * @description
     * @returns
     * @example
     */
    isValidCommand() {
      const currentText = parseCommand(
        this.$store.state.ui.chatbarContent
      ).name.toLowerCase()
      const currentArgs = parseCommand(this.$store.state.ui.chatbarContent).args
      const currentCommand = commands.find((c) => c.name === currentText)

      return currentCommand && isArgsValid(currentCommand, currentArgs)
    },
    value: {
      /**
       * @method get DocsTODO
       * @description
       * @returns
       * @example
       */
      get() {
        return this.$store.state.ui.chatbarContent
      },
      /**
       * @method set DocsTODO
       * @description
       * @param val
       * @returns
       * @example
       */
      set(val: string) {
        this.$store.commit('chatbarContent', val)
        this.$data.text = val
      },
    },
  },
  methods: {
    /**
     * @method toggleEnhancers DocsTODO
     * @description
     * @example
     */
    toggleEnhancers() {
      this.$store.commit('toggleEnhancers', !this.$store.state.ui.showEnhancers)
    },
    /**
     * When textarea for chat is changed, autoGrow handles chat section to grow to allow multiple line display
     */
    /**
     * @method autoGrow DocsTODO
     * @description
     * @example
     */
    autoGrow() {
      // made const variables from this.$refs --> HTMLElement through typecasting
      const messageBox = this.$refs.messageuser as HTMLElement
      const chatbarGroup = this.$refs.chatbar as HTMLElement
      const wrap = this.$refs.wrap as HTMLElement

      // set default height to be auto, so it will expand as needed but NOT on every input
      messageBox.style.height = 'auto'
      if (this.$data.text.split('\n').length > 1) {
        wrap.classList.add('expanded')
      } else {
        wrap.classList.remove('expanded')
      }
      if (messageBox.scrollHeight < 112) {
        messageBox.style.height = `${messageBox.scrollHeight + 2}px`
        chatbarGroup.style.height = `${messageBox.scrollHeight + 42}px`
      } else {
        messageBox.style.height = '112px'
        chatbarGroup.style.height = `152px`
      }
      messageBox.scrollTop = messageBox.scrollHeight
    },
    /**
     * @method handleInputChange DocsTODO
     * @description
     * @example
     */
    handleInputChange() {
      this.autoGrow()
    },
    /**
     * @method handleInputKeydown DocsTODO
     * @description
     * @param event
     * @returns
     * @example
     */
    handleInputKeydown(event: KeyboardEvent) {
      switch (event.key) {
        case 'Backspace':
          {
            const parsedCommand = parseCommand(this.value)
            const currentCommand = commands.find(
              (c) => c.name === parsedCommand.name.toLowerCase()
            )
            if (currentCommand && parsedCommand.args.length === 0) {
              this.value = ''
              return false
            }
          }
          break
        case 'Enter':
          if (!event.shiftKey) {
            event.preventDefault()
            this.sendMessage()
          }
          break
      }
      return true
    },
    /**
     * @method sendMessage DocsTODO
     * @description
     * @example
     */
    sendMessage() {
      this.$store.dispatch('sendMessage', {
        value: this.value,
        user: this.$mock.user,
        isOwner: true,
      })
      this.value = ''
      this.$nextTick(() => {
        this.autoGrow()
      })
    },
  },
})
</script>

<style scoped lang="less" src="./Chatbar.less"></style>
