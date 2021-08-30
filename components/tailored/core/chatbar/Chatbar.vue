<template src="./Chatbar.html"></template>

<script lang="ts">
import Vue from 'vue'
import FileUpload from '../fileupload/FileUpload.vue'
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
    charlimit() {
      return this.$data.text.length > this.$data.maxChars
    },
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
    isValidCommand() {
      const currentText = parseCommand(
        this.$store.state.ui.chatbarContent
      ).name.toLowerCase()
      const currentArgs = parseCommand(this.$store.state.ui.chatbarContent).args
      const currentCommand = commands.find((c) => c.name === currentText)

      return currentCommand && isArgsValid(currentCommand, currentArgs)
    },
    value: {
      get() {
        return this.$store.state.ui.chatbarContent
      },
      set(val) {
        this.$store.commit('chatbarContent', val)
        this.$data.text = val
      },
    },
  },
  methods: {
    toggleEnhancers() {
      this.$store.commit('toggleEnhancers', !this.$store.state.ui.showEnhancers)
    },
    /**
     * When textarea for chat is changed, autoGrow handles chat section to grow to allow multiple line display
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
        chatbarGroup.style.height = '152px'
      }
      messageBox.scrollTop = messageBox.scrollHeight
    },
    handleInputChange() {
      this.autoGrow()
    },
    sendMessage() {
      this.$store.dispatch('sendMessage', {
        value: this.value,
        user: this.$mock.user,
        isOwner: true,
      })
      this.value = ''
    },
  },
})
</script>

<style scoped lang="less" src="./Chatbar.less"></style>
